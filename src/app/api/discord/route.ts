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
    const userError = await userResponse.text().catch(() => 'Failed to get error text');
    const guildsError = await guildsResponse.text().catch(() => 'Failed to get error text');
    console.error('Discord API responses:', {
      user: {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error: userError
      },
      guilds: {
        status: guildsResponse.status,
        statusText: guildsResponse.statusText,
        error: guildsError
      }
    });
    throw new Error(`Failed to fetch Discord data: User(${userResponse.status}), Guilds(${guildsResponse.status})`);
  }

  const userData: DiscordUser = await userResponse.json();
  const guildsData: DiscordGuild[] = await guildsResponse.json();

  // Fetch roles for each guild where the user has the MANAGE_ROLES permission
  const guildsWithRoles = await Promise.all(
    guildsData.map(async (guild) => {
      const permissions = BigInt(guild.permissions);
      const hasManageRoles = (permissions & BigInt(0x10000000)) !== BigInt(0); // MANAGE_ROLES permission
      
      if (hasManageRoles) {
        try {
          const rolesResponse = await fetch(`${DISCORD_API_URL}/guilds/${guild.id}/roles`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (rolesResponse.ok) {
            const roles = await rolesResponse.json();
            return { ...guild, roles };
          }
        } catch (error) {
          console.error(`Failed to fetch roles for guild ${guild.id}:`, error);
        }
      }
      return guild;
    })
  );

  return {
    user: {
      ...userData,
      created_at: new Date(Number((BigInt(userData.id) >> BigInt(22)) + BigInt(1420070400000))).toISOString(),
    },
    guilds: guildsWithRoles,
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
      console.error('No session or user ID found');
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
      console.error('No access token found in session');
      return NextResponse.json(
        { error: 'No access token', status: 401 },
        { status: 401 }
      );
    }

    console.log('Fetching Discord data with token:', accessToken.substring(0, 10) + '...');
    const data = await getDiscordData(accessToken);

    // Update cache
    apiCache.set(session.user.id, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discord API error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}
