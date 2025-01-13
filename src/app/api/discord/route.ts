import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { cache } from 'react';
import type { DiscordUser, DiscordGuild } from '@/types/discord';
import type { DiscordApiResponse, ErrorResponse } from '@/types/api';

const DISCORD_API_URL = 'https://discord.com/api/v10';

// Cache the API response for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry {
  data: DiscordApiResponse;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry>();

const getDiscordData = cache(async (accessToken: string): Promise<DiscordApiResponse> => {
  const [userResponse, guildsResponse] = await Promise.all([
    fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ]);

  if (!userResponse.ok || !guildsResponse.ok) {
    throw new Error('Failed to fetch Discord data');
  }

  const userData: DiscordUser = await userResponse.json();
  const guildsData: DiscordGuild[] = await guildsResponse.json();

  return {
    user: {
      ...userData,
      created_at: new Date(Number((BigInt(userData.id) >> BigInt(22)) + BigInt(1420070400000))).toISOString(),
    },
    guilds: guildsData,
  };
});

function getCachedData(userId: string): DiscordApiResponse | null {
  const cached = apiCache.get(userId);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    apiCache.delete(userId);
    return null;
  }

  return cached.data;
}

export async function GET(): Promise<NextResponse<DiscordApiResponse | ErrorResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', status: 401 },
        { status: 401 }
      );
    }

    // Check cache first
    const cached = getCachedData(session.user.id);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Get fresh data if not cached
    const accessToken = session.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token', status: 401 },
        { status: 401 }
      );
    }

    const data = await getDiscordData(accessToken);

    // Update cache
    apiCache.set(session.user.id, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discord API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}
