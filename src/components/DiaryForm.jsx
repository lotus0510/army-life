import { useState } from 'react'
import './DiaryForm.css'

const MOODS = [
  { emoji: '😊', label: '開心', value: 'happy' },
  { emoji: '😢', label: '難過', value: 'sad' },
  { emoji: '😤', label: '煩躁', value: 'irritated' },
  { emoji: '😭', label: '想哭', value: 'crying' },
  { emoji: '😐', label: '普通', value: 'neutral' },
  { emoji: '😡', label: '生氣', value: 'angry' },
  { emoji: '😫', label: '疲憊', value: 'tired' },
]

function DiaryForm({ addDiary, selectedDate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !mood) return

    // 使用選擇的日期，如果沒有選擇則使用今天
    const diaryDate = selectedDate || new Date()

    const newDiary = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      mood: mood,
      date: diaryDate.toISOString(),
    }

    addDiary(newDiary)
    setTitle('')
    setContent('')
    setMood('')
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return '今天'
    const date = new Date(selectedDate)
    return date.toLocaleDateString('zh-TW', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="container diary-form">
      <h2>寫日記 - {formatSelectedDate()}</h2>
      <form onSubmit={handleSubmit}>
          <div className="mood-selector">
            <label>今天心情：</label>
            <div className="mood-options">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`mood-btn ${mood === m.value ? 'selected' : ''}`}
                  onClick={() => setMood(m.value)}
                  title={m.label}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="寫下你今天發生的事情..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        <div className="form-buttons">
          <button type="submit">發布</button>
        </div>
      </form>
    </div>
  )
}

export default DiaryForm
