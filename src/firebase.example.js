// Firebase 配置範例
// 如果你想使用 Firebase 作為後端，請按照以下步驟操作：
//
// 1. 前往 https://console.firebase.google.com/ 創建新專案
// 2. 啟用 Firestore Database 和 Authentication
// 3. 在專案設置中獲取你的 Firebase 配置
// 4. 將此文件重命名為 firebase.js 並填入你的配置
// 5. 在 App.jsx 中引入並使用 Firebase

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)

export default app
