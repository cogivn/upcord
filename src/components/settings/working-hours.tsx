"use client"

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
import { Badge } from "@/components/ui/badge"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils"

interface WorkingHoursProps {
  form: UseFormReturn<SettingsFormValues>
}

const DAYS = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
  { value: "0", label: "Sunday" },
]

export function WorkingHours({ form }: WorkingHoursProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Working Hours</h3>
        <p className="text-sm text-muted-foreground">
          Configure when your Discord status should be online
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="workingHoursEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Working Hours</FormLabel>
                <FormDescription>
                  Automatically manage Discord status based on schedule
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="workingHoursStart"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingHoursEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="workingDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Days</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS.map((day) => (
                  <Badge
                    key={day.value}
                    variant={field.value.includes(day.value) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer hover:bg-primary/90",
                      field.value.includes(day.value) ? "" : "hover:bg-secondary"
                    )}
                    onClick={() => {
                      const newValue = field.value.includes(day.value)
                        ? field.value.filter((d) => d !== day.value)
                        : [...field.value, day.value]
                      field.onChange(newValue)
                    }}
                  >
                    {day.label}
                  </Badge>
                ))}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
