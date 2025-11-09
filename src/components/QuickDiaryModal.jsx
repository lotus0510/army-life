import { useState, useEffect } from 'react'
import './QuickDiaryModal.css'

const MOODS = [
  { emoji: '😊', label: '開心', value: 'happy' },
  { emoji: '😢', label: '難過', value: 'sad' },
  { emoji: '😤', label: '煩躁', value: 'irritated' },
  { emoji: '😭', label: '想哭', value: 'crying' },
  { emoji: '😐', label: '普通', value: 'neutral' },
  { emoji: '😡', label: '生氣', value: 'angry' },
  { emoji: '😫', label: '疲憊', value: 'tired' },
]

function QuickDiaryModal({ selectedDate, onClose, addDiary, existingDiary }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')

  useEffect(() => {
    if (existingDiary) {
      setTitle(existingDiary.title)
      setContent(existingDiary.content)
      setMood(existingDiary.mood)
    }
  }, [existingDiary])

  const formatDate = () => {
    if (!selectedDate) return ''
    const date = new Date(selectedDate)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !mood) return

    const newDiary = {
      id: existingDiary?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      mood: mood,
      date: selectedDate.toISOString(),
    }

    addDiary(newDiary)
    onClose()
  }

  const handleOverlayClick = () => {
    onClose()
  }

  return (
    <div className="quick-modal-overlay" onClick={handleOverlayClick}>
      <div className="quick-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quick-modal-header">
          <h2>{existingDiary ? '編輯日記' : '快速寫日記'}</h2>
          <p className="quick-modal-date">{formatDate()}</p>
          <button onClick={onClose} className="close-modal-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="quick-diary-form">
          <div className="mood-selector">
            <label>心情：</label>
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
            autoFocus
          />

          <textarea
            placeholder="寫下今天發生的事情..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="8"
          />

          <div className="quick-modal-buttons">
            <button type="submit" className="submit-btn">
              {existingDiary ? '更新' : '發布'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickDiaryModal
