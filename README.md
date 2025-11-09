# 我的軍旅生活記錄網頁

一個用於記錄軍旅生活的網頁應用，包含日記、心情追蹤、時間軸和入伍天數計算功能。支援 Google 登入和雲端數據同步。

## 功能特色

- **Google 登入**: 使用 Google 帳號安全登入
- **入伍天數計數器**: 自動計算從入伍日期到現在的天數
- **日記記錄**: 記錄每日的軍旅生活心得和經歷
- **心情追蹤**: 記錄每天的心情狀態（開心、難過、疲憊等）
- **重要時刻時間軸**: 記錄軍旅生活中的重要事件和里程碑
- **雲端同步**: 數據安全存儲在 Firebase（需配置）

## 快速開始

### 安裝依賴

```bash
npm install
```

### 運行開發伺服器

```bash
npm run dev
```

然後在瀏覽器中打開 http://localhost:5173

### 構建生產版本

```bash
npm run build
```

## 技術棧

- **React 18**: 前端框架
- **Vite**: 構建工具
- **Firebase**: 認證和資料庫
  - Firebase Authentication (Google 登入)
  - Firestore Database (數據存儲)
- **CSS3**: 樣式設計

## Firebase 設置（重要！）

應用需要 Firebase 配置才能正常運行。請按照以下步驟設置：

### 方法一：快速開始（使用 localStorage）

如果你暫時不想設置 Firebase，可以臨時禁用登入功能：

1. 目前應用已集成 Firebase，需要配置才能使用
2. 請參考下方「方法二」設置 Firebase

### 方法二：完整設置（推薦）

詳細設置步驟請查看 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**快速概要：**

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 創建新專案
3. 啟用 Authentication → Google 登入
4. 啟用 Firestore Database
5. 複製配置到 `src/firebase.js`

配置完成後，應用將支援：
- Google 帳號登入
- 雲端數據同步
- 多設備訪問

## 專案結構

```
life/
├── src/
│   ├── components/
│   │   ├── DaysCounter.jsx        # 入伍天數計數器
│   │   ├── DiaryForm.jsx          # 日記表單
│   │   ├── DiaryList.jsx          # 日記列表
│   │   ├── Timeline.jsx           # 時間軸
│   │   ├── MoodTracker.jsx        # 心情追蹤
│   │   └── Login.jsx              # 登入頁面
│   ├── contexts/
│   │   └── AuthContext.jsx        # 認證上下文
│   ├── App.jsx                    # 主應用組件
│   ├── main.jsx                   # 入口文件
│   ├── firebase.js                # Firebase 配置（需自行填寫）
│   └── index.css                  # 全局樣式
├── index.html
├── package.json
├── vite.config.js
├── README.md                      # 專案說明
└── FIREBASE_SETUP.md              # Firebase 設置指南
```

## 使用說明

### 首次使用

1. **設置 Firebase**: 按照 FIREBASE_SETUP.md 完成 Firebase 配置
2. **啟動應用**: 運行 `npm run dev`
3. **Google 登入**: 點擊「使用 Google 登入」按鈕
4. **選擇帳號**: 選擇你的 Google 帳號並授權

### 日常使用

1. **設定入伍日期**: 首次登入後設定你的入伍日期
2. **記錄心情**: 點選相應的表情符號記錄今天的心情
3. **寫日記**: 點擊「記錄今天的軍旅生活」按鈕開始寫日記
4. **添加重要事件**: 在時間軸中添加重要的軍旅時刻
5. **查看統計**: 在入伍天數計數器中查看服役時間
6. **登出**: 點擊右上角的「登出」按鈕安全登出

## 授權

本專案為個人使用，請根據需求自行修改。
