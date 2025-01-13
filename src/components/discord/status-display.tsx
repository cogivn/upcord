import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDiscordUser } from '@/hooks/use-discord-user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from 'next-auth/react';

interface DiscordStatus {
  isConnected: boolean;
  user: {
    id: string;
    username: string;
    discriminator: string;
    global_name: string | null;
    avatar: string | null;
    created_at: string;
  } | null;
  guilds: Array<{
    id: string;
    name: string;
    icon: string | null;
  }>;
  lastConnected: string | null;
  error: string | null;
}

export function DiscordStatusDisplay() {
  const { data: session } = useSession();
  const { user, guilds, isLoading, error } = useDiscordUser();
  const [status, setStatus] = useState<DiscordStatus | null>(null);

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
      };
      setStatus(status);
    }
  }, [user, guilds]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error loading Discord status: {error}
      </div>
    );
  }

  if (!status?.user) {
    return (
      <div className="text-muted-foreground">
        No Discord connection found
      </div>
    );
  }

  const discordAvatarUrl = status.user.avatar
    ? `https://cdn.discordapp.com/avatars/${status.user.id}/${status.user.avatar}.${
        status.user.avatar.startsWith("a_") ? "gif" : "png"
      }`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(status.user.discriminator) % 5}.png`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={session?.user?.image || discordAvatarUrl} alt={session?.user?.name || status.user.global_name || status.user.username} />
          <AvatarFallback>{(session?.user?.name || status.user.global_name || status.user.username)?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{status.user.global_name}</h3>
            <p className="text-sm text-muted-foreground">{status.user.username}</p>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="secondary">
              Discord ID: {status.user.id}
            </Badge>
            <Badge className="bg-green-500 text-white hover:bg-green-600">
              Connected
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full pt-4 border-t">
          <dl className="space-y-2">
            {session?.user?.email && (
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="text-sm font-medium">{session.user.email}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Account Status</dt>
              <dd className="text-sm font-medium">Active</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Joined Server</dt>
              <dd className="text-sm font-medium">
                {new Date(status.user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Mutual Servers</dt>
              <dd className="text-sm font-medium">{status.guilds.length}</dd>
            </div>
          </dl>
        </div>

        {status.guilds.length > 0 && (
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-3">Shared Servers</h4>
            <div className="grid grid-cols-2 gap-2">
              {status.guilds.slice(0, 6).map((guild) => {
                const guildIcon = guild.icon
                  ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                  : null;

                return (
                  <div key={guild.id} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50">
                    {guildIcon ? (
                      <img
                        src={guildIcon}
                        alt={`${guild.name} icon`}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          {guild.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm truncate">{guild.name}</span>
                  </div>
                );
              })}
            </div>
            {status.guilds.length > 6 && (
              <p className="text-sm text-muted-foreground mt-2">
                +{status.guilds.length - 6} more servers
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
