"use client"

import { Users, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentMembers = [
  { name: "새싹창작자", level: "새싹", joinedAt: "방금 전" },
  { name: "아트러버", level: "새싹", joinedAt: "1시간 전" },
  { name: "디자인초보", level: "새싹", joinedAt: "2시간 전" },
  { name: "그림그리는사람", level: "새싹", joinedAt: "3시간 전" },
]

export function RecentMembers() {
  return (
    <div className="rounded border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">새로운 멤버</h3>
        </div>
        <a href="#" className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          전체보기
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>
      <ul>
        {recentMembers.map((member) => (
          <li
            key={member.name}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/30 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {member.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.name}
                </p>
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {member.level}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{member.joinedAt} 가입</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
