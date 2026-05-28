"use client"

import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentMembers = [
  { name: "새싹창작자", joinedAt: "방금 전" },
  { name: "아트러버", joinedAt: "1시간 전" },
  { name: "디자인초보", joinedAt: "2시간 전" },
  { name: "그림그리는사람", joinedAt: "3시간 전" },
]

export function RecentMembers() {
  return (
    <div className="rounded border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">새 멤버</h3>
      </div>
      <ul className="divide-y divide-border">
        {recentMembers.map((member) => (
          <li
            key={member.name}
            className="flex items-center gap-3 px-4 py-2.5"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-secondary text-xs">
                {member.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.joinedAt}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
