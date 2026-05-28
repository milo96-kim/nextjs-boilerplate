import Link from "next/link"
import type { Session } from "next-auth"
import { LogIn, LogOut, MessageSquareMore, PencilLine, Shield, UserRound } from "lucide-react"

import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type BoardFeed, type BoardPost, canEditContent } from "@/lib/board"

import { CommentThread } from "./comment-thread"
import { PostEditor } from "./post-editor"

type BoardProps = {
  session: Session | null
  boardFeed: BoardFeed | null
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

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

export function Board({ session, boardFeed, boardLoadError }: BoardProps) {
  const latestPost = boardFeed?.latestPost ?? null
  const boardPosts = boardFeed?.posts ?? []
  const canManagePost =
    !!session &&
    !!latestPost &&
    canEditContent(session.user.role, session.user.id, latestPost.author.id)
  const commentCount = latestPost ? countComments(latestPost.comments) : 0

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
              <span>{boardPosts.length} posts</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              <Shield className="size-3.5" />
              <span>{roleLabel(session?.user.role)}</span>
            </div>
            {session ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                  <UserRound className="size-3.5" />
                  <span>{session.user.name ?? session.user.email ?? "Signed in"}</span>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                >
                  <Button type="submit" variant="outline" size="sm" className="gap-2">
                    <LogOut className="size-3.5" />
                    Sign out
                  </Button>
                </form>
              </>
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <section className="space-y-6">
            <PostEditor session={session} boardPost={null} mode="create" />

            <Card>
              <CardHeader>
                <CardDescription>Board items</CardDescription>
                <CardTitle>Recent posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {boardPosts.length > 0 ? (
                  boardPosts.map((post, index) => (
                    <article
                      key={post.id}
                      className="rounded-xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-medium text-foreground">{post.title}</h2>
                            {index === 0 ? (
                              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-primary">
                                Latest
                              </span>
                            ) : null}
                            {post.deletedAt ? (
                              <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-destructive">
                                Removed
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {post.author.name ?? "Unknown"} · {formatDate(post.createdAt)}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {post.commentCount} comments
                        </span>
                      </div>
                      <p className="mt-3 max-h-20 overflow-hidden whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {post.deletedAt ? "This post has been removed." : post.content}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                    No posts yet. Create the first item above.
                  </div>
                )}
              </CardContent>
            </Card>

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
                <CardDescription>Selected post</CardDescription>
                <CardTitle>{latestPost ? latestPost.title : "No post selected"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestPost ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      By {latestPost.author.name ?? "Unknown"} · {formatDate(latestPost.createdAt)}
                    </p>
                    <div className="whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/30 p-4 text-sm leading-7 text-foreground">
                      {latestPost.deletedAt ? "This post has been removed." : latestPost.content}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <PencilLine className="size-3.5" />
                      <span>{commentCount} comments in thread</span>
                    </div>
                    {canManagePost ? (
                      <PostEditor session={session} boardPost={latestPost} mode="edit" />
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                    There is no post yet.
                  </div>
                )}
              </CardContent>
            </Card>

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
              postId={latestPost?.id ?? ""}
              comments={latestPost?.comments ?? []}
              boardLoadError={boardLoadError}
              session={session}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
