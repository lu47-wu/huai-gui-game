import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GameCard from '../components/game/GameCard'
import stories from '../data/stories'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 加载Playfair Display字体作为Blackadder ITC的替代
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  const today = new Date().toISOString().split('T')[0]
  const featuredStory = stories.find(story => story.title === '双胞胎的证词') || stories.find(story => story.featuredDate === today)
  const secondaryStory = stories.find(story => story.title !== '双胞胎的证词' && story.featuredDate === today) || stories.find(story => story.title !== '双胞胎的证词')
  const regularStories = stories.filter(story => story.title !== '双胞胎的证词' && story.title !== secondaryStory?.title)
  
  const handleFeaturedStoryClick = (storyId: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/game/${storyId}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-detective-darkTexture text-detective-paper p-8 font-typewriter bg-detective-bg">
      <div className="max-w-6xl mx-auto">
        <header className="py-12 mb-12 relative">

          <div className="flex flex-col items-center">
            {/* 核心徽章图标 */}
            <div className="w-64 h-64 mb-8 flex items-center justify-center animate-float group">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-detective-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=detective%20badge%20with%20complex%20decorative%20patterns%20on%20the%20outer%20ring%2C%20turtle%20and%20soup%20spoon%20in%20the%20center%2C%20red%20ribbon%20at%20the%20bottom%20with%20white%20capital%20letters%20'RIDDLE%20SOUP'%2C%20warm%20colors%20brown%20beige%20dark%20red%2C%20vintage%20style%2C%20mysterious%2C%20old%20detective%20club%20seal%2C%20with%20small%20text%20below%20the%20badge%3A%20'yishor%20wrote'%20and%20'Bowl%20of%20Soup'%2C%20off-white%20beige%20background%20matching%20vintage%20paper%2C%20clean%20composition%2C%20clear%20text&image_size=square_hd" 
                  alt="Riddle Soup" 
                  className="w-full h-full object-contain relative z-10" 
                />
              </div>
            </div>
            <p className="text-detective-secondary text-center text-xl mb-8 italic animate-float" style={{ fontFamily: 'Playfair Display, serif', animationDelay: '0.2s' }}>Unravel mysteries with logic, enjoy the pleasure of deduction</p>
          </div>
          
          {/* 渐变遮罩，让木纹背景柔和过渡到内容区 */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-detective-darkTexture pointer-events-none"></div>
        </header>
        
        {featuredStory && (
          <section className="mb-16">
            {/* 装饰性分割线 */}
            <div 
              className="w-full my-8" 
              style={{ 
                height: '24px', 
                backgroundImage: 'url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=horizontal%20decorative%20divider%20line%20with%20vintage%20ornate%20scrollwork%20and%20vine%20patterns%2C%20yellowish%20off-white%20color%20%23f7e9c6%2C%20symmetrical%20design%2C%20repeating%20patterns%2C%20metal%20etching%20texture%2C%20width%20800px%2C%20height%2024px%2C%20completely%20transparent%20background%2C%20detective%20theme%2C%20elegant%20complex%20patterns%20similar%20to%20badge%20border&image_size=landscape_4_3)', 
                backgroundRepeat: 'repeat-x', 
                backgroundSize: 'auto 100%', 
                backgroundPosition: 'center', 
              }} 
            />

            <div className="flex items-center mb-8 border-b-2 border-detective-accent pb-4">
              <h2 className="text-3xl font-serif font-bold text-detective-paper">每日精选</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 左侧主卡片 - 双胞胎的证词 */}
              <div className="col-span-1 md:col-span-2">
                <div 
                  onClick={() => handleFeaturedStoryClick(featuredStory.id)}
                  className={`cursor-pointer bg-detective-paperDark border-2 border-detective-accent p-10 rounded-md shadow-vintage inner-vintage hover:scale-[1.02] transition-all relative overflow-hidden group ${isAnimating ? 'animate-page-turn' : ''}`}
                >
                  {/* 台灯照亮效果 */}
                  <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-detective-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <h3 className="text-2xl font-serif font-bold text-detective-ink mb-6 relative z-10">{featuredStory.title}</h3>
                  {/* 引述式短句 */}
                  <div className="mb-6 relative z-10">
                    <div className="text-4xl text-detective-accent/50 absolute -top-2 -left-2">"</div>
                    <p className="text-detective-ink italic font-typewriter pl-4 border-l-2 border-detective-accent/30">
                      {featuredStory.surface.split('。')[0]}。
                    </p>
                    <div className="text-4xl text-detective-accent/50 absolute -bottom-4 -right-2">"</div>
                  </div>
                  <p className="text-detective-ink mb-8 text-sm font-typewriter relative z-10">{featuredStory.summary}</p>
                  <div className="flex items-center mb-8 relative z-10">
                    <div className="flex items-center">
                      <span className="text-xs mr-2 font-typewriter text-detective-ink">汤的浓度:</span>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full ${i < (featuredStory.difficulty === 'easy' ? 1 : featuredStory.difficulty === 'medium' ? 2 : 3) ? 'bg-hint' : 'bg-detective-secondary/50'} mx-0.5 relative`}
                        >
                          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${i < (featuredStory.difficulty === 'easy' ? 1 : featuredStory.difficulty === 'medium' ? 2 : 3) ? 'bg-hint/50' : 'bg-detective-secondary/30'}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8 relative z-10">
                    {featuredStory.tags.map((tag, index) => (
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
                  <div className="inline-block bg-detective-accent hover:bg-detective-red text-detective-light font-bold py-3 px-6 rounded-md transition-all shadow-vintage hover:shadow-vintage-hover transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm relative z-10">
                    勘察现场
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
              </div>
              
              {/* 右侧小卡片 - 另一个推荐故事 */}
              {secondaryStory && (
                <div className="col-span-1">
                  <div 
                    onClick={() => handleFeaturedStoryClick(secondaryStory.id)}
                    className={`cursor-pointer bg-detective-paperDark border-2 border-detective-secondary hover:border-detective-accent p-6 rounded-md shadow-vintage inner-vintage hover:scale-[1.02] transition-all relative overflow-hidden group ${isAnimating ? 'animate-page-turn' : ''}`}
                  >
                    {/* 台灯照亮效果 */}
                    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-detective-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <h3 className="text-xl font-serif font-bold text-detective-ink mb-4 relative z-10">{secondaryStory.title}</h3>
                    <p className="text-detective-ink mb-6 text-sm font-typewriter relative z-10 line-clamp-3">{secondaryStory.summary}</p>
                    
                    <div className="flex items-center mb-6 relative z-10">
                      <div className="flex items-center">
                        <span className="text-xs mr-2 font-typewriter text-detective-ink">汤的浓度:</span>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${i < (secondaryStory.difficulty === 'easy' ? 1 : secondaryStory.difficulty === 'medium' ? 2 : 3) ? 'bg-hint' : 'bg-detective-secondary/50'} mx-0.5 relative`}
                          >
                            <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${i < (secondaryStory.difficulty === 'easy' ? 1 : secondaryStory.difficulty === 'medium' ? 2 : 3) ? 'bg-hint/50' : 'bg-detective-secondary/30'}`}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                      {secondaryStory.tags.map((tag, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -top-0.5 -left-0.5 w-full h-full border border-detective-secondary/50 rounded-md transform rotate-1"></div>
                          <span className="relative px-2 py-1 rounded-md bg-detective-secondary/30 text-detective-accent text-xs font-typewriter inline-block border border-detective-secondary/80 shadow-sm">
                            <span className="absolute top-0 left-1 w-1 h-1 bg-detective-secondary/50 rounded-full"></span>
                            <span className="absolute top-0 right-1 w-1 h-1 bg-detective-secondary/50 rounded-full"></span>
                            {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="inline-block bg-detective-accent hover:bg-detective-red text-detective-light font-bold py-2 px-4 rounded-md transition-all shadow-vintage hover:shadow-vintage-hover transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm relative z-10 text-sm">
                      勘察现场
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
                </div>
              )}
            </div>
          </section>
        )}
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-8 text-detective-paper border-b-2 border-detective-accent pb-4">全部故事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularStories.map(story => (
              <GameCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home