"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DiscordLogo } from "./discord-logo"
import { Power, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface BotStatus {
  isRunning: boolean;
  userId: string | null;
  username: string | null;
  lastStartTime: string | null;
  lastStopTime: string | null;
}

export function DiscordConnectionCard() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkBotStatus = async () => {
    try {
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      })
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setBotStatus(data)
    } catch (error) {
      console.error('Failed to check bot status:', error)
      toast.error('Failed to check bot status')
    }
  }

  useEffect(() => {
    checkBotStatus()
    const interval = setInterval(checkBotStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleBotToggle = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const action = botStatus?.isRunning ? 'stop' : 'start'
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      setBotStatus(data)
      toast.success(`Bot ${action === 'start' ? 'started' : 'stopped'} successfully`)
    } catch (error) {
      console.error('Failed to toggle bot:', error)
      toast.error('Failed to toggle bot status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-[#5865F2] to-[#4752C4] p-6">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <DiscordLogo className="h-10 w-10 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Discord Bot</h2>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handleBotToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Power className={`h-5 w-5 ${botStatus?.isRunning ? 'text-green-400' : 'text-white/80'}`} />
              )}
            </Button>
          </motion.div>
        </div>
        <div className="p-6">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${botStatus?.isRunning ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <p className="text-sm font-medium">
                  {botStatus?.isRunning ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              {botStatus?.lastStartTime && botStatus.isRunning && (
                <p className="text-xs text-muted-foreground">
                  Connected since {new Date(botStatus.lastStartTime).toLocaleString()}
                </p>
              )}
              {botStatus?.lastStopTime && !botStatus.isRunning && (
                <p className="text-xs text-muted-foreground">
                  Last disconnected at {new Date(botStatus.lastStopTime).toLocaleString()}
                </p>
              )}
            </div>

            {botStatus?.userId && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bot ID</span>
                  <span className="font-medium">{botStatus.userId}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
