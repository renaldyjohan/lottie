import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors package
import { register, login, authMiddleware } from './userController';
import { createAnimation, getAnimation, getAnimationList, updateAnimation, setWebSocketServer } from './animationController';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Auth routes
app.post('/register', register);
app.post('/login', login);

// Animation routes (protected)
app.post('/animations', authMiddleware, createAnimation);
app.get('/animations/:id', authMiddleware, getAnimation);
app.get('/animations', authMiddleware, getAnimationList);
app.put('/animations/:id', authMiddleware, updateAnimation);

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Pass the WebSocket server to the controller
setWebSocketServer(wss);

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
