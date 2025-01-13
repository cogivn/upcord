export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: PermissionOverwrite[];
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: DiscordUser[];
  parent_id?: string | null;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: DiscordUser[];
  mention_roles: string[];
  attachments: Attachment[];
  embeds: Embed[];
  reactions?: Reaction[];
  pinned?: boolean;
  webhook_id?: string;
  type: number;
  reference?: MessageReference;
}

interface PermissionOverwrite {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type?: string;
  height?: number | null;
  width?: number | null;
}

interface Embed {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

interface EmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

interface EmbedImage {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

interface EmbedThumbnail {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface Reaction {
  count: number;
  me: boolean;
  emoji: {
    id: string | null;
    name: string;
    animated?: boolean;
  };
}

interface MessageReference {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
}
