"use client"

import { Home, Search, PenSquare, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "홈", active: true },
  { icon: Search, label: "검색" },
  { icon: PenSquare, label: "글쓰기", highlight: true },
  { icon: Bell, label: "알림", badge: 3 },
  { icon: User, label: "MY" },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 relative",
              item.highlight && "relative"
            )}
          >
            {item.highlight ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md -mt-4">
                <item.icon className="h-5 w-5" />
              </div>
            ) : (
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    item.active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
            <span
              className={cn(
                "text-[10px]",
                item.active ? "text-primary font-medium" : "text-muted-foreground",
                item.highlight && "mt-1"
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
