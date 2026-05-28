"use client"

import { cn } from "@/lib/utils"
import { MessageSquare, Eye, ThumbsUp, Pin, Image as ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Post {
  id: number
  category: string
  title: string
  snippet?: string
  author: string
  authorImage?: string
  date: string
  time?: string
  views: number
  likes: number
  comments: number
  isPinned?: boolean
  hasImage?: boolean
  isNew?: boolean
}

const posts: Post[] = [
  {
    id: 1,
    category: "공지",
    title: "[필독] 커뮤니티 이용 규칙 안내",
    author: "운영자",
    date: "01.15",
    views: 1523,
    likes: 42,
    comments: 15,
    isPinned: true,
  },
  {
    id: 2,
    category: "공지",
    title: "1월 이벤트 당첨자 발표",
    author: "운영자",
    date: "01.14",
    views: 892,
    likes: 28,
    comments: 67,
    isPinned: true,
  },
  {
    id: 3,
    category: "자유",
    title: "오늘 작업한 일러스트 공유합니다",
    snippet: "요즘 연습하고 있는 캐릭터 일러스트에요. 피드백 부탁드려요!",
    author: "그림쟁이",
    date: "01.15",
    time: "14:32",
    views: 234,
    likes: 56,
    comments: 23,
    hasImage: true,
    isNew: true,
  },
  {
    id: 4,
    category: "정보",
    title: "프로크리에이트 유용한 단축키 모음",
    author: "디지털아티스트",
    date: "01.15",
    time: "13:45",
    views: 567,
    likes: 89,
    comments: 34,
    isNew: true,
  },
  {
    id: 5,
    category: "자유",
    title: "신규 가입했습니다! 잘 부탁드려요 🙌",
    author: "새싹창작자",
    date: "01.15",
    time: "12:20",
    views: 45,
    likes: 12,
    comments: 8,
    isNew: true,
  },
  {
    id: 6,
    category: "질문",
    title: "타블렛 추천 부탁드립니다",
    author: "초보그림러",
    date: "01.14",
    views: 189,
    likes: 5,
    comments: 42,
  },
  {
    id: 7,
    category: "사진",
    title: "주말에 찍은 풍경 사진들",
    author: "포토그래퍼",
    date: "01.14",
    views: 312,
    likes: 78,
    comments: 19,
    hasImage: true,
  },
  {
    id: 8,
    category: "정보",
    title: "무료 폰트 사이트 추천 (상업적 이용 가능)",
    author: "디자이너킴",
    date: "01.14",
    views: 723,
    likes: 156,
    comments: 28,
  },
]

const categoryColors: Record<string, string> = {
  공지: "text-primary font-semibold",
  자유: "text-muted-foreground",
  정보: "text-blue-600",
  질문: "text-amber-600",
  사진: "text-purple-600",
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"
  }
  return num.toString()
}

export function PostList() {
  return (
    <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="hidden sm:grid sm:grid-cols-[80px_1fr_100px_60px_60px_60px] border-b border-border bg-secondary/50 text-xs text-muted-foreground">
        <div className="px-3 py-2.5 text-center">말머리</div>
        <div className="px-3 py-2.5">제목</div>
        <div className="px-3 py-2.5 text-center">작성자</div>
        <div className="px-3 py-2.5 text-center">작성일</div>
        <div className="px-3 py-2.5 text-center">조회</div>
        <div className="px-3 py-2.5 text-center">좋아요</div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <article
            key={post.id}
            className={cn(
              "group transition-colors hover:bg-secondary/30",
              post.isPinned && "bg-accent/20"
            )}
          >
            {/* Desktop View */}
            <div className="hidden sm:grid sm:grid-cols-[80px_1fr_100px_60px_60px_60px] items-center">
              {/* Category */}
              <div className="px-3 py-3 text-center">
                {post.isPinned ? (
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                    <Pin className="h-3 w-3" />
                    공지
                  </span>
                ) : (
                  <span className={cn("text-xs", categoryColors[post.category])}>
                    {post.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="px-3 py-3 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm text-foreground group-hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  {post.hasImage && (
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  {post.comments > 0 && (
                    <span className="text-xs text-primary font-medium shrink-0">
                      [{post.comments}]
                    </span>
                  )}
                  {post.isNew && (
                    <span className="shrink-0 rounded bg-primary px-1 py-0.5 text-[10px] font-bold text-primary-foreground">
                      N
                    </span>
                  )}
                </div>
              </div>

              {/* Author */}
              <div className="px-3 py-3 text-center">
                <span className="text-xs text-muted-foreground truncate block">
                  {post.author}
                </span>
              </div>

              {/* Date */}
              <div className="px-3 py-3 text-center">
                <span className="text-xs text-muted-foreground">
                  {post.time || post.date}
                </span>
              </div>

              {/* Views */}
              <div className="px-3 py-3 text-center">
                <span className="text-xs text-muted-foreground">
                  {formatNumber(post.views)}
                </span>
              </div>

              {/* Likes */}
              <div className="px-3 py-3 text-center">
                <span className="text-xs text-muted-foreground">
                  {formatNumber(post.likes)}
                </span>
              </div>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    {post.isPinned && (
                      <Pin className="h-3 w-3 text-primary shrink-0" />
                    )}
                    <span className={cn("text-xs shrink-0", categoryColors[post.category])}>
                      [{post.category}]
                    </span>
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {post.title}
                    </h3>
                    {post.isNew && (
                      <span className="shrink-0 rounded bg-primary px-1 py-0.5 text-[10px] font-bold text-primary-foreground">
                        N
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.time || post.date}</span>
                    <span>·</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Eye className="h-3 w-3" />
                        {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <ThumbsUp className="h-3 w-3" />
                        {formatNumber(post.likes)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
                {post.hasImage && (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-secondary">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
