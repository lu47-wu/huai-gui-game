import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Message, Story } from '../types'
import ChatBox from '../components/game/ChatBox'
import stories from '../data/stories'
import { askAI, requestHint } from '../lib/api/game'

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStory, setCurrentStory] = useState<Story | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [displayedSurface, setDisplayedSurface] = useState('')
  const [typingIndex, setTypingIndex] = useState(0)
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (id) {
      const story = stories.find(story => story.id === id)
      if (story) {
        setCurrentStory(story)
        // 重置打字状态
        setDisplayedSurface('')
        setTypingIndex(0)
        // 初始化空消息列表
        setMessages([])
      }
    }
  }, [id])

  // 打字机效果和声音
  useEffect(() => {
    if (currentStory && currentStory.surface) {
      // 清除之前的定时器
      if (typingRef.current) {
        clearInterval(typingRef.current)
      }

      // 重置打字状态
      setDisplayedSurface('')
      setTypingIndex(0)

      // 创建音频上下文（只创建一次）
      let audioContext: AudioContext | null = null
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.error('无法创建音频上下文:', error)
      }

      // 创建打字机声音
      const playTypeSound = () => {
        if (!audioContext) return

        try {
          // 恢复音频上下文（如果被暂停）
          if (audioContext.state === 'suspended') {
            audioContext.resume()
          }

          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          // 使用更适合打字机的声音参数
          oscillator.type = 'sine' // 使用正弦波，更柔和
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime) // 降低频率，更像打字机
          oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1) // 延长声音持续时间

          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime) // 进一步降低音量
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1) // 延长声音持续时间，更像打字机
        } catch (error) {
          console.error('播放声音失败:', error)
        }
      }

      // 开始打字动画
      let charCount = 0
      typingRef.current = setInterval(() => {
        setTypingIndex(prevIndex => {
          if (prevIndex < currentStory.surface.length) {
            setDisplayedSurface(prevSurface => prevSurface + currentStory.surface[prevIndex])
            charCount++
            // 每三个字播放一次声音
            if (charCount % 3 === 0) {
              playTypeSound()
            }
            return prevIndex + 1
          } else {
            // 打字完成，清除定时器
            if (typingRef.current) {
              clearInterval(typingRef.current)
            }
            // 关闭音频上下文
            if (audioContext) {
              audioContext.close()
            }
            return prevIndex
          }
        })
      }, 50) // 调整打字速度
    }

    // 清理函数
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current)
      }
    }
  }, [currentStory])

  const handleSendMessage = async (content: string) => {
    if (content.trim() === '' || !currentStory) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      setError(null)
      // 调用AI API获取回复
      const aiResponse = await askAI(content, currentStory, messages)
      
      // 添加AI消息
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now() + 1000
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      // 错误处理：添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答，请稍后再试。',
        timestamp: Date.now() + 1000
      }
      setMessages(prev => [...prev, errorMessage])
      setError('发送消息失败，请稍后再试')
      // 3秒后清除错误信息
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsPivotal = (messageId: string) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, isPivotal: !message.isPivotal }
        : message
    ))
  }

  const handleRequestHint = async () => {
    if (!currentStory) return

    setIsLoading(true)

    try {
      // 调用AI API获取提示
      const hint = await requestHint(currentStory, messages)
      
      // 添加提示消息
      const hintMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: hint,
        timestamp: Date.now() + 2000
      }
      setMessages(prev => [...prev, hintMessage])
    } catch (error) {
      console.error('Error requesting hint:', error)
      // 错误处理：添加默认提示
      const defaultHintMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '注意故事中的关键细节',
        timestamp: Date.now() + 2000
      }
      setMessages(prev => [...prev, defaultHintMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevealAnswer = () => {
    setIsGameOver(true)
    navigate('/result', { state: { story: currentStory, messages } })
  }

  const handleEndGame = () => {
    setIsGameOver(true)
    navigate('/')
  }

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-detective-darkTexture text-detective-paper flex items-center justify-center bg-dark-texture">
        <div className="text-center">
          <p className="text-xl font-typewriter">故事不存在</p>
          <button 
            className="mt-4 inline-block bg-detective-accent hover:bg-detective-red text-detective-light font-bold py-3 px-6 rounded-md shadow-vintage hover:shadow-vintage-hover transition-all duration-300 transform hover:translate-x-1 hover:translate-y-1 active:scale-95 active:shadow-sm"
            onClick={() => navigate('/')}
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-detective-darkTexture text-detective-paper p-4 font-typewriter bg-detective-bg">
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 z-10 bg-detective-darkTexture/95 backdrop-blur-sm border-b border-detective-accent/30 py-6 px-8 shadow-lg">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-serif font-bold text-detective-paper mb-2">{currentStory.title}</h1>
            {/* 品牌图形符号：福尔摩斯的烟斗 */}
            <div className="text-detective-secondary/70">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-8 h-8 fill-detective-accent stroke-detective-accent stroke-2">
                  {/* 烟斗碗 */}
                  <path d="M30,60 C30,50 40,45 50,45 C60,45 70,50 70,60 C70,70 60,75 50,75 C40,75 30,70 30,60 Z" />
                  {/* 烟斗碗纹理 */}
                  <path d="M50,45 L50,75" />
                  <path d="M40,50 L60,50" />
                  <path d="M40,60 L60,60" />
                  <path d="M40,70 L60,70" />
                  {/* 烟斗柄 */}
                  <path d="M70,60 L85,60 L90,55 L85,50 L70,50 Z" />
                  {/* 烟斗嘴 */}
                  <path d="M90,55 L95,55 L95,50 L90,50 Z" />
                  {/* 烟雾 */}
                  <circle cx="50" cy="35" r="5" fill="#8b5cf6" opacity="0.7" />
                  <circle cx="45" cy="25" r="4" fill="#8b5cf6" opacity="0.5" />
                  <circle cx="55" cy="20" r="3" fill="#8b5cf6" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-detective-paperDark border-2 border-detective-secondary p-4 rounded-md shadow-vintage inner-vintage">
            <p className="text-detective-ink font-typewriter leading-relaxed">{displayedSurface}</p>
          </div>
          {error && (
            <div className="mt-4 bg-detective-red/20 border border-detective-red/50 text-detective-red py-2 px-4 rounded-md text-sm animate-fadeIn">
              {error}
            </div>
          )}
        </div>
        
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          onMarkAsPivotal={handleMarkAsPivotal}
          onRequestHint={handleRequestHint}
          onRevealAnswer={handleRevealAnswer}
          onEndGame={handleEndGame}
          isLoading={isLoading}
          isGameOver={isGameOver}
        />
      </div>
    </div>
  )
}

export default Game