import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);

    io.emit('system-message', {
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString()
    });

    io.emit('user-list', Array.from(users.values()));
  });

  socket.on('send-message', (message) => {
    const username = users.get(socket.id);
    if (username) {
      io.emit('receive-message', {
        username,
        text: message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);

      io.emit('system-message', {
        text: `${username} left the chat`,
        timestamp: new Date().toISOString()
      });

      io.emit('user-list', Array.from(users.values()));
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
