import { useEffect, useState } from 'react'
import { collection, doc, setDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function useFirestore(userId) {
  const [diaries, setDiaries] = useState([])
  const [timelineEvents, setTimelineEvents] = useState([])
  const [moods, setMoods] = useState([])
  const [enlistDate, setEnlistDate] = useState('')
  const [serviceDuration, setServiceDuration] = useState(365)
  const [loading, setLoading] = useState(true)

  // 當 userId 改變時，重置所有 state
  useEffect(() => {
    setDiaries([])
    setTimelineEvents([])
    setMoods([])
    setEnlistDate('')
    setServiceDuration(365)
    setLoading(true)
  }, [userId])

  // 用戶資料的 Firestore 路徑
  const userDocRef = userId ? doc(db, 'users', userId) : null
  const diariesRef = userId ? collection(db, 'users', userId, 'diaries') : null
  const timelineRef = userId ? collection(db, 'users', userId, 'timeline') : null
  const moodsRef = userId ? collection(db, 'users', userId, 'moods') : null

  // 載入用戶基本資料（入伍日期）
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const data = userDoc.data()
          setEnlistDate(data.enlistDate || '')
          setServiceDuration(data.serviceDuration || 365)
        } else {
          // 文件不存在時，確保清空資料
          setEnlistDate('')
          setServiceDuration(365)
        }
      } catch (error) {
        console.error('載入用戶資料失敗:', error)
        // 發生錯誤時也要清空
        setEnlistDate('')
        setServiceDuration(365)
      }
    }

    loadUserData()
  }, [userId])

  // 即時監聽日記變化
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(diariesRef, (snapshot) => {
      const diariesData = []
      snapshot.forEach((doc) => {
        diariesData.push({ id: doc.id, ...doc.data() })
      })
      // 按日期排序（最新的在前面）
      diariesData.sort((a, b) => new Date(b.date) - new Date(a.date))
      setDiaries(diariesData)
      setLoading(false)
    }, (error) => {
      console.error('監聽日記失敗:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  // 即時監聽時間軸變化
  useEffect(() => {
    if (!userId) return

    const unsubscribe = onSnapshot(timelineRef, (snapshot) => {
      const eventsData = []
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() })
      })
      // 按日期排序
      eventsData.sort((a, b) => new Date(a.date) - new Date(b.date))
      setTimelineEvents(eventsData)
    }, (error) => {
      console.error('監聽時間軸失敗:', error)
    })

    return () => unsubscribe()
  }, [userId])

  // 即時監聽心情變化
  useEffect(() => {
    if (!userId) return

    const unsubscribe = onSnapshot(moodsRef, (snapshot) => {
      const moodsData = []
      snapshot.forEach((doc) => {
        moodsData.push({ id: doc.id, ...doc.data() })
      })
      // 按日期排序（最新的在前面）
      moodsData.sort((a, b) => new Date(b.date) - new Date(a.date))
      setMoods(moodsData)
    }, (error) => {
      console.error('監聽心情失敗:', error)
    })

    return () => unsubscribe()
  }, [userId])

  // 新增日記
  const addDiary = async (diary) => {
    if (!userId) return
    try {
      await setDoc(doc(diariesRef, String(diary.id)), diary)
    } catch (error) {
      console.error('新增日記失敗:', error)
      throw error
    }
  }

  // 刪除日記
  const deleteDiary = async (diaryId) => {
    if (!userId) return
    try {
      await deleteDoc(doc(diariesRef, String(diaryId)))
    } catch (error) {
      console.error('刪除日記失敗:', error)
      throw error
    }
  }

  // 新增時間軸事件
  const addTimelineEvent = async (event) => {
    if (!userId) return
    try {
      await setDoc(doc(timelineRef, String(event.id)), event)
    } catch (error) {
      console.error('新增時間軸事件失敗:', error)
      throw error
    }
  }

  // 刪除時間軸事件
  const deleteTimelineEvent = async (eventId) => {
    if (!userId) return
    try {
      await deleteDoc(doc(timelineRef, String(eventId)))
    } catch (error) {
      console.error('刪除時間軸事件失敗:', error)
      throw error
    }
  }

  // 新增心情記錄
  const addMood = async (mood) => {
    if (!userId) return
    try {
      await setDoc(doc(moodsRef, String(mood.id)), mood)
    } catch (error) {
      console.error('新增心情記錄失敗:', error)
      throw error
    }
  }

  // 更新入伍日期和服役天數
  const updateEnlistDate = async (date, duration = 365) => {
    if (!userId) return
    try {
      await setDoc(userDocRef, {
        enlistDate: date,
        serviceDuration: duration
      }, { merge: true })
      setEnlistDate(date)
      setServiceDuration(duration)
    } catch (error) {
      console.error('更新入伍日期失敗:', error)
      throw error
    }
  }

  return {
    diaries,
    timelineEvents,
    moods,
    enlistDate,
    serviceDuration,
    loading,
    addDiary,
    deleteDiary,
    addTimelineEvent,
    deleteTimelineEvent,
    addMood,
    updateEnlistDate
  }
}
