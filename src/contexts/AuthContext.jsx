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
      console.log('開始 Google 登入...')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ 登入成功!', result.user.displayName)
      return result.user
    } catch (error) {
      console.error('❌ 登入失敗:', error)
      console.error('錯誤代碼:', error.code)
      console.error('錯誤訊息:', error.message)
      throw error
    }
  }

  // 登出
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('登出失敗:', error)
      throw error
    }
  }

  // 監聽認證狀態變化
  useEffect(() => {
    console.log('初始化認證監聽器...')
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ 用戶已登入:', user.displayName, user.email)
        setCurrentUser(user)
      } else {
        console.log('❌ 用戶未登入')
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
