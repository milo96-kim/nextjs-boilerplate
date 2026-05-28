import Link from "next/link"
import type { Session } from "next-auth"
import { LogIn, MessageSquareMore, Shield, UserRound } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { canEditContent, type BoardPost } from "@/lib/board"

import { CommentThread } from "./comment-thread"
import { PostEditor } from "./post-editor"

type BoardProps = {
  session: Session | null
  boardPost: BoardPost | null
  boardLoadError?: string | null
}

function roleLabel(role: string | undefined) {
  switch (role) {
    case "admin":
      return "Admin"
    case "moderator":
      return "Moderator"
    case "member":
      return "Member"
    default:
      return "Guest"
  }
}

function countComments(comments: BoardPost["comments"]) {
  let total = 0

  for (const comment of comments) {
    total += 1
    total += countComments(comment.replies)
  }

  return total
}

export function Board({ session, boardPost, boardLoadError }: BoardProps) {
  const canManagePost =
    !!session &&
    !!boardPost &&
    canEditContent(session.user.role, session.user.id, boardPost.author.id)

  const mode = boardPost ? (canManagePost ? "edit" : "read") : session ? "create" : "read"
  const commentCount = boardPost ? countComments(boardPost.comments) : 0

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Board
            </p>
            <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
              Single board screen
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Reading is open to everyone. Writing and moderation follow the current account role.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              <MessageSquareMore className="size-3.5" />
              <span>{commentCount} comments</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              <Shield className="size-3.5" />
              <span>{roleLabel(session?.user.role)}</span>
            </div>
            {session ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                <UserRound className="size-3.5" />
                <span>{session.user.name ?? session.user.email ?? "Signed in"}</span>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                <LogIn className="size-3.5" />
                Sign in
              </Link>
            )}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <section className="space-y-6">
            <PostEditor session={session} boardPost={boardPost} mode={mode} />

            {boardLoadError ? (
              <Card>
                <CardHeader>
                  <CardDescription>Board status</CardDescription>
                  <CardTitle>Data temporarily unavailable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>{boardLoadError}</p>
                  <p>The page still renders so you can keep navigating and sign in.</p>
                </CardContent>
              </Card>
            ) : null}
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardDescription>Permission model</CardDescription>
                <CardTitle>Role-based access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>Guest accounts can only read.</p>
                <p>Members can create posts, comments, and replies.</p>
                <p>Moderators and admins can edit or remove content they own or manage.</p>
              </CardContent>
            </Card>

            <CommentThread
              postId={boardPost?.id ?? ""}
              comments={boardPost?.comments ?? []}
              boardLoadError={boardLoadError}
              session={session}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
