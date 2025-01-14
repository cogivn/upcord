export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email?: string;
  created_at: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  roles?: DiscordRole[];
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
}

export enum GuildVerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export enum GuildExplicitContentFilter {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export enum GuildDefaultMessageNotifications {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

export enum GuildNSFWLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

export enum GuildMFALevel {
  NONE = 0,
  ELEVATED = 1,
}

export const GUILD_FEATURES = {
  ANIMATED_BANNER: 'ANIMATED_BANNER',
  ANIMATED_ICON: 'ANIMATED_ICON',
  BANNER: 'BANNER',
  COMMUNITY: 'COMMUNITY',
  DISCOVERABLE: 'DISCOVERABLE',
  FEATURABLE: 'FEATURABLE',
  INVITE_SPLASH: 'INVITE_SPLASH',
  NEWS: 'NEWS',
  PARTNERED: 'PARTNERED',
  PREVIEW_ENABLED: 'PREVIEW_ENABLED',
  VANITY_URL: 'VANITY_URL',
  VERIFIED: 'VERIFIED',
  VIP_REGIONS: 'VIP_REGIONS',
  WELCOME_SCREEN_ENABLED: 'WELCOME_SCREEN_ENABLED',
} as const;

export type GuildFeature = keyof typeof GUILD_FEATURES;

export const NITRO_TYPES = {
  0: 'None',
  1: 'Nitro Classic',
  2: 'Nitro',
  3: 'Nitro Basic',
} as const;

export type NitroType = keyof typeof NITRO_TYPES;

export const DISCORD_FLAGS = {
  DISCORD_EMPLOYEE: 1 << 0,
  PARTNERED_SERVER_OWNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUG_HUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  BUG_HUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT_DEVELOPER: 1 << 17,
  ACTIVE_DEVELOPER: 1 << 22,
} as const;

export type DiscordFlag = keyof typeof DISCORD_FLAGS;
