// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnBy_07yoc3aTWyfVQmGYZtG6Wu9GXS9E",
  authDomain: "army-life-web.firebaseapp.com",
  projectId: "army-life-web",
  storageBucket: "army-life-web.firebasestorage.app",
  messagingSenderId: "565006567003",
  appId: "1:565006567003:web:28e5f359a05bb5bde9617e",
  measurementId: "G-5NVZZB87MB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics 只在瀏覽器且支援時啟用，避免離線環境噴錯
let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported && navigator.onLine) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // 忽略 analytics 初始化失敗，不影響其它服務
    });
}

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", // 強制每次彈出選擇帳號
});

export { analytics };
export default app;
