import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import { startBot, stopBot, getBotStatus } from './discord-bot';

const app = express();
const router = Router();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

router.post('/bot/start', async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      res.status(400).json({ error: 'Access token is required' });
      return;
    }

    const result = await startBot(accessToken);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }

    const status = getBotStatus();
    res.json(status);
  } catch (error) {
    console.error('Failed to start bot:', error);
    res.status(500).json({ error: 'Failed to start bot' });
  }
});

router.post('/bot/stop', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await stopBot();
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to stop bot:', error);
    res.status(500).json({ error: 'Failed to stop bot' });
  }
});

router.get('/bot/status', (_req: Request, res: Response): void => {
  try {
    const status = getBotStatus();
    res.json(status);
  } catch (error) {
    console.error('Failed to get bot status:', error);
    res.status(500).json({ error: 'Failed to get bot status' });
  }
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
