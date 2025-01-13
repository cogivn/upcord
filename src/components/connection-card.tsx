'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiscordUser } from '@/hooks/use-discord-user';
import { useDiscordServers } from '@/hooks/use-discord-servers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Crown, Mail, Shield, Star, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { DISCORD_FLAGS, NITRO_TYPES, type NitroType } from '@/types/discord';

export function ConnectionCard() {
  const { user, isLoading: isLoadingUser } = useDiscordUser();
  const { servers, isLoading: isLoadingServers } = useDiscordServers();

  const isLoading = isLoadingUser || isLoadingServers;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[150px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-[100px] mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : undefined;

  const bannerUrl = user.banner
    ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png`
    : undefined;

  const userFlags = Object.entries(DISCORD_FLAGS).filter(
    ([_, flag]) => user.public_flags & flag
  );

  const ownedServers = servers.filter((server) => server.owner);
  const adminServers = servers.filter(
    (server) => !server.owner && hasAdminPermission(server.permissions)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Discord Connection</CardTitle>
            <CardDescription>Your Discord account details</CardDescription>
          </div>
          <Badge variant="secondary">{servers.length} Servers</Badge>
        </CardHeader>
      </CardContent>
      <CardContent className="space-y-6">
        {bannerUrl && (
          <div className="relative h-32 w-full rounded-lg overflow-hidden">
            <img
              src={bannerUrl}
              alt="User banner"
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex items-start space-x-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-lg">{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-medium">
                {user.global_name || user.username}
              </div>
              {user.premium_type > 0 && (
                <Badge variant="secondary" className="font-normal">
                  {NITRO_TYPES[user.premium_type as NitroType]}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{user.username}</span>
            </div>
            {user.email && (
              <div className="text-sm text-muted-foreground flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
                {user.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
            )}
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <CalendarDays className="h-3 w-3" />
              <span>Joined {format(new Date(user.created_at), 'PPP')}</span>
            </div>
          </div>
        </div>

        {userFlags.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="font-medium mb-2">Badges</div>
              <div className="flex flex-wrap gap-1">
                {userFlags.map(([name]) => (
                  <Badge key={name} variant="outline">
                    {name.split('_').join(' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div>
          <div className="font-medium mb-3">Server Overview</div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>Owner</span>
              </div>
              <Badge variant="outline">{ownedServers.length}</Badge>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Admin</span>
              </div>
              <Badge variant="outline">{adminServers.length}</Badge>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-purple-500" />
                <span>Member</span>
              </div>
              <Badge variant="outline">
                {servers.length - ownedServers.length - adminServers.length}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {servers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Joined Servers</div>
              <Badge variant="outline" className="text-xs">
                {servers.length} Total
              </Badge>
            </div>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-3">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      {server.icon && (
                        <AvatarImage
                          src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                          alt={server.name}
                        />
                      )}
                      <AvatarFallback className="text-xs">{server.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{server.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center space-x-2">
                        <span className="truncate">ID: {server.id}</span>
                        {server.owner && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            Owner
                          </Badge>
                        )}
                        {!server.owner && hasAdminPermission(server.permissions) && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
