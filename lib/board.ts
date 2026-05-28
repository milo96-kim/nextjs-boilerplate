import type { Role } from "@prisma/client"

import { db } from "@/lib/db"

export type BoardRole = Role

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

export type BoardListPost = {
  id: string
  title: string
  content: string
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  commentCount: number
  author: {
    id: string
    name: string | null
    image: string | null
    role: BoardRole
  }
}

type BoardCommentRow = {
  id: string
  parentId: string | null
  content: string
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: BoardComment["author"]
}

function buildCommentTree(comments: BoardCommentRow[]) {
  const nodes = new Map<string, BoardComment & { parentId: string | null }>()
  const roots: Array<BoardComment & { parentId: string | null }> = []

  for (const comment of comments) {
    nodes.set(comment.id, {
      id: comment.id,
      content: comment.content,
      deletedAt: comment.deletedAt,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      replies: [],
      parentId: comment.parentId,
    })
  }

  for (const comment of comments) {
    const node = nodes.get(comment.id)
    if (!node) {
      continue
    }

    if (comment.parentId) {
      const parent = nodes.get(comment.parentId)
      if (parent) {
        parent.replies.push(node)
        continue
      }
    }

    roots.push(node)
  }

  return roots
}

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

export async function getBoardPost(): Promise<BoardPost | null> {
  const post = await db.post.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
    },
  })

  if (!post) {
    return null
  }

  const comments = await db.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      parentId: true,
      content: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
    },
  })

  return {
    ...post,
    comments: buildCommentTree(comments),
  }
}

export async function getBoardPosts(): Promise<BoardListPost[]> {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      content: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    deletedAt: post.deletedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    commentCount: post._count.comments,
  }))
}

export type BoardFeed = {
  posts: BoardListPost[]
  latestPost: BoardPost | null
}

export async function getBoardFeed(): Promise<BoardFeed> {
  const [posts, latestPost] = await Promise.all([getBoardPosts(), getBoardPost()])

  return {
    posts,
    latestPost,
  }
}
