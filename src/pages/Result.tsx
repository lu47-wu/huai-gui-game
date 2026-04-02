import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Message, Story } from '../types'
import ChatBubble from '../components/game/ChatBubble'

const Result: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [story, setStory] = useState<Story | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [displayedBottom, setDisplayedBottom] = useState('')
  const [_typingIndex, setTypingIndex] = useState(0)
  const typingRef = useRef<number | null>(null)

  useEffect(() => {
    // 从location state中获取数据
    if (location.state) {
      setStory(location.state.story)
      setMessages(location.state.messages || [])
      // 重置打字状态
      setDisplayedBottom('')
      setTypingIndex(0)
    }

    // 动画效果：延迟显示内容
    const timer1 = setTimeout(() => setShowContent(true), 500)
    const timer2 = setTimeout(() => setShowButton(true), 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [location.state])

  // 打字机效果和声音
  useEffect(() => {
    if (story && story.bottom && showContent) {
      // 清除之前的定时器
      if (typingRef.current) {
        clearInterval(typingRef.current)
      }

      // 重置打字状态
      setDisplayedBottom('')
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
          if (prevIndex < story.bottom.length) {
            setDisplayedBottom(prevBottom => prevBottom + story.bottom[prevIndex])
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
      }, 150) // 调整打字速度（比原来慢三倍）
    }

    // 清理函数
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current)
      }
    }
  }, [story, showContent])

  const handlePlayAgain = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-detective-darkTexture text-detective-paper p-4 flex items-center justify-center font-typewriter bg-detective-bg">
      <div className="max-w-4xl mx-auto w-full relative">
        {/* 品牌图形符号：神秘符号 */}
        <div className="absolute top-4 right-4 text-detective-secondary/70">
          <div className="w-12 h-12 rounded-full border-2 border-detective-accent flex items-center justify-center">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 border-2 border-detective-accent rounded-full"></div>
              <div className="absolute inset-2 border-2 border-detective-accent rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-detective-accent rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-detective-paper">真相揭晓</h1>
        </div>

        {/* 故事标题 */}
        {story != null && (
          <div className={`mb-8 transform transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-serif font-bold text-center text-detective-accent">{story.title}</h2>
          </div>
        )}

        {/* 汤底 */}
        {story != null && (
          <div className={`mb-12 p-8 bg-detective-paperDark rounded-md border-2 border-detective-secondary shadow-vintage inner-vintage transform transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-xl font-serif font-bold mb-4 text-detective-accent border-b-2 border-detective-secondary pb-2">汤底</h3>
            <p className="text-lg leading-relaxed whitespace-pre-line font-typewriter text-detective-ink">{displayedBottom}</p>
          </div>
        )}

        {/* 对话历史（可选） */}
        {messages.length > 0 && (
          <div className={`mb-12 transform transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl font-serif font-bold mb-4 text-detective-paper border-b-2 border-detective-accent pb-2">调查记录</h3>
            <div className="max-h-[400px] overflow-y-auto space-y-4 p-6 bg-detective-paperDark rounded-md border-2 border-detective-secondary shadow-vintage inner-vintage">
              {messages.map(message => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </div>
          </div>
        )}

        {/* 再来一局按钮 */}
        <div className={`text-center transform transition-all duration-1000 delay-700 ${showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <button 
            className="bg-detective-accent hover:bg-detective-red text-detective-light font-bold py-4 px-8 rounded-md transition-all shadow-vintage hover:shadow-vintage-hover text-lg transform hover:translate-x-1 hover:translate-y-1"
            onClick={handlePlayAgain}
          >
            开始新的调查
          </button>
        </div>
      </div>
    </div>
  )
}

export default Result