"use client"

import { cn } from "@/lib/utils"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

const tabs = [
  { label: "전체", count: 1234, active: true },
  { label: "공지", count: 12 },
  { label: "인기", count: 89 },
  { label: "자유", count: 567 },
  { label: "정보", count: 234 },
  { label: "질문", count: 156 },
]

export function BoardTabs() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={cn(
              "relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm transition-colors",
              tab.active
                ? "font-semibold text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "text-xs",
                tab.active ? "text-primary" : "text-muted-foreground/70"
              )}
            >
              {tab.count}
            </span>
            {tab.active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      <Button size="sm" className="shrink-0 gap-1.5">
        <PenSquare className="h-4 w-4" />
        글쓰기
      </Button>
    </div>
  )
}
