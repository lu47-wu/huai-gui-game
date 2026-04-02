import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '../../types';

interface GameCardProps {
  story: Story;
}

const GameCard: React.FC<GameCardProps> = ({ story }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const renderDifficultySoup = (difficulty: 'easy' | 'medium' | 'hard') => {
    const soupDrops = [];
    let count = 0;
    
    switch (difficulty) {
      case 'easy':
        count = 1;
        break;
      case 'medium':
        count = 2;
        break;
      case 'hard':
        count = 3;
        break;
    }
    
    for (let i = 0; i < 3; i++) {
      soupDrops.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-full ${i < count ? 'bg-hint' : 'bg-detective-secondary/50'} mx-0.5 relative`}
        >
          {/* 汤滴效果 */}
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${i < count ? 'bg-hint/50' : 'bg-detective-secondary/30'}`}></div>
        </div>
      );
    }
    
    return soupDrops;
  };

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/game/${story.id}`);
    }, 800);
  };

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer bg-detective-paperDark rounded-md p-8 border-2 border-detective-secondary hover:border-detective-accent transition-all hover:scale-[1.02] hover:shadow-vintage-hover relative overflow-hidden shadow-vintage inner-vintage group ${isAnimating ? 'animate-page-turn' : ''}`}
    >
      {/* 台灯照亮效果 */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-detective-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {story.featuredDate && (
        <div className="absolute top-0 right-0 bg-detective-accent text-detective-light text-xs font-bold px-3 py-1 rounded-bl-md shadow-vintage">
          今日推荐
        </div>
      )}
      
      <h3 className="text-xl font-serif font-bold text-detective-ink mb-4 relative z-10">{story.title}</h3>
      <p className="text-detective-ink mb-6 text-sm font-typewriter relative z-10">{story.summary}</p>
      
      <div className="flex items-center mb-6 relative z-10">
        <div className={`flex items-center ${story.difficulty === 'hard' ? 'text-detective-red' : 'text-detective-accent'}`}>
          <span className="text-xs mr-2 font-typewriter text-detective-ink">汤的浓度:</span>
          {renderDifficultySoup(story.difficulty)}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6 relative z-10">
        {story.tags.map((tag, index) => (
          <div key={index} className="relative">
            <div className="absolute -top-0.5 -left-0.5 w-full h-full border border-detective-secondary/50 rounded-md transform rotate-1"></div>
            <span className="relative px-3 py-1 rounded-md bg-detective-secondary/30 text-detective-accent text-xs font-typewriter inline-block border border-detective-secondary/80 shadow-sm">
              <span className="absolute top-0 left-1 w-1 h-1 bg-detective-secondary/50 rounded-full"></span>
              <span className="absolute top-0 right-1 w-1 h-1 bg-detective-secondary/50 rounded-full"></span>
              {tag}
            </span>
          </div>
        ))}
      </div>
      
      {/* 转场动效覆盖层 */}
      {isAnimating && (
        <div className="absolute inset-0 bg-detective-darkTexture/90 flex items-center justify-center z-20 animate-fadeIn">
          <div className="text-detective-paper font-typewriter text-lg">
            <span className="typing-animation">推理中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;