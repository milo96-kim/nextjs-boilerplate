"use client"

import { cn } from "@/lib/utils"
import { PenSquare, ListFilter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const tabs = [
  { label: "전체", count: 1234, active: true },
  { label: "공지", count: 12 },
  { label: "인기", count: 89 },
  { label: "자유", count: 567 },
  { label: "정보", count: 234 },
  { label: "질문", count: 156 },
  { label: "사진", count: 78 },
]

export function BoardTabs() {
  return (
    <div className="border-b border-border bg-card">
      {/* Tabs */}
      <div className="flex items-center justify-between px-4">
        <div className="flex gap-0.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm transition-colors",
                tab.active
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-t border-border/50 bg-secondary/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowUpDown className="h-3.5 w-3.5" />
            최신순
          </button>
          <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-secondary transition-colors">
            <ListFilter className="h-3.5 w-3.5" />
            필터
          </button>
        </div>
        <Button size="sm" className="gap-1.5 h-8">
          <PenSquare className="h-3.5 w-3.5" />
          글쓰기
        </Button>
      </div>
    </div>
  )
}
