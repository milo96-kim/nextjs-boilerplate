"use client"

import { Flame, ChevronRight } from "lucide-react"

const popularPosts = [
  { rank: 1, title: "무료 폰트 사이트 추천 (상업적 이용 가능)", comments: 28, isHot: true },
  { rank: 2, title: "프로크리에이트 유용한 단축키 모음", comments: 34, isHot: true },
  { rank: 3, title: "오늘 작업한 일러스트 공유합니다", comments: 23, isHot: true },
  { rank: 4, title: "주말에 찍은 풍경 사진들", comments: 19 },
  { rank: 5, title: "[필독] 커뮤니티 이용 규칙 안내", comments: 15 },
]

export function PopularPosts() {
  return (
    <div className="rounded border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <h3 className="font-semibold text-sm text-foreground">실시간 인기글</h3>
        </div>
        <a href="#" className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          더보기
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>
      <ul>
        {popularPosts.map((post, index) => (
          <li key={post.rank}>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-secondary/50 group"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold ${
                  post.rank <= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {post.rank}
              </span>
              <span className="flex-1 truncate text-sm text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </span>
              {post.isHot && (
                <span className="shrink-0 text-[10px] font-bold text-orange-500">HOT</span>
              )}
              {index < popularPosts.length - 1 || (
                <span className="text-xs text-muted-foreground shrink-0">
                  [{post.comments}]
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
