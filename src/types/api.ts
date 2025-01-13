import type { DiscordUser, DiscordGuild } from './discord';

export interface DiscordApiResponse {
  user: DiscordUser;
  guilds: DiscordGuild[];
}

export interface ErrorResponse {
  error: string;
  status: number;
}

export type ApiResponse<T> = T | ErrorResponse;

export function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response;
}
