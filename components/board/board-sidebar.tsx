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
} from "lucide-react"

const menuItems = [
  { icon: Home, label: "홈", href: "#", active: true },
  { icon: Megaphone, label: "공지사항", href: "#", badge: 3 },
  { icon: Flame, label: "인기글", href: "#" },
  { icon: MessageSquare, label: "자유게시판", href: "#" },
  { icon: Image, label: "사진게시판", href: "#" },
  { icon: FileText, label: "정보게시판", href: "#" },
  { icon: Users, label: "가입인사", href: "#" },
]

export function BoardSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-14 p-4">
        {/* Community Info */}
        <div className="mb-6 rounded border border-border bg-secondary/50 p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
              A
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Atelier Community</h2>
              <p className="text-xs text-muted-foreground">멤버 1,234명</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            창작자들을 위한 커뮤니티
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Settings */}
        <div className="mt-6 border-t border-border pt-4">
          <a
            href="#"
            className="flex items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
