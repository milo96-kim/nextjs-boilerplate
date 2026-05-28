import type { Session } from "next-auth"
import { type BoardFeed } from "@/lib/board"

import { BoardHeader } from "@/components/board/board-header"
import { BoardSidebar } from "@/components/board/board-sidebar"
import { BoardTabs } from "@/components/board/board-tabs"
import { PostList } from "@/components/board/post-list"
import { PopularPosts } from "@/components/board/popular-posts"
import { RecentMembers } from "@/components/board/recent-members"
import { MobileNav } from "@/components/board/mobile-nav"

type BoardProps = {
  session: Session | null
  boardFeed: BoardFeed | null
  boardLoadError?: string | null
}

export function Board({ session, boardFeed, boardLoadError }: BoardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BoardHeader />

      <div className="flex">
        {/* Left Sidebar */}
        <BoardSidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-5xl">
            <div className="flex gap-4 p-4 lg:p-6">
              {/* Post List Area */}
              <div className="flex-1 min-w-0">
                <div className="rounded border border-border bg-card overflow-hidden">
                  {/* Tabs */}
                  <BoardTabs />
                  
                  {/* Post List */}
                  <PostList />
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-1 border-t border-border bg-card px-4 py-3">
                    <button className="flex h-8 w-8 items-center justify-center rounded text-sm text-muted-foreground hover:bg-secondary">
                      &lt;
                    </button>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        className={`flex h-8 w-8 items-center justify-center rounded text-sm ${
                          page === 1
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <span className="px-1 text-muted-foreground">...</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded text-sm text-muted-foreground hover:bg-secondary">
                      124
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded text-sm text-muted-foreground hover:bg-secondary">
                      &gt;
                    </button>
                  </div>
                </div>

                {/* Error State */}
                {boardLoadError && (
                  <div className="mt-4 rounded border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {boardLoadError}
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <aside className="hidden w-64 shrink-0 space-y-4 xl:block">
                <PopularPosts />
                <RecentMembers />
                
                {/* Community Stats */}
                <div className="rounded border border-border bg-card p-4">
                  <h3 className="mb-3 font-semibold text-foreground">커뮤니티 현황</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">총 게시글</span>
                      <span className="font-medium text-foreground">12,345</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">오늘 게시글</span>
                      <span className="font-medium text-primary">+28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">총 회원</span>
                      <span className="font-medium text-foreground">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">방문자(오늘)</span>
                      <span className="font-medium text-foreground">567</span>
                    </div>
                  </div>
                </div>

                {/* Login Status */}
                {session ? (
                  <div className="rounded border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {session.user.name?.[0] || session.user.email?.[0] || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {session.user.name || session.user.email || "회원"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.role === "admin" ? "관리자" : 
                           session.user.role === "moderator" ? "운영자" : "회원"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded border border-border bg-card p-4 text-center">
                    <p className="mb-3 text-sm text-muted-foreground">
                      로그인하고 커뮤니티에 참여하세요
                    </p>
                    <a
                      href="/login"
                      className="inline-flex h-9 items-center justify-center rounded bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      로그인
                    </a>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Spacer for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
