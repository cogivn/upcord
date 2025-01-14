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
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SettingsFormValues } from "./settings-form"
import { useDiscordUser } from "@/hooks/use-discord-user"
import { cn } from "@/lib/utils"

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>
}

export function NotificationSettings({ form }: NotificationSettingsProps) {
  const { guilds } = useDiscordUser()
  const [selectedServers, setSelectedServers] = React.useState<Map<string, string[]>>(new Map())
  const forwardMentionsEnabled = form.watch("forwardMentionsEnabled")
  const forwardDirectMessages = form.watch("forwardDirectMessages")

  const handleServerToggle = (serverId: string) => {
    setSelectedServers(prev => {
      const next = new Map(prev)
      if (next.has(serverId)) {
        next.delete(serverId)
      } else {
        next.set(serverId, [])
      }
      return next
    })
  }

  // Update form value when selections change
  React.useEffect(() => {
    const formattedMentions = Array.from(selectedServers.entries()).map(([serverId]) => {
      const guild = guilds?.find(g => g.id === serverId)
      return {
        serverId,
        serverName: guild?.name || "",
        roles: []
      }
    })
    form.setValue("forwardMentions", formattedMentions)
  }, [selectedServers, guilds, form])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications from Discord and manage message forwarding
        </p>
      </div>

      <div>
        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">Forward Mentions</div>
              <div className="text-sm text-muted-foreground">
                Forward messages when you are mentioned
              </div>
            </div>
            <FormField
              control={form.control}
              name="forwardMentionsEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className={cn(
            "px-4 pb-4 space-y-3 transition-opacity",
            !forwardMentionsEnabled && "opacity-50 pointer-events-none"
          )}>
            <FormField
              control={form.control}
              name="forwardMentions"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    {guilds?.map(guild => (
                      <div
                        key={guild.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          {guild.icon ? (
                            <img
                              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium text-muted-foreground">
                                {guild.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium">{guild.name}</span>
                        </div>
                        <Switch
                          checked={selectedServers.has(guild.id)}
                          onCheckedChange={() => handleServerToggle(guild.id)}
                          disabled={!forwardMentionsEnabled}
                        />
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">Direct Messages</div>
              <div className="text-sm text-muted-foreground">
                Forward messages from private conversations
              </div>
            </div>
            <FormField
              control={form.control}
              name="forwardDirectMessages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className={cn(
            "px-4 pb-4 transition-opacity",
            !forwardDirectMessages && "opacity-50 pointer-events-none"
          )}>
            <FormField
              control={form.control}
              name="dmCooldownMinutes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel className="text-sm">Cooldown Period</FormLabel>
                      <FormDescription className="text-xs">
                        Minutes to wait before forwarding new messages
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="w-20"
                        min={1}
                        max={60}
                        disabled={!forwardDirectMessages}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">Fallback Settings</div>
              <div className="text-sm text-muted-foreground">
                Configure backup notification methods
              </div>
            </div>
            <FormField
              control={form.control}
              name="fallbackToDiscord"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
