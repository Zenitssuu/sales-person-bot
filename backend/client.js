import WebSocket from "ws";
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('🟢 Connected to server');
  ws.send(JSON.stringify({ type: 'speak', payload: 'What is Node.js?' }));
});

ws.on('message', (data) => {
    // console.log(data);
    
  const { type, payload } = JSON.parse(data);
  console.log(`📩 [${type}]:`, payload);
});
