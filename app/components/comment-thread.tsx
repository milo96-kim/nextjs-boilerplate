import Link from "next/link"
import type { Session } from "next-auth"
import { MessageSquarePlus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createComment } from "@/app/actions/board"
import type { BoardComment } from "@/lib/board"

import { CommentForm } from "./comment-form"
import { CommentItem } from "./comment-item"

type CommentThreadProps = {
  postId: string
  comments: BoardComment[]
  boardLoadError?: string | null
  session: Session | null
}

export function CommentThread({ postId, comments, boardLoadError, session }: CommentThreadProps) {
  if (boardLoadError) {
    return (
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardDescription>Discussion</CardDescription>
            <CardTitle>Comments unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
              {boardLoadError}
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!postId) {
    return (
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardDescription>Discussion</CardDescription>
            <CardTitle>Comments and replies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
              Create a post first to start a thread.
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardDescription>Discussion</CardDescription>
          <CardTitle>Comments and replies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session ? (
            <CommentForm
              action={createComment}
              actionLabel="Post comment"
              postId={postId}
              parentId={null}
              placeholder="Share a reply or start the discussion..."
            />
          ) : (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
              <p>Sign in to leave comments and replies.</p>
              <Link href="/login" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                Sign in to join
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} session={session} />
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
              <MessageSquarePlus className="size-4" />
              No comments yet. Start the conversation.
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
