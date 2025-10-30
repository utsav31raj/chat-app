import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { UsernameInput } from './components/UsernameInput';
import { ChatRoom } from './components/ChatRoom';

const SOCKET_URL = "https://chat-app-st53.onrender.com";

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleJoin = (name: string) => {
    setUsername(name);
    socket?.emit('join', name);
  };

  const handleLeave = () => {
    setUsername('');
    socket?.disconnect();
    socket?.connect();
  };

  if (!socket || !isConnected) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return <UsernameInput onJoin={handleJoin} />;
  }

  return <ChatRoom socket={socket} username={username} onLeave={handleLeave} />;
}

export default App;
