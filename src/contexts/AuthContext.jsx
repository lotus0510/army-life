import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Google 登入（使用彈出窗口）
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      // 處理常見錯誤
      let errorMessage = '登入失敗，請稍後再試'

      if (error.code === 'auth/popup-blocked') {
        errorMessage = '彈出窗口被阻擋，請允許彈出窗口後再試'
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '登入已取消'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = '此網域未獲授權，請聯繫管理員'
      } else if (error.code === 'auth/web-storage-unsupported') {
        errorMessage = '瀏覽器不支援或已禁用 Storage，請檢查瀏覽器設定'
      } else if (error.message && error.message.includes('sessionStorage')) {
        errorMessage = '無法訪問瀏覽器儲存空間，請確認未使用無痕模式，且未禁用 Cookies'
      }

      error.userMessage = errorMessage
      throw error
    }
  }

  // 登出
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setCurrentUser(null)
      window.location.reload()
    } catch (error) {
      throw error
    }
  }

  // 監聽認證狀態變化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signInWithGoogle,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
