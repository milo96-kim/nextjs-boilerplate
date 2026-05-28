"use client"

import { useActionState } from "react"
import Link from "next/link"
import type { Session } from "next-auth"

import { createPost, updatePost } from "@/app/actions/board"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BoardPost } from "@/lib/board"

type ActionState = {
  error?: string
  ok?: true
}

type PostEditorProps = {
  session: Session | null
  boardPost: BoardPost | null
  mode: "create" | "edit" | "read"
}

const initialState: ActionState = {}

export function PostEditor({ session, boardPost, mode }: PostEditorProps) {
  const isEdit = mode === "edit" && !!boardPost
  const action = isEdit ? updatePost : createPost
  const [state, formAction, pending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => action(formData),
    initialState
  )

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Write access</CardDescription>
          <CardTitle>Sign in to post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in to create a post, add comments, and manage content you own.
          </p>
          <Link
            href="/login"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (mode === "read") {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Current post</CardDescription>
          <CardTitle>{boardPost?.title ?? "No post yet"}</CardTitle>
          {boardPost ? (
            <p className="text-xs text-muted-foreground">
              {boardPost.deletedAt ? "Removed post" : `By ${boardPost.author.name ?? "Unknown"}`}
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {boardPost ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {boardPost.deletedAt ? "This post was removed." : boardPost.content}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              There is no post yet.
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>{isEdit ? "Edit current post" : "Create a post"}</CardDescription>
        <CardTitle>{isEdit ? boardPost?.title ?? "Post" : "Write something new"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" action={formAction}>
          {isEdit ? <input type="hidden" name="postId" value={boardPost.id} /> : null}
          <div className="space-y-2">
            <Input
              name="title"
              placeholder="Title"
              defaultValue={isEdit ? boardPost?.title : ""}
            />
            <Textarea
              name="content"
              placeholder="Write the post content..."
              defaultValue={isEdit ? boardPost?.content : ""}
            />
          </div>
          {state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save changes" : "Publish post"}
            </Button>
            {isEdit ? (
              <p className="text-xs text-muted-foreground">
                Only moderators or the author can edit this post.
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
