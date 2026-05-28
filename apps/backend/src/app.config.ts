import { defineServer, defineRoom, monitor,  } from "colyseus";
import { WebSocketTransport } from '@colyseus/ws-transport';
import { UNORoom } from "./rooms/UNORoom";
import cors from 'cors';
import express from 'express';

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

export const server = defineServer({
    devMode: true,
    transport: new WebSocketTransport({
        pingInterval: 6000,
        pingMaxRetries: 4,
        maxPayload: 1024 * 1024 * 1,
    }),
    rooms: {
        uno: defineRoom(UNORoom).filterBy(['roomCode'])
    },
    express: (app) => {
        app.use(cors({
            origin: allowedOrigins,
            credentials: true
        }));

        app.use(express.json());

        app.get("/health", (_, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
              });
        });

        app.use('/colyseus', monitor());
    },
    beforeListen: () => {

    },
});