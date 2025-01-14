import { Client } from 'discord.js-selfbot-v13';
import dotenv from 'dotenv';

dotenv.config();

let client: Client | null = null;

export async function startBot(accessToken: string) {
  console.log('Starting bot...');
  
  if (client) {
    console.log('Bot is already running');
    return { error: 'Bot is already running' };
  }

  try {
    console.log('Creating new Discord client...');
    client = new Client({
      ws: { compress: false },
    });

    client.on('ready', async () => {
      if (!client?.user) return;
      console.log(`Logged in successfully as ${client.user.username}`);
    });

    client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    // Handle mentions
    client.on('messageCreate', async (message) => {
      if (client?.user && message.mentions.users.has(client.user.id)) {
        console.log('Bot was mentioned:', message.content);
      }
    });

    // Handle DMs
    client.on('messageCreate', async (message) => {
      if (client?.user && message.channel.type === 'DM' && message.author.id !== client.user.id) {
        console.log('Received DM:', message.content);
      }
    });

    console.log('Attempting to login with token...');
    await client.login(accessToken);
    console.log('Login successful');
    return { success: true };
  } catch (error) {
    console.error('Failed to start bot:', error);
    // Reset client if login fails
    client = null;
    return { error: error instanceof Error ? error.message : 'Failed to start bot' };
  }
}

export async function stopBot() {
  console.log('Stopping bot...');
  if (!client) {
    console.log('Bot is not running');
    return { error: 'Bot is not running' };
  }

  try {
    await client.destroy();
    client = null;
    console.log('Bot stopped successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to stop bot:', error);
    return { error: 'Failed to stop bot' };
  }
}

export function getBotStatus() {
  if (!client) {
    return { status: 'stopped' };
  }

  return {
    status: 'running',
    user: client.user ? {
      id: client.user.id,
      username: client.user.username,
      discriminator: client.user.discriminator,
      avatar: client.user.avatar
    } : null
  };
}
