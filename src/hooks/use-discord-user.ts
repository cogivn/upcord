'use client';

import { useDiscordData } from './use-discord-client';
import type { DiscordUser, DiscordGuild } from '@/types/discord';

interface UseDiscordUserReturn {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  isLoading: boolean;
  error: Error | null;
}

export function useDiscordUser(): UseDiscordUserReturn {
  const { data, isLoading, error } = useDiscordData();

  return {
    user: data?.user ?? null,
    guilds: data?.guilds ?? [],
    isLoading,
    error,
  };
}