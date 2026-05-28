"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { canDeleteContent, canEditContent } from "@/lib/board"
import { db } from "@/lib/db"

type ActionResult = {
  ok?: true
  error?: string
}

function getTrimmedString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

async function getSession() {
  const session = await auth()
  return session?.user ? session : null
}

function unauthorized(): ActionResult {
  return { error: "Not authorized" }
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return unauthorized()
  }

  const title = getTrimmedString(formData, "title")
  const content = getTrimmedString(formData, "content")

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

export async function createComment(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return unauthorized()
  }

  const postId = getTrimmedString(formData, "postId")
  const parentId = getTrimmedString(formData, "parentId")
  const content = getTrimmedString(formData, "content")

  if (!postId || !content) {
    return { error: "Comment content is required" }
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    select: { id: true },
  })

  if (!post) {
    return { error: "Post not found" }
  }

  if (parentId) {
    const parent = await db.comment.findUnique({
      where: { id: parentId },
      select: {
        id: true,
        postId: true,
      },
    })

    if (!parent || parent.postId !== postId) {
      return { error: "Parent comment not found" }
    }
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

export async function updatePost(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return unauthorized()
  }

  const postId = getTrimmedString(formData, "postId")
  const title = getTrimmedString(formData, "title")
  const content = getTrimmedString(formData, "content")

  if (!postId || !title || !content) {
    return { error: "Title and content are required" }
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      authorId: true,
    },
  })

  if (!post || !canEditContent(session.user.role, session.user.id, post.authorId)) {
    return unauthorized()
  }

  await db.post.update({
    where: { id: postId },
    data: {
      title,
      content,
    },
  })

  revalidatePath("/")
  return { ok: true }
}

export async function updateComment(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return unauthorized()
  }

  const commentId = getTrimmedString(formData, "commentId")
  const content = getTrimmedString(formData, "content")

  if (!commentId || !content) {
    return { error: "Comment content is required" }
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: {
      authorId: true,
    },
  })

  if (!comment || !canEditContent(session.user.role, session.user.id, comment.authorId)) {
    return unauthorized()
  }

  await db.comment.update({
    where: { id: commentId },
    data: {
      content,
    },
  })

  revalidatePath("/")
  return { ok: true }
}

export async function deletePost(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return unauthorized()
  }

  const postId = getTrimmedString(formData, "postId")
  if (!postId) {
    return { error: "Post not found" }
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      authorId: true,
    },
  })

  if (!post || !canDeleteContent(session.user.role, session.user.id, post.authorId)) {
    return unauthorized()
  }

  await db.post.update({
    where: { id: postId },
    data: {
      deletedAt: new Date(),
    },
  })

  revalidatePath("/")
  return { ok: true }
}

export async function deleteComment(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return unauthorized()
  }

  const commentId = getTrimmedString(formData, "commentId")
  if (!commentId) {
    return { error: "Comment not found" }
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: {
      authorId: true,
    },
  })

  if (!comment || !canDeleteContent(session.user.role, session.user.id, comment.authorId)) {
    return unauthorized()
  }

  await db.comment.update({
    where: { id: commentId },
    data: {
      deletedAt: new Date(),
    },
  })

  revalidatePath("/")
  return { ok: true }
}
