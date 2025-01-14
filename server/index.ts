import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once('ready', () => {
  console.log('Discord bot is ready! 🚀');
});

client.on('messageCreate', async (message) => {
  // Handle message events here
  if (message.author.bot) return;
  
  // Example: Forward mentions
  if (message.mentions.users.has(client.user!.id)) {
    console.log(`Mentioned in ${message.guild?.name}: ${message.content}`);
  }
});

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Start the bot
client.login(process.env.DISCORD_BOT_TOKEN);
