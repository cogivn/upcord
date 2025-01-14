"use client"

import * as React from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { UseFormReturn } from "react-hook-form"
import { SettingsFormValues } from "./settings-form"
import { ServerRoleFilter } from "@/components/discord/server-role-filter"
import { useDiscordUser } from "@/hooks/use-discord-user"

interface ForwardMentionsProps {
  form: UseFormReturn<SettingsFormValues>
}

export function ForwardMentions({ form }: ForwardMentionsProps) {
  const { guilds } = useDiscordUser()
  const [selectedServer, setSelectedServer] = React.useState<string>()
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([])

  const handleServerChange = (serverId: string) => {
    setSelectedServer(serverId)
    setSelectedRoles([]) // Reset selected roles when server changes
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  // Get mention strings
  const getMentions = () => {
    if (!selectedServer || !guilds) return ""
    
    const guild = guilds.find(g => g.id === selectedServer)
    if (!guild) return ""

    const roleMentions = selectedRoles
      .map(roleId => `<@&${roleId}>`)
      .join(" ")

    return roleMentions
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Forward Mentions</h3>
        <p className="text-sm text-muted-foreground">
          Configure which roles to mention when forwarding Discord messages
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="forwardMentionsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Forward Mentions</FormLabel>
                <FormDescription>
                  Automatically mention roles when forwarding Discord messages
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="forwardMentions"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4">
                <ServerRoleFilter
                  guilds={guilds || []}
                  selectedServer={selectedServer}
                  selectedRoles={selectedRoles}
                  onServerChange={handleServerChange}
                  onRoleSelect={handleRoleSelect}
                />
                {selectedRoles.length > 0 && (
                  <div className="p-4 rounded-md bg-muted">
                    <p className="text-sm font-medium mb-2">Generated Mentions:</p>
                    <code className="text-sm break-all">{getMentions()}</code>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
