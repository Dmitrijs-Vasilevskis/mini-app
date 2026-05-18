import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { listen } from '@colyseus/tools';

import { UNORoom } from './rooms/UNORoom';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000', // docker frontend
      'http://localhost:5173', // local vite dev
    ],
    credentials: true,
  })
);

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
  }),
});

gameServer.define('uno', UNORoom);

// Mount Colyseus matchmaker routes
listen(gameServer, httpServer);

const PORT = Number(process.env.PORT) || 2567;

httpServer.listen(PORT, () => {
  console.log(`✅ Backend + Colyseus running on port ${PORT}`);
  console.log(`🎮 Colyseus WS endpoint: ws://localhost:${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});