import React from 'react';
import { Message } from '../../types';

interface ChatBubbleProps {
  message: Message;
  onMarkAsPivotal?: (messageId: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onMarkAsPivotal }) => {
  const isUserMessage = message.role === 'user';
  
  return (
    <div 
      className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
    >
      <div 
        className={`
          ${isUserMessage 
            ? 'bg-detective-accent text-detective-light rounded-md border-2 border-detective-accent self-end shadow-vintage' 
            : 'bg-detective-secondary/80 text-detective-paper rounded-md border-2 border-detective-secondary self-start shadow-vintage'
          } 
          p-4 max-w-[85%] 
          ${message.isPivotal ? 'ring-2 ring-hint ring-offset-2 ring-offset-detective-darkTexture' : ''}
          cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:translate-x-1 hover:translate-y-1
        `}
        onClick={() => {
          if (!isUserMessage && onMarkAsPivotal) {
            onMarkAsPivotal(message.id);
          }
        }}
      >
        <p className="font-typewriter leading-relaxed">{message.content}</p>
        {!isUserMessage && (
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-detective-paper/70 font-typewriter">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            {!message.isPivotal && (
              <span className="text-xs text-detective-accent cursor-pointer hover:underline font-typewriter">
                标记线索
              </span>
            )}
            {message.isPivotal && (
              <span className="text-xs text-hint font-bold font-typewriter">
                关键线索
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;