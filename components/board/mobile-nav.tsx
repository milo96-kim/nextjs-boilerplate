"use client"

import { Home, Search, PenSquare, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "홈", active: true },
  { icon: Search, label: "검색" },
  { icon: PenSquare, label: "글쓰기", highlight: true },
  { icon: Bell, label: "알림" },
  { icon: User, label: "마이" },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2",
              item.highlight && "relative"
            )}
          >
            {item.highlight ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </div>
            ) : (
              <item.icon
                className={cn(
                  "h-5 w-5",
                  item.active ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
            <span
              className={cn(
                "text-[10px]",
                item.active ? "text-primary font-medium" : "text-muted-foreground",
                item.highlight && "sr-only"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
