import { BoardHeader } from "@/components/board/board-header"
import { BoardSidebar } from "@/components/board/board-sidebar"
import { BoardTabs } from "@/components/board/board-tabs"
import { PostList } from "@/components/board/post-list"
import { PopularPosts } from "@/components/board/popular-posts"
import { RecentMembers } from "@/components/board/recent-members"
import { MobileNav } from "@/components/board/mobile-nav"

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <BoardHeader />
      
      <div className="mx-auto flex max-w-6xl">
        {/* Desktop Sidebar */}
        <BoardSidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <BoardTabs />
          <div className="bg-card border-x border-border min-h-[calc(100vh-112px)] lg:border-l-0">
            <PostList />
          </div>
        </main>
        
        {/* Desktop Right Sidebar */}
        <aside className="hidden w-72 shrink-0 p-4 xl:block">
          <div className="sticky top-[72px] space-y-4">
            <PopularPosts />
            <RecentMembers />
          </div>
        </aside>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
