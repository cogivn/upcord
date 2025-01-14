"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useDiscordUser } from '@/hooks/use-discord-user'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Server } from 'lucide-react'

interface DiscordStatus {
  isConnected: boolean
  user: {
    id: string
    username: string
    discriminator: string
    global_name: string | null
    avatar: string | null
    created_at: string
  } | null
  guilds: Array<{
    id: string
    name: string
    icon: string | null
  }>
  lastConnected: string | null
  error: string | null
}

export function DiscordStatusDisplay() {
  const { data: session } = useSession()
  const { user, guilds, isLoading, error } = useDiscordUser()
  const [status, setStatus] = useState<DiscordStatus | null>(null)

  useEffect(() => {
    if (user) {
      const status: DiscordStatus = {
        isConnected: true,
        user: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator,
          global_name: user.global_name,
          avatar: user.avatar,
          created_at: user.created_at,
        },
        guilds,
        lastConnected: null,
        error: null,
      }
      setStatus(status)
    }
  }, [user, guilds])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!status?.user) {
    return <NoConnectionDisplay />
  }

  const discordAvatarUrl = status.user.avatar
    ? `https://cdn.discordapp.com/avatars/${status.user.id}/${status.user.avatar}.${
        status.user.avatar.startsWith("a_") ? "gif" : "png"
      }`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(status.user.discriminator) % 5}.png`

  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={session?.user?.image || discordAvatarUrl} alt={session?.user?.name || status.user.global_name || status.user.username} />
            <AvatarFallback>{(session?.user?.name || status.user.global_name || status.user.username)?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{status.user.global_name}</h3>
            <p className="text-sm text-muted-foreground">@{status.user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Discord ID" value={status.user.id} />
          {session?.user?.email && <InfoItem label="Email" value={session.user.email} />}
          <InfoItem label="Account Status" value="Active" />
          <InfoItem 
            label="Joined Discord" 
            value={new Date(status.user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} 
          />
          <InfoItem label="Mutual Servers" value={status.guilds.length.toString()} />
        </div>

        {status.guilds.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="text-lg font-semibold mb-3 text-foreground">Shared Servers</h4>
              <ScrollArea className="h-[200px] w-full rounded-md">
                <div className="grid grid-cols-2 gap-4 pr-4">
                  {status.guilds.map((guild) => (
                    <ServerItem key={guild.id} guild={guild} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  )
}

function ServerItem({ guild }: { guild: { id: string; name: string; icon: string | null } }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border p-2 transition-colors hover:bg-secondary/10">
      {guild.icon ? (
        <img
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
          alt=""
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Server className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate text-foreground">{guild.name}</p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg overflow-hidden">
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-lg font-semibold text-destructive">Error loading Discord status</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    </div>
  )
}

function NoConnectionDisplay() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg overflow-hidden">
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Server className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-semibold text-foreground">No Discord connection found</p>
          <p className="text-sm text-muted-foreground">Please connect your Discord account to view your status.</p>
        </div>
      </div>
    </div>
  )
}

