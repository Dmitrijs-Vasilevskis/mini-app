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
    pingInterval: 6000,
    pingMaxRetries: 4,
    maxPayload: 1024 * 1024 * 1, // 1 MB
  }),
  devMode: true, // enables hot-reload for development
});

gameServer.define('uno', UNORoom).filterBy(['roomCode']);

// Mount Colyseus matchmaker routes
listen(gameServer);