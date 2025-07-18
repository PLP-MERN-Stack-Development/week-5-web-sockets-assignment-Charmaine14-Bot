import React, { useState, useRef } from 'react';
import { Send, Plus, Gift, Smile } from 'lucide-react';

const MessageInput = ({ onSendMessage, onTyping, placeholder = "Message #general" }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      handleTypingStop();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    if (!isTyping && onTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1000);
  };

  const handleTypingStop = () => {
    if (isTyping && onTyping) {
      setIsTyping(false);
      onTyping(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-4 pb-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <div className="bg-gray-700 rounded-lg flex items-center">
            <button
              type="button"
              className="p-3 hover:bg-gray-600 rounded-l-lg"
            >
              <Plus size={20} className="text-gray-400" />
            </button>
            
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white p-3 focus:outline-none"
              autoComplete="off"
            />
            
            <div className="flex items-center px-2">
              <button
                type="button"
                className="p-1 hover:bg-gray-600 rounded mr-1"
              >
                <Gift size={18} className="text-gray-400" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-600 rounded"
              >
                <Smile size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg transition-colors"
        >
          <Send size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;