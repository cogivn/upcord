"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

export function BotStatusCard() {
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [lastStarted, setLastStarted] = useState<Date | null>(null);

  useEffect(() => {
    // TODO: Implement status check
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/bot/status');
        const data = await response.json();
        setStatus(data.status);
        if (data.lastStarted) {
          setLastStarted(new Date(data.lastStarted));
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
        <Bot className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <CardDescription>
            {lastStarted && (
              <span>Last started: {lastStarted.toLocaleString()}</span>
            )}
          </CardDescription>
          <Badge 
            variant={status === 'online' ? "default" : "destructive"}
            className="capitalize"
          >
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
