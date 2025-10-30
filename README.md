# Real-Time Chat Room App

A modern, real-time chat room application built with React, TypeScript, Tailwind CSS, and Socket.io.

## Features

- Join chat room with username
- Public room chat with real-time messaging
- Live message broadcasting with sender name & timestamp
- Auto-scroll to latest messages
- "User joined/left" system messages
- Online users list with live updates
- WhatsApp-inspired clean UI
- Fully responsive design

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client
- Vite

**Backend:**
- Node.js
- Express
- Socket.io
- In-memory storage

## Local Development

### Prerequisites
- Node.js 18+ installed

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the backend server (in one terminal):
```bash
npm run server
```

3. Start the frontend dev server (in another terminal):
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set environment variable:
   - `VITE_SOCKET_URL`: Your backend server URL (e.g., `https://your-backend.onrender.com`)
5. Deploy

### Backend (Render)

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set the following:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
5. Deploy

### Important: Update Socket URL

After deploying the backend, update the `VITE_SOCKET_URL` in your Vercel environment variables to point to your Render backend URL.

## How It Works

- Users enter a username to join the chat
- Messages are broadcast in real-time to all connected users
- System messages notify when users join or leave
- All data is stored in-memory (resets on server restart)
- Auto-scrolling keeps the chat view on the latest messages

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ChatRoom.tsx       # Main chat interface
│   │   └── UsernameInput.tsx  # Username entry screen
│   ├── types.ts               # TypeScript interfaces
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── server.js                  # Backend Socket.io server
└── package.json
```
