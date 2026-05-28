"use client"

import { useActionState, useEffect, useRef } from "react"
import { LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ActionState = {
  error?: string
  ok?: true
}

type CommentAction = (formData: FormData) => Promise<ActionState>

type CommentFormProps = {
  action: CommentAction
  actionLabel: string
  commentId?: string
  defaultValue?: string
  onCancel?: () => void
  onSuccess?: () => void
  parentId?: string | null
  placeholder?: string
  postId?: string
}

const initialState: ActionState = {}

export function CommentForm({
  action,
  actionLabel,
  commentId,
  defaultValue,
  onCancel,
  onSuccess,
  parentId,
  placeholder,
  postId,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(
    async (_previous: ActionState, formData: FormData) => action(formData),
    initialState
  )

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset()
      onSuccess?.()
    }
  }, [state, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {commentId ? <input type="hidden" name="commentId" value={commentId} /> : null}
      {postId ? <input type="hidden" name="postId" value={postId} /> : null}
      {parentId !== undefined ? (
        <input type="hidden" name="parentId" value={parentId ?? ""} />
      ) : null}

      <Textarea
        name="content"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-24"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending} size="sm">
          {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
          {pending ? "Saving..." : actionLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
    </form>
  )
}
