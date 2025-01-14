"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const discord_bot_1 = require("./discord-bot");
const app = (0, express_1.default)();
const router = (0, express_1.Router)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3001;
router.post('/bot/start', async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            res.status(400).json({ error: 'Access token is required' });
            return;
        }
        const result = await (0, discord_bot_1.startBot)(accessToken);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        const status = (0, discord_bot_1.getBotStatus)();
        res.json(status);
    }
    catch (error) {
        console.error('Failed to start bot:', error);
        res.status(500).json({ error: 'Failed to start bot' });
    }
});
router.post('/bot/stop', async (_req, res) => {
    try {
        const result = await (0, discord_bot_1.stopBot)();
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Failed to stop bot:', error);
        res.status(500).json({ error: 'Failed to stop bot' });
    }
});
router.get('/bot/status', (_req, res) => {
    try {
        const status = (0, discord_bot_1.getBotStatus)();
        res.json(status);
    }
    catch (error) {
        console.error('Failed to get bot status:', error);
        res.status(500).json({ error: 'Failed to get bot status' });
    }
});
app.use(router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map