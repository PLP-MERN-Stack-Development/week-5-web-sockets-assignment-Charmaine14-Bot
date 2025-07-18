import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from '../Users/UserList';
import TypingIndicator from './TypingIndicator';
import { Hash, Users, Settings, Search, Bell, Pin, Mic, Headphones } from 'lucide-react';

const ChatRoom = ({ roomId = 'general' }) => {
  const [messages, setMessages] = useState([
    // Sample messages for testing
    {
      id: 1,
      text: 'Welcome to the chat room!',
      userId: 'system',
      username: 'System',
      roomId: 'general',
      timestamp: new Date().toISOString(),
      avatar: 'https://ui-avatars.com/api/?name=System&background=36393f&color=fff'
    }
  ]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const { user } = useAuth();
  const { socket, emit, isConnected } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && isConnected) {
      // Join room
      emit('join_room', { roomId, user });

      // Listen for messages
      socket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for user updates
      socket.on('room_users', (users) => {
        setOnlineUsers(users);
      });

      // Listen for typing
      socket.on('user_typing', (data) => {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId);
          return data.isTyping ? [...filtered, data] : filtered;
        });
      });

      return () => {
        socket.off('new_message');
        socket.off('room_users');
        socket.off('user_typing');
      };
    }
  }, [socket, isConnected, roomId, user, emit]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (messageText) => {
    if (messageText.trim() && user) {
      const message = {
        id: Date.now(),
        text: messageText,
        userId: user.uid,
        username: user.displayName || user.email,
        roomId,
        timestamp: new Date().toISOString(),
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=5865f2&color=fff`
      };
      
      // Add message locally first for immediate feedback
      setMessages(prev => [...prev, message]);
      
      // Emit to server if connected
      if (isConnected) {
        emit('send_message', message);
      }
    }
  };

  const handleTyping = (isTyping) => {
    if (isConnected && user) {
      emit('typing', {
        userId: user.uid,
        username: user.displayName || user.email,
        roomId,
        isTyping
      });
    }
  };

  const channels = [
    { id: 'general', name: 'general', active: roomId === 'general' },
    { id: 'music', name: 'music', active: roomId === 'music' },
    { id: 'random', name: 'random', active: roomId === 'random' },
    { id: 'tech', name: 'tech', active: roomId === 'tech' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 flex flex-col">
        {/* Server Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Music Chat Server</h2>
          <div className="text-xs text-gray-400 mt-1">
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Text Channels</h3>
            <div className="space-y-1">
              {channels.map(channel => (
                <div 
                  key={channel.id}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 cursor-pointer ${
                    channel.active ? 'bg-gray-700' : ''
                  }`}
                >
                  <Hash size={16} className="text-gray-400" />
                  <span className="text-gray-300">{channel.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Online Users */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Online — {onlineUsers.length}
            </h3>
            <div className="space-y-1">
              {onlineUsers.length === 0 ? (
                <div className="text-sm text-gray-500">No users online</div>
              ) : (
                onlineUsers.map(user => (
                  <div key={user.userId} className="flex items-center gap-2 p-1">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <span className="text-gray-300 text-sm">{user.username}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Panel */}
        <div className="p-3 bg-gray-900 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=5865f2&color=fff`}
                alt={user?.displayName || user?.email}
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                {user?.displayName || user?.email}
              </div>
              <div className="text-xs text-gray-400">
                {isConnected ? 'Online' : 'Offline'}
              </div>
            </div>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-gray-700 rounded">
                <Mic size={16} className="text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <Headphones size={16} className="text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <Settings size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Hash size={20} className="text-gray-400" />
            <span className="font-semibold text-white">{roomId}</span>
            <div className="w-px h-6 bg-gray-600 mx-2"></div>
            <span className="text-sm text-gray-400">Welcome to #{roomId}!</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-700 rounded">
              <Bell size={16} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded">
              <Pin size={16} className="text-gray-400" />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded"
              onClick={() => setShowUserList(!showUserList)}
            >
              <Users size={16} className="text-gray-400" />
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-900 text-white pl-10 pr-4 py-1 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <MessageList messages={messages} />
            <TypingIndicator typingUsers={typingUsers} />
            <MessageInput 
              onSendMessage={handleSendMessage} 
              onTyping={handleTyping}
              placeholder={`Message #${roomId}`}
            />
          </div>
          
          {/* User List Sidebar */}
          {showUserList && (
            <div className="w-60 bg-gray-800 border-l border-gray-700">
              <UserList users={onlineUsers} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;