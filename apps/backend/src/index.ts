import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'colyseus';
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


httpServer.listen(Number(process.env.PORT) || 2567, () => {
  console.log("🚀 HTTP + Colyseus server running");
});
