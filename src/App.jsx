import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useFirestore } from './hooks/useFirestore'
import Login from './components/Login'
import DaysCounter from './components/DaysCounter'
import Calendar from './components/Calendar'
import DiaryForm from './components/DiaryForm'
import DiaryList from './components/DiaryList'
import QuickDiaryModal from './components/QuickDiaryModal'
import MoodStats from './components/MoodStats'
import TabNavigation from './components/TabNavigation'
import Page2 from './components/Page2'
import './App.css'

function App() {
  const { currentUser, signInWithGoogle, signOut } = useAuth()
  const [showSettings, setShowSettings] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showQuickModal, setShowQuickModal] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // 使用 Firestore Hook 管理所有資料
  const {
    diaries,
    enlistDate,
    serviceDuration,
    loading,
    addDiary,
    deleteDiary,
    updateEnlistDate
  } = useFirestore(currentUser?.uid)

  // 計算統計數據
  const getStats = () => {
    if (!enlistDate) {
      return {
        daysSinceEnlist: 0,
        remainingDays: serviceDuration || 365,
        diaryCount: diaries.length,
        avgDiaryDays: 0
      }
    }

    const enlist = new Date(enlistDate)
    enlist.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = today - enlist
    const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const daysSinceEnlist = daysSince >= 0 ? daysSince + 1 : 0

    const remaining = serviceDuration - daysSinceEnlist
    const remainingDays = remaining > 0 ? remaining : 0

    const diaryCount = diaries.length
    const avgDiaryDays = daysSinceEnlist > 0 ? (diaryCount / daysSinceEnlist * 7).toFixed(1) : 0

    return {
      daysSinceEnlist,
      remainingDays,
      diaryCount,
      avgDiaryDays
    }
  }

  const stats = getStats()

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      const message = error.userMessage || '登入失敗，請稍後再試'
      alert(message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      alert('登出失敗，請稍後再試')
    }
  }

  // 如果用戶未登入，顯示登入頁面
  if (!currentUser) {
    return <Login onGoogleLogin={handleGoogleLogin} />
  }

  // 載入中畫面
  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>我的軍旅生活</h1>
            <p>載入中...</p>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-icon">🎖️</div>
            <h1>我的軍旅生活</h1>
          </div>
          <div className="user-section">
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="user-avatar"
            />
            <span className="user-name">{currentUser.displayName}</span>
            <button onClick={handleSignOut} className="logout-btn" title="登出">
              登出
            </button>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-label">已服役</div>
            <div className="stat-value">{stats.daysSinceEnlist} 天</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">剩餘</div>
            <div className="stat-value">{stats.remainingDays} 天</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">日記數量</div>
            <div className="stat-value">{stats.diaryCount} 篇</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">平均 (週)</div>
            <div className="stat-value">{stats.avgDiaryDays} 篇</div>
          </div>
        </div>
      </header>

      <div className="app-body">
        <div className="tab-container">
          <div className="tab-navigation-wrapper">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="content-wrapper">
            <Calendar
              enlistDate={enlistDate}
              serviceDuration={serviceDuration}
              diaries={diaries}
              onOpenSettings={() => setShowSettings(true)}
              onDateSelect={(date) => {
                setSelectedDate(date)
                setShowQuickModal(true)
              }}
            />

            {showSettings && (
              <DaysCounter
                enlistDate={enlistDate}
                serviceDuration={serviceDuration}
                setEnlistDate={async (date, duration) => {
                  await updateEnlistDate(date, duration)
                  setShowSettings(false)
                }}
                onClose={() => setShowSettings(false)}
              />
            )}

            {showQuickModal && selectedDate && (
              <QuickDiaryModal
                selectedDate={selectedDate}
                onClose={() => setShowQuickModal(false)}
                addDiary={addDiary}
                existingDiary={diaries.find(d => {
                  const dDate = new Date(d.date)
                  return dDate.getFullYear() === selectedDate.getFullYear() &&
                         dDate.getMonth() === selectedDate.getMonth() &&
                         dDate.getDate() === selectedDate.getDate()
                })}
              />
            )}

            <div className="main-content">
              <DiaryForm addDiary={addDiary} selectedDate={selectedDate} />
              <DiaryList diaries={diaries} deleteDiary={deleteDiary} />
              <MoodStats diaries={diaries} enlistDate={enlistDate} />
            </div>
          </div>
        )}

        {activeTab === 'page2' && (
          <Page2 diaries={diaries} enlistDate={enlistDate} />
        )}
      </div>
    </div>
  )
}

export default App
