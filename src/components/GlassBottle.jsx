import { useState, useEffect } from 'react'
import './GlassBottle.css'

function GlassBottle({ diaries }) {
  const [floatingEmojis, setFloatingEmojis] = useState([])

  useEffect(() => {
    if (!diaries || diaries.length === 0) {
      console.log('沒有日記資料')
      return
    }

    console.log('日記數量:', diaries.length)
    console.log('日記資料:', diaries)

    // 從最近的日記中取得心情 emoji
    const emojis = diaries.slice(0, 15).map((diary, index) => {
      const moodEmojis = {
        happy: '😊',
        sad: '😢',
        irritated: '😤',
        crying: '😭',
        neutral: '😐',
        angry: '😡',
        tired: '😫'
      }

      return {
        id: diary.id || index,
        emoji: moodEmojis[diary.mood] || '😊',
        // 隨機位置
        left: Math.random() * 60 + 20, // 20-80%
        top: Math.random() * 60 + 20,  // 20-80%
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 1,
        size: 0.8 + Math.random() * 0.4
      }
    })

    console.log('生成的 emoji 數據:', emojis)
    setFloatingEmojis(emojis)
  }, [diaries])

  return (
    <div className="glass-bottle-container">
      <h3 className="bottle-title">心情瓶</h3>
      <div className="glass-bottle-wrapper">
        <div className="bottle-content">
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="floating-emoji"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
                fontSize: `${item.size}rem`
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>
        <img
          src="/img/glass.png"
          alt="玻璃瓶"
          className="glass-bottle-image"
        />
      </div>
      <p className="bottle-info">
        已收集 {diaries?.length || 0} 個心情
      </p>
    </div>
  )
}

export default GlassBottle
