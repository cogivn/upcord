"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function BotConfigForm() {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    autoStart: true,
    customStatus: "",
    logMessages: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bot/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to update config');

      toast({
        title: "Success",
        description: "Bot configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bot configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="auto-start">Auto-start on login</Label>
        <Switch
          id="auto-start"
          checked={config.autoStart}
          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoStart: checked }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-status">Custom Status</Label>
        <Input
          id="custom-status"
          placeholder="Enter custom status message"
          value={config.customStatus}
          onChange={(e) => setConfig(prev => ({ ...prev, customStatus: e.target.value }))}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="log-messages">Log Messages</Label>
        <Switch
          id="log-messages"
          checked={config.logMessages}
          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, logMessages: checked }))}
        />
      </div>

      <Button type="submit" className="w-full">Save Configuration</Button>
    </form>
  );
}
