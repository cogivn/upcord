"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ScrollArea } from "./scroll-area"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState<number>(0)

  React.useEffect(() => {
    if (inputRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.borderBoxSize) {
            const width = entry.borderBoxSize[0].inlineSize
            setWidth(width)
          }
        }
      })

      resizeObserver.observe(inputRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const formatTime = (num: number) => num.toString().padStart(2, "0")
  const [hour, minute] = value ? value.split(":").map(Number) : [0, 0]

  const handleTimeChange = (newHour: number, newMinute: number) => {
    onChange?.(`${formatTime(newHour)}:${formatTime(newMinute)}`)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div ref={inputRef} className="relative">
            <Input
              type="text"
              value={value || ""}
              onChange={(e) => {
                // Allow manual input if it matches time format
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
                if (timeRegex.test(e.target.value)) {
                  onChange?.(e.target.value)
                }
              }}
              placeholder="HH:mm"
              className="pr-8"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent"
              onClick={() => setIsOpen(true)}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="p-2" 
          style={{ width: width > 0 ? width : 'auto' }}
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">Hour</div>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-2">
                  {hours.map((h) => (
                    <div
                      key={h}
                      className={cn(
                        "cursor-pointer rounded-md px-3 py-1 text-center text-sm",
                        h === hour ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                      onClick={() => handleTimeChange(h, minute)}
                    >
                      {formatTime(h)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">Minute</div>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-2">
                  {minutes.map((m) => (
                    <div
                      key={m}
                      className={cn(
                        "cursor-pointer rounded-md px-3 py-1 text-center text-sm",
                        m === minute ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                      onClick={() => handleTimeChange(hour, m)}
                    >
                      {formatTime(m)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
