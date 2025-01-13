import { DiscordUserClient } from './user-client';
import { DiscordUser, DiscordGuild } from './types';

interface ConnectionStatus {
  isConnected: boolean;
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  lastConnected: Date | null;
  error: string | null;
}

let client: DiscordUserClient | null = null;
let status: ConnectionStatus = {
  isConnected: false,
  user: null,
  guilds: [],
  lastConnected: null,
  error: null,
};

export async function initializeUserClient(accessToken: string, userId: string) {
  try {
    // Create new client instance
    const newClient = new DiscordUserClient(accessToken, userId);
    
    // Test connection by fetching user profile
    const user = await newClient.getUser();
    const guilds = await newClient.getUserGuilds();
    
    // Only update global client and status if the connection was successful
    client = newClient;
    status = {
      isConnected: true,
      user,
      guilds,
      lastConnected: new Date(),
      error: null,
    };
    
    return client;
  } catch (error) {
    // Update status but don't update client if there was an error
    status = {
      isConnected: false,
      user: null,
      guilds: [],
      lastConnected: null,
      error: error instanceof Error ? error.message : 'Failed to connect to Discord',
    };
    throw error;
  }
}

export function getUserClient(): DiscordUserClient {
  if (!client || !status.isConnected) {
    throw new Error('Discord client not initialized');
  }
  return client;
}

export function getConnectionStatus(): ConnectionStatus {
  return { ...status }; // Return a copy to prevent mutation
}

export async function refreshStatus() {
  if (!client || !status.isConnected) {
    throw new Error('Discord client not initialized');
  }

  try {
    const user = await client.getUser();
    const guilds = await client.getUserGuilds();
    
    status = {
      isConnected: true,
      user,
      guilds,
      lastConnected: new Date(),
      error: null,
    };
  } catch (error) {
    status = {
      isConnected: false,
      user: null,
      guilds: [],
      lastConnected: status.lastConnected,
      error: error instanceof Error ? error.message : 'Failed to refresh Discord status',
    };
    throw error;
  }
}

export async function getUserGuilds() {
  return getUserClient().getUserGuilds();
}

export async function getUser() {
  return getUserClient().getUser();
}

export async function getGuildRoles(guildId: string) {
  return getUserClient().getGuildRoles(guildId);
}

export async function getGuildMember(guildId: string) {
  return getUserClient().getGuildMember(guildId);
}
