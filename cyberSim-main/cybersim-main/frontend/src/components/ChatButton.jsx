import React, { useState } from 'react';
import LiveChat from './LiveChat';
import '../styles/ChatButton.css';

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <>
      <div className="chat-button-container">
        <button 
          className="chat-button"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (!isChatOpen) setUnreadCount(0);
          }}
          title="Open chat with support agent"
        >
          <span className="chat-button-icon">💬</span>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </button>
      </div>
      
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
