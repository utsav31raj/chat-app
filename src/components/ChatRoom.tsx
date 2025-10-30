import { useState, useEffect, useRef } from 'react';
import { Send, Users, LogOut } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { Message, SystemMessage } from '../types';

interface ChatRoomProps {
  socket: Socket;
  username: string;
  onLeave: () => void;
}

type ChatMessage =
  | { type: 'user'; data: Message }
  | { type: 'system'; data: SystemMessage };

export function ChatRoom({ socket, username, onLeave }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('receive-message', (message: Message) => {
      setMessages((prev) => [...prev, { type: 'user', data: message }]);
    });

    socket.on('system-message', (message: SystemMessage) => {
      setMessages((prev) => [...prev, { type: 'system', data: message }]);
    });

    socket.on('user-list', (userList: string[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off('receive-message');
      socket.off('system-message');
      socket.off('user-list');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('send-message', inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">ChatRoom</h1>
              <p className="text-sm text-slate-500">{users.length} online</p>
            </div>
          </div>

          <button
            onClick={onLeave}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Leave</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, index) => (
            msg.type === 'system' ? (
              <div key={index} className="flex justify-center">
                <div className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                  {msg.data.text}
                </div>
              </div>
            ) : (
              <div
                key={index}
                className={`flex ${msg.data.username === username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md ${
                    msg.data.username === username
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-slate-800'
                  } rounded-2xl px-4 py-2 shadow-sm`}
                >
                  {msg.data.username !== username && (
                    <div className="text-xs font-semibold mb-1 text-blue-600">
                      {msg.data.username}
                    </div>
                  )}
                  <div className="break-words">{msg.data.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.data.username === username ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {formatTime(msg.data.timestamp)}
                  </div>
                </div>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="bg-white border-t border-slate-200 px-6 py-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-medium"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </form>
      </div>

      <aside className="w-64 bg-white border-l border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
          Online ({users.length})
        </h2>
        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${user === username ? 'font-semibold text-blue-600' : 'text-slate-700'}`}>
                {user} {user === username && '(You)'}
              </span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
