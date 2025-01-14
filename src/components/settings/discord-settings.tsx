"use client"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SettingsFormValues } from "./settings-form"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DiscordSettingsProps {
  form: UseFormReturn<SettingsFormValues>
}

export function DiscordSettings({ form }: DiscordSettingsProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyDiscordSettings = async () => {
    setIsVerifying(true)
    try {
      // TODO: Implement verification logic
      // 1. Test bot token by making a getMe request
      // 2. Try sending a test message to the channel
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Discord Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your Discord bot for notification forwarding
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="telegramBotToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Token</FormLabel>
              <FormDescription>
                The User token for your discord account
              </FormDescription>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your bot token"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />


        <Button
          type="button"
          variant="secondary"
          onClick={verifyDiscordSettings}
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify Settings"}
        </Button>
      </div>
    </div>
  )
}
