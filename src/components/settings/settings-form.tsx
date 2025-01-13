"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { NotificationSettings } from "./notification-settings"
import { WorkingHours } from "./working-hours"
import { TelegramSettings } from "./telegram-settings"

export const settingsFormSchema = z.object({
  // Notification Settings
  forwardMentions: z.boolean().default(true),
  forwardDirectMessages: z.boolean().default(true),
  dmCooldownMinutes: z.number().min(1).max(60).default(5),
  fallbackToDiscord: z.boolean().default(true),
  
  // Working Hours
  workingHoursEnabled: z.boolean().default(true),
  workingHoursStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
  workingHoursEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default("17:00"),
  workingDays: z.array(z.string()).default(["1", "2", "3", "4", "5"]),
  
  // Telegram Settings
  telegramBotToken: z.string().min(1, "Bot token is required"),
  telegramChannelId: z.string().min(1, "Channel ID is required"),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      forwardMentions: true,
      forwardDirectMessages: true,
      dmCooldownMinutes: 5,
      fallbackToDiscord: true,
      workingHoursEnabled: true,
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      workingDays: ["1", "2", "3", "4", "5"],
      telegramBotToken: "",
      telegramChannelId: "",
    }
  })

  async function onSubmit(data: SettingsFormValues) {
    try {
      // TODO: Implement settings save
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <NotificationSettings form={form} />
        <Separator />
        <WorkingHours form={form} />
        <Separator />
        <TelegramSettings form={form} />
        <Button type="submit" className="w-full">Save Settings</Button>
      </form>
    </Form>
  )
}
