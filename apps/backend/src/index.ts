import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { matchMaker, Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { UNORoom } from './rooms/UNORoom';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const PORT = Number(process.env.PORT) || 2567;

app.use(express.json());

app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
    pingInterval: 8000,
    pingMaxRetries: 3,
  }),
});

gameServer.define('uno', UNORoom).filterBy(['roomCode']);

// Mount Colyseus matchmaker routes

app.post("/matchmake/:method/:roomName", async (req, res) => {
  try {
    const { method, roomName } = req.params;

    const result = await (matchMaker as any)[method](
      roomName,
      req.body
    );

    res.json(result);
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
});

httpServer.listen(process.env.PORT || 2567, () => {
  console.log("🚀 Server running on", PORT);
});
