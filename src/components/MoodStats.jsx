import './MoodStats.css'

function MoodStats({ diaries, enlistDate }) {
  // 計算已服役天數
  const getDaysSinceEnlist = () => {
    if (!enlistDate) return null

    const enlist = new Date(enlistDate)
    enlist.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = today - enlist
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return diffDays >= 0 ? diffDays + 1 : 0
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

  const moodNames = {
    happy: '開心',
    sad: '難過',
    irritated: '煩躁',
    crying: '想哭',
    neutral: '普通',
    angry: '生氣',
    tired: '疲憊'
  }

  // 統計每種心情的數量
  const moodCounts = {}
  diaries.forEach(diary => {
    if (diary.mood) {
      moodCounts[diary.mood] = (moodCounts[diary.mood] || 0) + 1
    }
  })

  // 找出最常見的心情
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
    moodCounts[a] > moodCounts[b] ? a : b
  , Object.keys(moodCounts)[0])

  // 計算百分比
  const totalDiaries = diaries.length
  const getMoodPercentage = (mood) => {
    if (totalDiaries === 0) return 0
    return ((moodCounts[mood] || 0) / totalDiaries * 100).toFixed(1)
  }

  return (
    <div className="mood-stats-container">
      <h3 className="stats-title">心情統計</h3>

      <div className="stats-summary">
        {enlistDate && getDaysSinceEnlist() !== null && (
          <div className="summary-item">
            <span className="summary-label">已服役天數</span>
            <span className="summary-value">{getDaysSinceEnlist()} 天</span>
          </div>
        )}
        <div className="summary-item">
          <span className="summary-label">總日記數</span>
          <span className="summary-value">{totalDiaries}</span>
        </div>
        {mostCommonMood && (
          <div className="summary-item">
            <span className="summary-label">最常心情</span>
            <span className="summary-value">
              {moodEmojis[mostCommonMood]} {moodNames[mostCommonMood]}
            </span>
          </div>
        )}
      </div>

      <div className="mood-breakdown">
        {Object.keys(moodEmojis).map(mood => {
          const count = moodCounts[mood] || 0
          const percentage = getMoodPercentage(mood)

          if (count === 0) return null

          return (
            <div key={mood} className="mood-item">
              <div className="mood-header">
                <span className="mood-emoji">{moodEmojis[mood]}</span>
                <span className="mood-name">{moodNames[mood]}</span>
                <span className="mood-count">{count} 次</span>
              </div>
              <div className="mood-bar-container">
                <div
                  className="mood-bar"
                  style={{ width: `${percentage}%` }}
                  data-mood={mood}
                ></div>
              </div>
              <div className="mood-percentage">{percentage}%</div>
            </div>
          )
        })}
      </div>

      {totalDiaries === 0 && (
        <div className="no-data">
          <p>還沒有日記記錄</p>
          <p className="no-data-hint">開始記錄你的心情吧！</p>
        </div>
      )}
    </div>
  )
}

export default MoodStats
