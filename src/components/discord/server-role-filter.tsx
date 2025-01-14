"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { DiscordGuild, DiscordRole } from "@/types/discord"

interface ServerRoleFilterProps {
  guild: DiscordGuild
  selectedRoles: string[]
  onRoleSelect: (roleId: string) => void
}

export function ServerRoleFilter({
  guild,
  selectedRoles,
  onRoleSelect,
}: ServerRoleFilterProps) {
  // Sort roles by position (higher position first)
  const sortedRoles = [...(guild.roles || [])].sort((a, b) => b.position - a.position)

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-2">
          {sortedRoles.map((role) => (
            <div
              key={role.id}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={role.id}
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => onRoleSelect(role.id)}
              />
              <label
                htmlFor={role.id}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  role.color && `text-[#${role.color.toString(16).padStart(6, '0')}]`
                )}
              >
                {role.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
