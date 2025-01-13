"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscordConnectionCard } from "./discord/status-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsForm } from "./settings/settings-form";
import { UserInfoCard } from "./user/user-info-card";

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
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>
                    Latest connection events and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] flex items-center justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none text-muted-foreground">
                            No recent events
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure your notification preferences and working hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
