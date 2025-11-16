import { useState, useEffect } from 'react'
import './Calendar.css'

function Calendar({ enlistDate, serviceDuration = 365, diaries, onOpenSettings, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateClick = (date) => {
    if (!date) return
    setSelectedDate(date)
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDaysArray = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const days = []
    const totalDays = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)

    // 填充空白日期（上個月的日期）
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // 填充當月日期
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const isEnlistDate = (date) => {
    if (!date || !enlistDate) return false
    const enlist = new Date(enlistDate)
    return date.getDate() === enlist.getDate() &&
           date.getMonth() === enlist.getMonth() &&
           date.getFullYear() === enlist.getFullYear()
  }

  const isSelected = (date) => {
    if (!date) return false
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  const getDaysSinceEnlist = (date) => {
    if (!date || !enlistDate) return null

    // 正規化日期到午夜（移除時間部分）
    const enlist = new Date(enlistDate)
    enlist.setHours(0, 0, 0, 0)

    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)

    const diffTime = compareDate - enlist
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // 入伍當天返回 0，入伍前返回 null
    return diffDays >= 0 ? diffDays : null
  }

  const getRemainingDays = () => {
    if (!enlistDate) return null

    const daysSince = getDaysSinceEnlist(new Date())

    if (daysSince === null) return null

    const remaining = serviceDuration - (daysSince + 1)
    return remaining > 0 ? remaining : 0
  }

  const hasDiary = (date) => {
    if (!date || !diaries) return false

    // 正規化為本地時間的年月日
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return diaries.some(diary => {
      const diaryDate = new Date(diary.date)
      return diaryDate.getFullYear() === year &&
             diaryDate.getMonth() === month &&
             diaryDate.getDate() === day
    })
  }

  const getDiaryMood = (date) => {
    if (!date || !diaries) return null

    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    const diary = diaries.find(diary => {
      const diaryDate = new Date(diary.date)
      return diaryDate.getFullYear() === year &&
             diaryDate.getMonth() === month &&
             diaryDate.getDate() === day
    })

    return diary ? diary.mood : null
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月']
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="container calendar-container">
      <div className="calendar-header-controls">
        <button onClick={prevMonth} className="nav-btn">‹</button>
        <div className="calendar-title">
          <h2>{currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}</h2>
          <button onClick={goToToday} className="today-btn">📍 今天</button>
        </div>
        <button onClick={nextMonth} className="nav-btn">›</button>
      </div>

      {enlistDate ? (
        <div className="calendar-info">
          <div className="info-items">
            <div className="info-item">
              <span className="info-icon">🎖️</span>
              <span>入伍日期: {new Date(enlistDate).toLocaleDateString('zh-TW')}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span>已服役: {getDaysSinceEnlist(new Date()) !== null ? getDaysSinceEnlist(new Date()) + 1 : 0} 天</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏳</span>
              <span>剩餘: {getRemainingDays()} 天</span>
            </div>
          </div>
          <button onClick={onOpenSettings} className="settings-btn">
            ⚙️ 設定
          </button>
        </div>
      ) : (
        <div className="calendar-info no-enlist">
          <p>尚未設定入伍日期</p>
          <button onClick={onOpenSettings} className="settings-btn-large">
            ⚙️ 設定入伍日期
          </button>
        </div>
      )}

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}

        {getDaysArray().map((date, index) => {
          const daysSince = date ? getDaysSinceEnlist(date) : null
          const mood = date ? getDiaryMood(date) : null

          return (
            <div
              key={index}
              className={`calendar-day ${!date ? 'empty' : ''}
                         ${isToday(date) ? 'today' : ''}
                         ${isEnlistDate(date) ? 'enlist-day' : ''}
                         ${isSelected(date) ? 'selected' : ''}
                         ${daysSince !== null ? 'service-day' : ''}
                         ${hasDiary(date) ? 'has-diary' : ''}
                         ${mood ? `mood-${mood}` : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date && (
                <>
                  <div className="day-number">{date.getDate()}</div>
                  {isToday(date) && <div className="day-badge today-badge">今</div>}
                  {isEnlistDate(date) && <div className="day-badge enlist-badge">入伍</div>}
                  {daysSince !== null && daysSince > 0 && (
                    <div className="day-count">D+{daysSince}</div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <div className="selected-date-info">
          <h3>選擇的日期</h3>
          <p className="selected-date-text">
            {selectedDate.toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
          {getDaysSinceEnlist(selectedDate) !== null && (
            <p className="service-info">
              服役第 {getDaysSinceEnlist(selectedDate) + 1} 天
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Calendar
