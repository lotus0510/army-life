import { useState, useEffect } from 'react'
import './QuickDiaryModal.css'

const MOODS = [
  { emoji: '😊', label: '開心', value: 'happy' },
  { emoji: '😤', label: '煩躁', value: 'irritated' },
  { emoji: '😭', label: '想哭', value: 'crying' },
  { emoji: '😐', label: '普通', value: 'neutral' },
  { emoji: '😡', label: '生氣', value: 'angry' },
  { emoji: '😫', label: '疲憊', value: 'tired' },
]

function QuickDiaryModal({ selectedDate, onClose, addDiary, updateDiary, existingDiary }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (existingDiary) {
      setTitle(existingDiary.title)
      setContent(existingDiary.content)
      setMood(existingDiary.mood)
      setTags(existingDiary.tags || [])
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

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!mood) {
      alert('請選擇今天的心情！')
      return
    }

    if (!title.trim() || !content.trim()) return

    const diaryData = {
      id: existingDiary?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      mood: mood,
      tags: tags,
      date: selectedDate.toISOString(),
    }

    try {
      if (existingDiary && updateDiary) {
        // 編輯模式：更新現有日記
        await updateDiary(existingDiary.id, diaryData)
      } else {
        // 新增模式：新增日記
        await addDiary(diaryData)
      }
      onClose()
    } catch (error) {
      alert('操作失敗，請稍後再試')
    }
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
            <label>心情：<span className="required-mark">*</span></label>
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

          <div className="tag-input-section">
            <label>標籤：</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="輸入標籤後按 Enter"
              />
              <button type="button" onClick={handleAddTag} className="add-tag-btn">
                + 添加
              </button>
            </div>
            {tags.length > 0 && (
              <div className="tags-display">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

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
