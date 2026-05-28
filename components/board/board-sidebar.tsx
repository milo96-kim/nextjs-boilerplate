"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Megaphone,
  Flame,
  MessageSquare,
  Image,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Crown,
  ChevronDown,
} from "lucide-react"

const mainMenuItems = [
  { icon: Home, label: "전체글보기", href: "#", active: true },
  { icon: Megaphone, label: "공지사항", href: "#", badge: 3 },
  { icon: Flame, label: "인기글", href: "#", highlight: true },
]

const boardMenuItems = [
  { icon: MessageSquare, label: "자유게시판", href: "#", count: 567 },
  { icon: Image, label: "사진게시판", href: "#", count: 234 },
  { icon: FileText, label: "정보공유", href: "#", count: 156 },
  { icon: HelpCircle, label: "질문답변", href: "#", count: 89 },
  { icon: Users, label: "가입인사", href: "#", count: 45 },
]

const memberMenuItems = [
  { icon: Crown, label: "등업신청", href: "#" },
  { icon: Users, label: "멤버등급", href: "#" },
]

export function BoardSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-[88px] overflow-y-auto max-h-[calc(100vh-88px)]">
        {/* Community Info */}
        <div className="border-b border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-lg">
              A
            </div>
            <div>
              <h2 className="font-bold text-foreground">Atelier Community</h2>
              <p className="text-xs text-muted-foreground">멤버 1,234명</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            창작자들을 위한 커뮤니티입니다. 작품을 공유하고 소통해요!
          </p>
          <button className="w-full rounded bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            카페 가입하기
          </button>
        </div>

        {/* Main Navigation */}
        <div className="border-b border-border p-2">
          <nav className="space-y-0.5">
            {mainMenuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                  item.active
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className={cn("h-4 w-4", item.highlight && "text-orange-500")} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    N
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Board List */}
        <div className="border-b border-border p-2">
          <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-foreground">
            <span>게시판</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <nav className="space-y-0.5">
            {boardMenuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 rounded px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="flex-1">{item.label}</span>
                <span className="text-xs text-muted-foreground/70">{item.count}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Member Menu */}
        <div className="p-2">
          <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-foreground">
            <span>멤버</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <nav className="space-y-0.5">
            {memberMenuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 rounded px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="flex-1">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div className="border-t border-border p-2">
          <a
            href="#"
            className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>카페 설정</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
