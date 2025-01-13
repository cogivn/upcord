import { DiscordUser, DiscordGuild } from './types';

export class DiscordUserClient {
  private accessToken: string;
  private userId: string;

  constructor(accessToken: string, userId: string) {
    this.accessToken = accessToken;
    this.userId = userId;
  }

  private async fetchFromDiscord(endpoint: string) {
    const response = await fetch(`https://discord.com/api/v10${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<DiscordUser> {
    return this.fetchFromDiscord('/users/@me');
  }

  async getUserGuilds(): Promise<DiscordGuild[]> {
    return this.fetchFromDiscord('/users/@me/guilds');
  }

  async getGuildRoles(guildId: string): Promise<any[]> {
    return this.fetchFromDiscord(`/guilds/${guildId}/roles`);
  }

  async getGuildMember(guildId: string): Promise<any> {
    return this.fetchFromDiscord(`/guilds/${guildId}/members/${this.userId}`);
  }
}
