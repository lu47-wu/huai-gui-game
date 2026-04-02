import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import ChatBubble from './ChatBubble';

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onMarkAsPivotal: (messageId: string) => void;
  onRequestHint: () => void;
  onRevealAnswer: () => void;
  onEndGame: () => void;
  isLoading?: boolean;
  isGameOver?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  onMarkAsPivotal,
  onRequestHint,
  onRevealAnswer,
  onEndGame,
  isLoading = false,
  isGameOver = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || isGameOver) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="w-full">
      <div className="mt-8">
        <h2 className="text-2xl font-serif font-bold mb-6 text-detective-paper border-b-2 border-detective-accent pb-2">侦探笔记</h2>
        <div className="bg-detective-paperDark border-2 border-detective-secondary p-6 rounded-md shadow-vintage max-h-[500px] overflow-y-auto inner-vintage">
          {/* 空状态 */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-detective-paper/60">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-center font-typewriter">还没有对话记录</p>
              <p className="text-center text-sm mt-2 font-typewriter">开始提问，探索故事的真相吧！</p>
            </div>
          )}
          
          {/* 消息列表 */}
          {messages.map(message => (
            <ChatBubble
              key={message.id}
              message={message}
              onMarkAsPivotal={onMarkAsPivotal}
            />
          ))}
          
          {/* 加载动画 */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-detective-secondary/80 text-detective-paper rounded-md p-4 max-w-[85%] self-start border-l-4 border-semantic-ai flex items-center space-x-3">
                <div className="w-8 h-8 relative">
                  {/* 旋转的放大镜 */}
                  <div className="absolute inset-0 flex items-center justify-center loading-magnifier">
                    <div className="w-6 h-6 rounded-full border-2 border-detective-accent flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-detective-accent"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-detective-accent transform rotate-45"></div>
                  </div>
                </div>
                <p className="font-typewriter">推理中...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-detective-paperDark border-2 border-detective-secondary p-4 rounded-md shadow-vintage inner-vintage">
          <h3 className="text-lg font-serif font-bold mb-3 text-detective-accent">调查询问</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder={isGameOver ? "游戏已结束" : "你可以问我一个只能用‘是’或‘否’回答的问题..."}
              className={`flex-1 bg-detective-light border ${isGameOver ? 'border-detective-secondary' : 'border-detective-accent'} rounded-md px-4 py-3 text-detective-ink placeholder:text-detective-ink/50 focus:outline-none ${!isGameOver ? 'focus:ring-2 focus:ring-detective-accent transition-all duration-300' : ''} font-typewriter inner-vintage`}
              value={inputValue}
              onChange={(e) => !isGameOver && setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isGameOver}
            />
            <button
              className={`py-3 px-6 rounded-md transition-all duration-300 shadow-vintage ${isGameOver ? 'bg-detective-secondary text-detective-ink/50 cursor-not-allowed' : 'bg-detective-accent hover:bg-detective-red text-detective-light font-bold hover:shadow-vintage-hover transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm'}`}
              onClick={handleSendMessage}
              disabled={isGameOver}
            >
              提问
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button 
              className={`px-4 py-2 rounded-md border transition-all duration-300 shadow-vintage ${isGameOver ? 'bg-detective-secondary text-detective-ink/50 border-detective-secondary cursor-not-allowed' : 'bg-detective-light text-detective-accent hover:bg-detective-secondary border-detective-accent transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm'}`}
              onClick={onRequestHint}
              disabled={isGameOver}
            >
              寻求线索
            </button>
            <button 
              className={`px-4 py-2 rounded-md border transition-all duration-300 shadow-vintage ${isGameOver ? 'bg-detective-secondary text-detective-ink/50 border-detective-secondary cursor-not-allowed' : 'bg-detective-light text-detective-accent hover:bg-detective-secondary border-detective-accent transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm'}`}
              onClick={onRevealAnswer}
              disabled={isGameOver}
            >
              揭晓真相
            </button>
            <button 
              className={`px-4 py-2 rounded-md border transition-all duration-300 shadow-vintage ${isGameOver ? 'bg-detective-secondary text-detective-ink/50 border-detective-secondary cursor-not-allowed' : 'bg-detective-light text-detective-accent hover:bg-detective-secondary border-detective-accent transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm'}`}
              onClick={onEndGame}
              disabled={isGameOver}
            >
              结束调查
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;