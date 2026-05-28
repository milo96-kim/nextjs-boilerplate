"use client"

import { useState } from "react"
import type { Session } from "next-auth"
import { Clock3, PencilLine, Reply, Trash2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createComment, deleteComment, updateComment } from "@/app/actions/board"
import type { BoardComment } from "@/lib/board"

import { CommentForm } from "./comment-form"

type CommentItemProps = {
  comment: BoardComment
  postId: string
  session: Session | null
  depth?: number
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

function canManageComment(session: Session | null, ownerId: string) {
  return !!session && (session.user.role === "admin" || session.user.role === "moderator" || session.user.id === ownerId)
}

export function CommentItem({ comment, postId, session, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const canManage = canManageComment(session, comment.author.id)
  const canReply = !!session
  const handleDelete = async (formData: FormData) => {
    await deleteComment(formData)
  }

  return (
    <article className={depth > 0 ? "ml-4 border-l border-border/60 pl-4" : ""}>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{comment.author.name ?? "Unknown"}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <UserRound className="size-3" />
                {comment.author.role}
              </span>
              {comment.deletedAt ? (
                <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-destructive">
                  Removed
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3" />
                {formatDate(comment.createdAt)}
              </span>
              {comment.updatedAt > comment.createdAt ? <span>Updated</span> : null}
            </div>
          </div>

          {canManage ? (
            <div className="flex items-center gap-1">
              {!comment.deletedAt ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit comment"
                    onClick={() => {
                      setIsReplying(false)
                      setIsEditing((value) => !value)
                    }}
                  >
                    <PencilLine className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Reply to comment"
                    onClick={() => {
                      setIsEditing(false)
                      setIsReplying((value) => !value)
                    }}
                  >
                    <Reply className="size-3.5" />
                  </Button>
                </>
              ) : null}

              <form
                action={handleDelete}
                onSubmit={(event) => {
                  if (!window.confirm("Delete this comment?")) {
                    event.preventDefault()
                  }
                }}
              >
                <input type="hidden" name="commentId" value={comment.id} />
                <Button type="submit" variant="ghost" size="icon-sm" aria-label="Delete comment">
                  <Trash2 className="size-3.5" />
                </Button>
              </form>
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {isEditing && !comment.deletedAt ? (
            <CommentForm
              action={updateComment}
              actionLabel="Save comment"
              commentId={comment.id}
              defaultValue={comment.content}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
              {comment.deletedAt ? "This comment was removed." : comment.content}
            </p>
          )}

          {canReply && isReplying && !comment.deletedAt ? (
            <CommentForm
              action={createComment}
              actionLabel="Post reply"
              postId={postId}
              parentId={comment.id}
              placeholder="Write a reply..."
              onCancel={() => setIsReplying(false)}
              onSuccess={() => setIsReplying(false)}
            />
          ) : null}
        </div>
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              session={session}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}
