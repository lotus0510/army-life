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
import './App.css'

function App() {
  const { currentUser, signInWithGoogle, signOut } = useAuth()
  const [showSettings, setShowSettings] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showQuickModal, setShowQuickModal] = useState(false)

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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      alert('登入失敗，請稍後再試')
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
        <div className="header-content">
          <div>
            <h1>我的軍旅生活</h1>
            <p>記錄每一個難忘的時刻</p>
          </div>
          <div className="user-info">
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="user-avatar"
            />
            <span className="user-name">{currentUser.displayName}</span>
            <button onClick={handleSignOut} className="logout-btn">
              登出
            </button>
          </div>
        </div>
      </header>

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
  )
}

export default App
