"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscordConnectionCard } from "./discord/status-card";
import { SettingsForm } from "./settings/settings-form";
import { BotControl } from "./discord/bot-control";

export function DashboardContent() {
  return (
    <div className="flex justify-center">
      <div className="container max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your Discord connection and settings</p>
        </div>

        <Tabs defaultValue="connection" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <div className="grid gap-4 md:grid-cols-2">
              <DiscordConnectionCard />
              <BotControl />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="pt-6">
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
