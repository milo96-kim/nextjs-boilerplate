"use client"

import { Flame } from "lucide-react"

const popularPosts = [
  { rank: 1, title: "무료 폰트 사이트 추천 (상업적 이용 가능)", comments: 28 },
  { rank: 2, title: "프로크리에이트 유용한 단축키 모음", comments: 34 },
  { rank: 3, title: "오늘 작업한 일러스트 공유합니다", comments: 23 },
  { rank: 4, title: "주말에 찍은 풍경 사진들", comments: 19 },
  { rank: 5, title: "[필독] 커뮤니티 이용 규칙 안내", comments: 15 },
]

export function PopularPosts() {
  return (
    <div className="rounded border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Flame className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">인기글</h3>
      </div>
      <ul className="divide-y divide-border">
        {popularPosts.map((post) => (
          <li key={post.rank}>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-secondary/50"
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
              <span className="flex-1 truncate text-sm text-foreground">
                {post.title}
              </span>
              <span className="text-xs text-muted-foreground">
                [{post.comments}]
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
