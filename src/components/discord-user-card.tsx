'use client';

import { useDiscordUser } from '@/hooks/use-discord-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DiscordUserCard() {
  const { data: user, isLoading, error } = useDiscordUser();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load Discord user</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <span>{user.username}</span>
        </CardTitle>
        <CardDescription>Discord User</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span>{user.id}</span>
          </div>
          {user.discriminator !== '0' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discriminator:</span>
              <span>#{user.discriminator}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Global Name:</span>
            <span>{user.global_name || 'None'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
