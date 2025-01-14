"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
let client = null;
app.post('/start', async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }
        if (client) {
            return res.status(400).json({ error: 'Bot is already running' });
        }
        client = new discord_js_selfbot_v13_1.Client({
            ws: { compress: false }
        });
        await client.login(accessToken);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Failed to start bot:', error);
        res.status(500).json({ error: 'Failed to start bot' });
    }
});
app.post('/stop', async (req, res) => {
    try {
        if (!client) {
            return res.status(400).json({ error: 'Bot is not running' });
        }
        await client.destroy();
        client = null;
        res.json({ success: true });
    }
    catch (error) {
        console.error('Failed to stop bot:', error);
        res.status(500).json({ error: 'Failed to stop bot' });
    }
});
app.get('/status', (req, res) => {
    if (!client) {
        return res.json({ status: 'stopped' });
    }
    res.json({
        status: 'running',
        user: client.user ? {
            id: client.user.id,
            username: client.user.username,
            discriminator: client.user.discriminator,
            avatar: client.user.avatar
        } : null
    });
});
const PORT = process.env.BOT_SERVER_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bot server running on port ${PORT}`);
});
