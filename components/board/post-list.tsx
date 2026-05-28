"use client"

import { cn } from "@/lib/utils"
import { MessageSquare, Eye, ThumbsUp, Pin, Image } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Post {
  id: number
  category: string
  title: string
  snippet?: string
  author: string
  authorImage?: string
  date: string
  views: number
  likes: number
  comments: number
  isPinned?: boolean
  hasImage?: boolean
}

const posts: Post[] = [
  {
    id: 1,
    category: "공지",
    title: "[필독] 커뮤니티 이용 규칙 안내",
    snippet: "안녕하세요, Atelier Community 운영진입니다. 커뮤니티를 이용하시기 전에 반드시 읽어주세요.",
    author: "운영자",
    date: "2024.01.15",
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
    date: "2024.01.14",
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
    date: "2024.01.15",
    views: 234,
    likes: 56,
    comments: 23,
    hasImage: true,
  },
  {
    id: 4,
    category: "정보",
    title: "프로크리에이트 유용한 단축키 모음",
    snippet: "제가 자주 쓰는 단축키들 정리해봤어요. 처음 시작하시는 분들께 도움이 됐으면 좋겠습니다.",
    author: "디지털아티스트",
    date: "2024.01.15",
    views: 567,
    likes: 89,
    comments: 34,
  },
  {
    id: 5,
    category: "자유",
    title: "신규 가입했습니다! 잘 부탁드려요",
    author: "새싹창작자",
    date: "2024.01.15",
    views: 45,
    likes: 12,
    comments: 8,
  },
  {
    id: 6,
    category: "질문",
    title: "타블렛 추천 부탁드립니다",
    snippet: "예산 50만원 정도로 입문용 타블렛 찾고 있어요. 추천 부탁드립니다!",
    author: "초보그림러",
    date: "2024.01.14",
    views: 189,
    likes: 5,
    comments: 42,
  },
  {
    id: 7,
    category: "사진",
    title: "주말에 찍은 풍경 사진들",
    author: "포토그래퍼",
    date: "2024.01.14",
    views: 312,
    likes: 78,
    comments: 19,
    hasImage: true,
  },
  {
    id: 8,
    category: "정보",
    title: "무료 폰트 사이트 추천 (상업적 이용 가능)",
    snippet: "상업적으로 무료로 사용 가능한 한글 폰트 사이트들 모아봤습니다.",
    author: "디자이너킴",
    date: "2024.01.14",
    views: 723,
    likes: 156,
    comments: 28,
  },
]

const categoryColors: Record<string, string> = {
  공지: "bg-primary text-primary-foreground",
  자유: "bg-secondary text-secondary-foreground",
  정보: "bg-blue-100 text-blue-700",
  질문: "bg-amber-100 text-amber-700",
  사진: "bg-purple-100 text-purple-700",
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"
  }
  return num.toString()
}

export function PostList() {
  return (
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <article
          key={post.id}
          className={cn(
            "group flex gap-4 p-4 transition-colors hover:bg-secondary/50",
            post.isPinned && "bg-accent/30"
          )}
        >
          <div className="flex-1 min-w-0">
            {/* Category & Title */}
            <div className="mb-1 flex items-center gap-2">
              {post.isPinned && (
                <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
              <Badge
                variant="secondary"
                className={cn("shrink-0 text-xs", categoryColors[post.category])}
              >
                {post.category}
              </Badge>
              <h3 className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              {post.hasImage && (
                <Image className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>

            {/* Snippet */}
            {post.snippet && (
              <p className="mb-2 line-clamp-1 text-sm text-muted-foreground leading-relaxed">
                {post.snippet}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={post.authorImage} />
                  <AvatarFallback className="text-[10px] bg-secondary">
                    {post.author[0]}
                  </AvatarFallback>
                </Avatar>
                <span>{post.author}</span>
              </div>
              <span className="text-border">·</span>
              <span>{post.date}</span>
              <span className="text-border">·</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(post.views)}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {formatNumber(post.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {post.comments}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
