# Board Single Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-screen board where authenticated users can create posts, comments, and nested replies, with role-based edit/delete permissions and soft-deleted content that keeps thread structure intact.

**Architecture:** Use Prisma models for `Post` and self-referential `Comment` records, plus a `role` field on `User`. Expose the role through Auth.js session data so the UI can render permissions, but keep all authorization checks in server actions. Render the entire experience from one server page, with small client components only for interactive forms and inline reply/edit toggles.

**Tech Stack:** Next.js 16 App Router, TypeScript, Auth.js v5, Prisma, PostgreSQL, server actions, shadcn/ui, React 19.

---

## File Map

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Add `User.role`, `Post`, and threaded `Comment` models |
| `lib/auth.ts` | Include `role` in the session payload and keep auth checks centralized |
| `types/next-auth.d.ts` | Type augmentation for `session.user.role` and `user.role` |
| `lib/board.ts` | Read-side helpers for board data, comment tree building, and permission checks |
| `app/actions/board.ts` | Server actions for create/update/delete operations and revalidation |
| `app/page.tsx` | Single-screen board page entry point |
| `app/components/board.tsx` | Page composition and top-level board layout |
| `app/components/post-editor.tsx` | Create/edit post form UI |
| `app/components/comment-thread.tsx` | Recursive thread renderer |
| `app/components/comment-item.tsx` | Single comment row with reply/edit/delete controls |
| `app/components/comment-form.tsx` | Shared form for new comments and replies |
| `components/ui/input.tsx` | shadcn text input for post title and editable fields |
| `components/ui/textarea.tsx` | shadcn textarea for post/comment body text |

---

### Task 1: Extend the schema and auth session shape

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `lib/auth.ts`
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: Update the Prisma schema**

Replace the user-facing parts of `prisma/schema.prisma` with the board models below while keeping the existing Auth.js tables intact:

```prisma
enum Role {
  admin
  moderator
  member
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(member)
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([authorId, createdAt])
}

model Comment {
  id        String    @id @default(cuid())
  postId    String
  parentId  String?
  content   String
  authorId  String
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([postId, parentId, createdAt])
  @@index([authorId, createdAt])
}
```

- [ ] **Step 2: Expose the user role from Auth.js**

Update `lib/auth.ts` so the session callback copies the Prisma user role into `session.user.role`:

```ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
})
```

- [ ] **Step 3: Add TypeScript augmentation**

Create `types/next-auth.d.ts`:

```ts
import type { DefaultSession } from "next-auth"

type BoardRole = "admin" | "moderator" | "member"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: BoardRole
    }
  }

  interface User {
    id: string
    role: BoardRole
  }
}
```

- [ ] **Step 4: Verify the model and types compile**

Run:

```bash
pnpm prisma generate
pnpm type-check
```

Expected:
- Prisma Client regenerates without schema errors
- TypeScript exits with code `0`

---

### Task 2: Add board data helpers and server actions

**Files:**
- Create: `lib/board.ts`
- Create: `app/actions/board.ts`

- [ ] **Step 1: Add read-side helpers**

Create `lib/board.ts` with helpers for loading the board and building the nested comment tree:

```ts
import { db } from "@/lib/db"

export type BoardRole = "admin" | "moderator" | "member"

export type BoardComment = {
  id: string
  content: string
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
    role: BoardRole
  }
  replies: BoardComment[]
}

export type BoardPost = {
  id: string
  title: string
  content: string
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
    role: BoardRole
  }
  comments: BoardComment[]
}

export async function getBoardPost() {
  return db.post.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, image: true, role: true } },
              replies: true,
            },
          },
        },
      },
    },
  })
}
```

- [ ] **Step 2: Add authorization helpers**

In the same file, add helpers that keep permission checks consistent across all actions:

```ts
export function canEditContent(
  actorRole: BoardRole | undefined,
  actorId: string | undefined,
  ownerId: string
) {
  return actorRole === "admin" || actorRole === "moderator" || actorId === ownerId
}

export function canDeleteContent(
  actorRole: BoardRole | undefined,
  actorId: string | undefined,
  ownerId: string
) {
  return canEditContent(actorRole, actorId, ownerId)
}
```

- [ ] **Step 3: Create server actions for board mutations**

Create `app/actions/board.ts` with server actions that return a simple status object and revalidate the page after success:

```ts
"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { canEditContent } from "@/lib/board"

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Not authorized" }
  }

  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  await db.post.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  })

  revalidatePath("/")
  return { ok: true }
}

export async function createComment(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Not authorized" }
  }

  const postId = String(formData.get("postId") ?? "")
  const parentId = String(formData.get("parentId") ?? "")
  const content = String(formData.get("content") ?? "").trim()
  if (!postId || !content) {
    return { error: "Comment content is required" }
  }

  await db.comment.create({
    data: {
      postId,
      parentId: parentId || null,
      content,
      authorId: session.user.id,
    },
  })

  revalidatePath("/")
  return { ok: true }
}
```

- [ ] **Step 4: Add comment, reply, edit, and soft delete actions**

Implement the remaining actions in the same file using the same pattern and the same server-side permission checks:

```ts
export async function updatePost(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Not authorized" }
  const postId = String(formData.get("postId") ?? "")
  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post || !canEditContent(session.user.role, session.user.id, post.authorId)) {
    return { error: "Not authorized" }
  }
  await db.post.update({ where: { id: postId }, data: { title, content } })
  revalidatePath("/")
  return { ok: true }
}

export async function updateComment(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Not authorized" }
  const commentId = String(formData.get("commentId") ?? "")
  const content = String(formData.get("content") ?? "").trim()
  const comment = await db.comment.findUnique({ where: { id: commentId } })
  if (!comment || !canEditContent(session.user.role, session.user.id, comment.authorId)) {
    return { error: "Not authorized" }
  }
  await db.comment.update({ where: { id: commentId }, data: { content } })
  revalidatePath("/")
  return { ok: true }
}

export async function deletePost(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Not authorized" }
  const postId = String(formData.get("postId") ?? "")
  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post || !canEditContent(session.user.role, session.user.id, post.authorId)) {
    return { error: "Not authorized" }
  }
  await db.post.update({ where: { id: postId }, data: { deletedAt: new Date() } })
  revalidatePath("/")
  return { ok: true }
}

export async function deleteComment(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Not authorized" }
  const commentId = String(formData.get("commentId") ?? "")
  const comment = await db.comment.findUnique({ where: { id: commentId } })
  if (!comment || !canEditContent(session.user.role, session.user.id, comment.authorId)) {
    return { error: "Not authorized" }
  }
  await db.comment.update({ where: { id: commentId }, data: { deletedAt: new Date() } })
  revalidatePath("/")
  return { ok: true }
}
```

The delete actions should set `deletedAt = new Date()` instead of removing records.

- [ ] **Step 5: Verify server actions compile**

Run:

```bash
pnpm type-check
```

Expected: no type errors in `lib/board.ts` or `app/actions/board.ts`.

---

### Task 3: Build the single-screen board UI

**Files:**
- Modify: `app/page.tsx`
- Create: `app/components/board.tsx`
- Create: `app/components/post-editor.tsx`
- Create: `app/components/comment-thread.tsx`
- Create: `app/components/comment-item.tsx`
- Create: `app/components/comment-form.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`

- [ ] **Step 1: Add input primitives**

Create the missing shadcn-style inputs so the board forms match the existing UI system:

```tsx
// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-8 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}
```

```tsx
// components/ui/textarea.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 2: Replace the home page with the board shell**

Update `app/page.tsx` so it loads the current session and board data, then passes them into a dedicated board component:

```tsx
import { auth } from "@/lib/auth"
import { getBoardPost } from "@/lib/board"
import { Board } from "@/app/components/board"

export default async function Home() {
  const session = await auth()
  const boardPost = await getBoardPost()

  return <Board session={session} boardPost={boardPost} />
}
```

- [ ] **Step 3: Build the board container**

Create `app/components/board.tsx` to handle the page layout, sign-in state, and the top-level post view:

```tsx
import type { Session } from "next-auth"
import type { BoardPost } from "@/lib/board"

export function Board({
  session,
  boardPost,
}: {
  session: Session | null
  boardPost: BoardPost | null
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6">
      <PostEditor session={session} existingPost={boardPost} />
      <section className="rounded-lg border border-border bg-background p-4">
        <CommentThread comments={boardPost?.comments ?? []} session={session} />
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Add the post editor and comment forms**

`app/components/post-editor.tsx` and `app/components/comment-form.tsx` should be client components that use `useActionState` with the server actions from `app/actions/board.ts`. Each form should:

```tsx
<form action={actionFn} className="space-y-3">
  <Input name="title" placeholder="Title" />
  <Textarea name="content" placeholder="Write something..." />
  <Button type="submit">Post</Button>
</form>
```

The comment form should use the same pattern, but accept a hidden `postId` and optional `parentId` field for replies.

- [ ] **Step 5: Render threaded comments recursively**

`app/components/comment-thread.tsx` should recursively render `comment.replies` in creation order and pass permission flags to each comment row:

```tsx
export function CommentThread({ comments, session }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} session={session} depth={0} />
      ))}
    </div>
  )
}
```

`app/components/comment-item.tsx` should indent replies based on `depth`, show the author, timestamp, deleted state, and render reply/edit/delete controls only when the current session can use them.

- [ ] **Step 6: Verify the board UI compiles**

Run:

```bash
pnpm type-check
```

Expected: all new components compile with no missing prop or import errors.

---

### Task 4: Polish permission handling and edge cases

**Files:**
- Modify: `app/actions/board.ts`
- Modify: `app/components/comment-item.tsx`
- Modify: `app/components/board.tsx`

- [ ] **Step 1: Add soft-delete placeholders**

When a post or comment has `deletedAt`, render a muted placeholder instead of the original content:

```tsx
{comment.deletedAt ? (
  <p className="text-sm text-muted-foreground italic">Deleted comment</p>
) : (
  <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
)}
```

- [ ] **Step 2: Keep replies visible under deleted parents**

Ensure `CommentThread` still renders replies even when the parent comment is soft deleted, so thread context stays intact.

- [ ] **Step 3: Enforce permissions on the server**

Double-check that every action revalidates only after the server confirms the actor is allowed to do the operation:

```ts
if (!canEditContent(session.user.role, session.user.id, post.authorId)) {
  return { error: "Not authorized" }
}
```

- [ ] **Step 4: Add guest-only reading behavior**

Guests should see the board content and a sign-in prompt, but no editors or mutation controls.

- [ ] **Step 5: Run a quick UI sanity pass**

Check that the board still fits on one screen at desktop width and that comment indentation remains readable on mobile.

---

### Task 5: Verify, document, and commit

**Files:**
- Modify: `README.md` if any usage notes change
- Modify: `.env.example` only if a new env var is truly required

- [ ] **Step 1: Push the schema to the database**

Run:

```bash
pnpm prisma db push
```

Expected:
`Your database is now in sync with your Prisma schema.`

- [ ] **Step 2: Run validation commands**

Run:

```bash
pnpm type-check
pnpm lint
pnpm build
```

Expected:
- `type-check` exits with code `0`
- `lint` exits with code `0`
- `build` exits with code `0`

- [ ] **Step 3: Smoke test the board**

Start the app:

```bash
pnpm dev
```

Verify:
1. Guests can read the board but cannot submit posts or comments.
2. A signed-in `member` can create a post, add a comment, and reply to a reply.
3. `moderator` and `admin` can edit and soft-delete any visible post or comment.
4. Soft-deleted rows still preserve thread nesting.

- [ ] **Step 4: Commit the feature**

```bash
git add -A
git commit -m "feat: add single-screen threaded board"
```
