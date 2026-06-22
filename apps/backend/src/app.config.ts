import { defineServer, defineRoom, monitor, } from "colyseus";
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

        app.get("/proxy-avatar", async (req, res) => {
            const { url } = req.query;

            if (!url || typeof url !== 'string') {
                return res.status(400).send("Missing target URL parameter");
            }

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    return res.status(response.status).send(`Failed to fetch image from source: ${response.statusText}`);
                }

                const contentType = response.headers.get('content-type') || 'image/svg+xml';

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                res.setHeader('Content-Type', contentType);
                res.setHeader('Access-Control-Allow-Origin', '*');

                return res.send(buffer);
            } catch (error) {
                console.error("Failed proxying avatar target using fetch:", url, error);
                return res.status(500).send("Error fetching avatar asset");
            }
        });
    },
    beforeListen: () => {

    },
});