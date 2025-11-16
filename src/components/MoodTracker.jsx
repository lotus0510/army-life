import { useState } from 'react'
import './MoodTracker.css'

const MOODS = [
  { emoji: '😊', label: '開心', value: 'happy' },
  { emoji: '😤', label: '煩躁', value: 'irritated' },
  { emoji: '😭', label: '想哭', value: 'crying' },
  { emoji: '😐', label: '普通', value: 'neutral' },
  { emoji: '😡', label: '生氣', value: 'angry' },
  { emoji: '😫', label: '疲憊', value: 'tired' },
]

function MoodTracker({ moods, addMood }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedMood) return

    const newMood = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim(),
      date: new Date().toISOString(),
    }

    addMood(newMood)
    setSelectedMood(null)
    setNote('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMoodEmoji = (moodValue) => {
    return MOODS.find(m => m.value === moodValue)?.emoji || '😊'
  }

  return (
    <div className="container mood-tracker">
      <h2>今天心情如何？</h2>

      <form onSubmit={handleSubmit} className="mood-form">
        <div className="mood-options">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              type="button"
              className={`mood-btn ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood.value)}
              title={mood.label}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mood-note">
            <textarea
              placeholder="想說些什麼嗎？（選填）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
            />
            <button type="submit" className="submit-mood">
              記錄心情
            </button>
          </div>
        )}
      </form>

      <div className="mood-history-section">
        <button
          className="toggle-history"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? '隱藏' : '查看'}心情記錄 ({moods.length})
        </button>

        {showHistory && (
          <div className="mood-history">
            {moods.length === 0 ? (
              <p className="empty-message">還沒有心情記錄</p>
            ) : (
              moods.map((mood) => (
                <div key={mood.id} className="mood-item">
                  <span className="mood-item-emoji">{getMoodEmoji(mood.mood)}</span>
                  <div className="mood-item-content">
                    <p className="mood-item-date">{formatDate(mood.date)}</p>
                    {mood.note && <p className="mood-item-note">{mood.note}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MoodTracker
