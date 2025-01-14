"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBot = startBot;
exports.stopBot = stopBot;
exports.getBotStatus = getBotStatus;
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client = null;
async function startBot(accessToken) {
    if (client) {
        return { error: 'Bot is already running' };
    }
    try {
        client = new discord_js_selfbot_v13_1.Client({
            ws: { compress: false }
        });
        client.on('ready', async () => {
            if (!(client === null || client === void 0 ? void 0 : client.user))
                return;
            console.log(`Logged in as ${client.user.username}`);
        });
        client.on('messageCreate', async (message) => {
            if ((client === null || client === void 0 ? void 0 : client.user) && message.mentions.users.has(client.user.id)) {
                console.log('Bot was mentioned:', message.content);
            }
        });
        client.on('messageCreate', async (message) => {
            if ((client === null || client === void 0 ? void 0 : client.user) && message.channel.type === 'DM' && message.author.id !== client.user.id) {
                console.log('Received DM:', message.content);
            }
        });
        await client.login(accessToken);
        return { success: true };
    }
    catch (error) {
        console.error('Failed to start bot:', error);
        return { error: 'Failed to start bot' };
    }
}
async function stopBot() {
    if (!client) {
        return { error: 'Bot is not running' };
    }
    try {
        await client.destroy();
        client = null;
        return { success: true };
    }
    catch (error) {
        console.error('Failed to stop bot:', error);
        return { error: 'Failed to stop bot' };
    }
}
function getBotStatus() {
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
//# sourceMappingURL=discord-bot.js.map