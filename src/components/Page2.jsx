import { useState } from 'react'
import './Page2.css'

function Page2({ diaries, enlistDate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMood, setFilterMood] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  // 搜尋與篩選邏輯
  const filteredDiaries = diaries.filter(diary => {
    // 關鍵字搜尋
    const matchesSearch = diary.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diary.title?.toLowerCase().includes(searchTerm.toLowerCase())

    // 心情篩選
    const matchesMood = filterMood === 'all' || diary.mood === filterMood

    // 日期範圍篩選
    let matchesDate = true
    if (dateRange !== 'all') {
      const diaryDate = new Date(diary.date)
      const now = new Date()
      const diffDays = Math.floor((now - diaryDate) / (1000 * 60 * 60 * 24))

      if (dateRange === 'week') matchesDate = diffDays <= 7
      else if (dateRange === 'month') matchesDate = diffDays <= 30
      else if (dateRange === '3months') matchesDate = diffDays <= 90
    }

    return matchesSearch && matchesMood && matchesDate
  })

  // 計算時間範圍內的日記
  const getTimeRangeDiaries = (days) => {
    const now = new Date()
    return diaries.filter(diary => {
      const diaryDate = new Date(diary.date)
      const diffDays = Math.floor((now - diaryDate) / (1000 * 60 * 60 * 24))
      return diffDays <= days
    })
  }

  const weekDiaries = getTimeRangeDiaries(7)
  const monthDiaries = getTimeRangeDiaries(30)

  // 統計數據
  const stats = {
    total: diaries.length,
    filtered: filteredDiaries.length,
    weekCount: weekDiaries.length,
    monthCount: monthDiaries.length,
    weekAvg: (weekDiaries.length / 7).toFixed(1),
    monthAvg: (monthDiaries.length / 30).toFixed(1),
    moodCounts: {
      happy: diaries.filter(d => d.mood === 'happy').length,
      sad: diaries.filter(d => d.mood === 'sad').length,
      irritated: diaries.filter(d => d.mood === 'irritated').length,
      crying: diaries.filter(d => d.mood === 'crying').length,
      neutral: diaries.filter(d => d.mood === 'neutral').length,
      angry: diaries.filter(d => d.mood === 'angry').length,
      tired: diaries.filter(d => d.mood === 'tired').length,
    }
  }

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    irritated: '😤',
    crying: '😭',
    neutral: '😐',
    angry: '😡',
    tired: '😫'
  }

  const moodLabels = {
    happy: '開心',
    sad: '難過',
    irritated: '煩躁',
    crying: '崩潰',
    neutral: '平靜',
    angry: '憤怒',
    tired: '疲憊'
  }

  return (
    <div className="content-wrapper">
      <div className="page2-container">
        {/* 搜尋區塊 */}
        <div className="container search-section">
          <h2>🔍 搜尋日記</h2>

          <div className="search-controls">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="搜尋日記內容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>心情篩選:</label>
              <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)}>
                <option value="all">全部</option>
                {Object.entries(moodLabels).map(([key, label]) => (
                  <option key={key} value={key}>{moodEmojis[key]} {label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>日期範圍:</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="all">全部</option>
                <option value="week">最近一週</option>
                <option value="month">最近一個月</option>
                <option value="3months">最近三個月</option>
              </select>
            </div>
          </div>

          <div className="search-results-info">
            找到 <strong>{stats.filtered}</strong> 筆日記 (共 {stats.total} 筆)
          </div>
        </div>

        {/* 報表區塊 */}
        <div className="container stats-section">
          <h2>📊 統計報表</h2>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📝</div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">總日記數</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">📅</div>
              <div className="stat-number">{stats.weekCount}</div>
              <div className="stat-label">本週記錄</div>
              <div className="stat-sub">平均 {stats.weekAvg} 篇/天</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">📆</div>
              <div className="stat-number">{stats.monthCount}</div>
              <div className="stat-label">本月記錄</div>
              <div className="stat-sub">平均 {stats.monthAvg} 篇/天</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">
                {stats.total > 0 && Object.entries(stats.moodCounts)
                  .sort((a, b) => b[1] - a[1])[0] &&
                  moodEmojis[Object.entries(stats.moodCounts).sort((a, b) => b[1] - a[1])[0][0]]}
              </div>
              <div className="stat-number">
                {stats.total > 0 && Object.entries(stats.moodCounts)
                  .sort((a, b) => b[1] - a[1])[0]?.[1] || 0}
              </div>
              <div className="stat-label">最常心情</div>
            </div>
          </div>

          <div className="mood-breakdown">
            <h3>心情分布</h3>
            <div className="mood-bars">
              {Object.entries(moodLabels).map(([key, label]) => {
                const count = stats.moodCounts[key]
                const percentage = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : 0

                return (
                  <div key={key} className="mood-bar-item">
                    <div className="mood-bar-label">
                      <span>{moodEmojis[key]} {label}</span>
                      <span>{count} 次 ({percentage}%)</span>
                    </div>
                    <div className="mood-bar-track">
                      <div
                        className="mood-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 搜尋結果列表 */}
        <div className="container results-section">
          <h2>搜尋結果</h2>

          {filteredDiaries.length === 0 ? (
            <div className="empty-results">
              <p>沒有找到符合條件的日記</p>
            </div>
          ) : (
            <div className="results-list">
              {filteredDiaries.map(diary => (
                <div key={diary.id} className="result-item">
                  <div className="result-header">
                    <span className="result-mood">{moodEmojis[diary.mood]}</span>
                    <span className="result-date">
                      {new Date(diary.date).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                  <div className="result-content">
                    {diary.content || '(無內容)'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page2
