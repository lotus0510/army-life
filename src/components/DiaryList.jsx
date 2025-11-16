import { useState } from 'react'
import './DiaryList.css'

const MOODS = [
  { emoji: '😊', label: '開心', value: 'happy' },
  { emoji: '😢', label: '難過', value: 'sad' },
  { emoji: '😤', label: '煩躁', value: 'irritated' },
  { emoji: '😭', label: '想哭', value: 'crying' },
  { emoji: '😐', label: '普通', value: 'neutral' },
  { emoji: '😡', label: '生氣', value: 'angry' },
  { emoji: '😫', label: '疲憊', value: 'tired' },
]

function DiaryList({ diaries, deleteDiary, onEditDiary }) {
  const [expandedId, setExpandedId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMoodEmoji = (moodValue) => {
    return MOODS.find(m => m.value === moodValue)?.emoji || '😊'
  }

  const handleDelete = (diaryId) => {
    deleteDiary(diaryId)
    setShowDeleteConfirm(null)
    setExpandedId(null)
  }

  const toggleExpand = (diaryId) => {
    if (expandedId === diaryId) {
      setExpandedId(null)
      setShowDeleteConfirm(null)
    } else {
      setExpandedId(diaryId)
      setShowDeleteConfirm(null)
    }
  }

  return (
    <div className="container diary-list">
      <h2>我的日記</h2>
      {diaries.length === 0 ? (
        <p className="empty-message">還沒有日記記錄，開始寫下你的第一篇吧！</p>
      ) : (
        <div className="diaries">
          {diaries.map((diary) => (
            <div key={diary.id} className={`diary-item ${expandedId === diary.id ? 'expanded' : 'collapsed'}`}>
              <div className="diary-header" onClick={() => toggleExpand(diary.id)}>
                <div className="diary-title-row">
                  {diary.mood && <span className="diary-mood">{getMoodEmoji(diary.mood)}</span>}
                  <h3>{diary.title}</h3>
                </div>
                <span className="diary-date-inline">{formatDate(diary.date)}</span>
                <button
                  type="button"
                  className="expand-toggle"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpand(diary.id)
                  }}
                >
                  {expandedId === diary.id ? '▲' : '▼'}
                </button>
              </div>

              {expandedId === diary.id && (
                <>
                  {diary.tags && diary.tags.length > 0 && (
                    <div className="diary-tags">
                      {diary.tags.map((tag, index) => (
                        <span key={index} className="diary-tag">
                          🏷️ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="diary-content">{diary.content}</p>
                  <div className="diary-actions">
                    {showDeleteConfirm === diary.id ? (
                      <div className="delete-confirm">
                        <p>確定要刪除這篇日記嗎？</p>
                        <div className="confirm-buttons">
                          <button
                            onClick={() => handleDelete(diary.id)}
                            className="confirm-delete-btn"
                          >
                            確定刪除
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="cancel-delete-btn"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          onClick={() => onEditDiary(diary)}
                          className="edit-btn"
                        >
                          ✏️ 編輯日記
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(diary.id)}
                          className="delete-btn"
                        >
                          🗑️ 刪除日記
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiaryList
