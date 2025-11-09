import { useState } from 'react'
import './Timeline.css'

function Timeline({ events, addEvent, deleteEvent }) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !date) return

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      date: date,
    }

    addEvent(newEvent)
    setTitle('')
    setDescription('')
    setDate('')
    setIsAdding(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container timeline">
      <h2>重要時刻</h2>

      {!isAdding ? (
        <button
          className="add-event-btn"
          onClick={() => setIsAdding(true)}
        >
          + 添加事件
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            placeholder="事件標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <textarea
            placeholder="描述（選填）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
          <div className="form-buttons">
            <button type="submit">添加</button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setTitle('')
                setDescription('')
                setDate('')
              }}
              className="cancel-btn"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {events.length === 0 ? (
        <p className="empty-message">還沒有記錄重要事件</p>
      ) : (
        <div className="timeline-events">
          {events.map((event) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="delete-btn"
                    title="刪除"
                  >
                    ×
                  </button>
                </div>
                <p className="event-date">{formatDate(event.date)}</p>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Timeline
