"use client"

import { Search, Bell, User, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BoardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-secondary/30">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-end gap-4 px-4 text-xs">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            내 카페
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            즐겨찾기
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            새글알림
          </a>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
              A
            </div>
            <span className="text-lg font-bold text-foreground">Atelier Community</span>
          </a>
        </div>

        {/* Search */}
        <div className="hidden flex-1 max-w-lg md:flex items-center gap-2">
          <div className="relative flex-1">
            <div className="flex rounded border border-border overflow-hidden bg-card">
              <button className="flex items-center gap-1 px-3 text-sm text-muted-foreground bg-secondary/50 border-r border-border hover:bg-secondary transition-colors">
                게시글
                <ChevronDown className="h-3 w-3" />
              </button>
              <Input
                placeholder="검색어를 입력하세요"
                className="h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button className="flex items-center justify-center w-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
