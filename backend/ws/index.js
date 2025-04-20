import WebSocket from 'ws';
import { socketHandler } from './socketHandler.js';


export const webSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('🟢 New client connected');

    ws.on('message', (data) => socketHandler(ws, data));

    ws.on('close', () => console.log('🔴 Client disconnected'));
    ws.on('error', (err) => console.log('⚠️ WS Error:', err.message));
  });

  console.log('🌐 WebSocket server ready');
}


