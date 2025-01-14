"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Power, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function BotControl() {
  const [status, setStatus] = useState<'running' | 'stopped' | 'loading'>('loading')
  const [isLoading, setIsLoading] = useState(false)

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      })
      const data = await res.json()
      setStatus(data.status)
    } catch (error) {
      console.error('Failed to check bot status:', error)
      toast.error('Failed to check bot status')
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleToggle = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const action = status === 'running' ? 'stop' : 'start'
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      setStatus(action === 'start' ? 'running' : 'stopped')
      toast.success(`Bot ${action === 'start' ? 'started' : 'stopped'} successfully`)
    } catch (error) {
      console.error('Failed to toggle bot:', error)
      toast.error('Failed to toggle bot status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Discord Bot</h3>
            <p className="text-sm text-muted-foreground">
              Control your Discord bot instance
            </p>
          </div>
          <Button
            variant={status === 'running' ? "destructive" : "default"}
            size="lg"
            className="w-[120px]"
            onClick={handleToggle}
            disabled={isLoading || status === 'loading'}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                {status === 'running' ? 'Stop' : 'Start'}
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${
            status === 'running' ? 'bg-green-500' : 
            status === 'stopped' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`} />
          <span className="text-sm font-medium capitalize">
            {status === 'loading' ? 'Checking status...' : status}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
