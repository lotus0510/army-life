# Firebase 設置指南

按照以下步驟設置 Firebase 來啟用 Google 登入功能：

## 第一步：創建 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」
3. 輸入專案名稱（例如：military-life-diary）
4. 可選擇啟用 Google Analytics
5. 點擊「建立專案」

## 第二步：註冊 Web 應用

1. 在專案概覽頁面，點擊「Web」圖示（</>）
2. 輸入應用暱稱（例如：Military Life Web App）
3. 勾選「同時為這個應用程式設定 Firebase Hosting」（可選）
4. 點擊「註冊應用程式」
5. **複製 Firebase 配置物件**，稍後會用到

## 第三步：啟用 Google 登入

1. 在左側選單中，點擊「Authentication」
2. 點擊「開始使用」
3. 在「登入方式」標籤中，點擊「Google」
4. 啟用 Google 登入
5. 選擇專案的支援電子郵件
6. 點擊「儲存」

## 第四步：啟用 Firestore Database

1. 在左側選單中，點擊「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式啟動」（稍後可以修改規則）
4. 選擇資料庫位置（建議選擇 asia-east1 或 asia-northeast1）
5. 點擊「啟用」

## 第五步：配置應用程式

1. 打開 `src/firebase.js` 文件
2. 將步驟二中複製的 Firebase 配置貼上，替換現有的配置：

```javascript
const firebaseConfig = {
  apiKey: "你的 API Key",
  authDomain: "你的 Auth Domain",
  projectId: "你的 Project ID",
  storageBucket: "你的 Storage Bucket",
  messagingSenderId: "你的 Messaging Sender ID",
  appId: "你的 App ID"
}
```

3. 保存文件

## 第六步：測試應用

1. 確保開發伺服器正在運行：`npm run dev`
2. 在瀏覽器中打開 http://localhost:5173
3. 點擊「使用 Google 登入」按鈕
4. 選擇你的 Google 帳號
5. 授權應用程式
6. 成功登入後，你應該能看到主應用頁面

## 安全規則（生產環境必須設置）

### Firestore 安全規則

在生產環境中，請更新 Firestore 規則以保護數據：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶只能讀寫自己的數據
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 常見問題

### Q: 登入時出現「此應用未經 Google 驗證」警告
A: 這是正常的，因為應用還在開發階段。在生產環境中，需要提交應用進行驗證。

### Q: 登入失敗
A: 請檢查：
- Firebase 配置是否正確
- Google 登入是否已在 Firebase Console 中啟用
- 瀏覽器控制台是否有錯誤訊息

### Q: 如何部署到生產環境？
A: 可以使用以下方式：
- Firebase Hosting：`npm run build && firebase deploy`
- Vercel、Netlify 等平台

## 下一步

現在你的應用已經支援 Google 登入了！之後可以：
1. 將數據從 localStorage 遷移到 Firestore
2. 實現多設備同步
3. 添加更多登入方式（Facebook、Email 等）
4. 設置數據備份
