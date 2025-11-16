import { useState, useEffect } from "react";
import "./Page4.css";
import { getAllSheets, getSheetData } from "../utils/publicSheetsAPI";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Page4({ currentUser }) {
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 設定狀態
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [appsScriptUrl, setAppsScriptUrl] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempSpreadsheetId, setTempSpreadsheetId] = useState("");
  const [tempAppsScriptUrl, setTempAppsScriptUrl] = useState("");

  // 新增記錄狀態
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newHeight, setNewHeight] = useState("");
  const [trendRange, setTrendRange] = useState("all"); // 7d | 30d | all
  const [chartMetric, setChartMetric] = useState("weight"); // weight | bmi
  const [animatedWeight, setAnimatedWeight] = useState(null);
  const [animatedBmi, setAnimatedBmi] = useState(null);

  // ESC 關閉彈窗
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showAddForm) setShowAddForm(false);
        if (showSettings) setShowSettings(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAddForm, showSettings]);

  // 從 localStorage 載入設定
  useEffect(() => {
    const savedApiKey = localStorage.getItem("google_sheets_api_key");
    const savedSheetId = localStorage.getItem("google_sheets_sheet_id");
    const savedAppsScriptUrl = localStorage.getItem("google_apps_script_url");
    const savedHeight = localStorage.getItem("weight_last_height");

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedSheetId) setSpreadsheetId(savedSheetId);
    if (savedAppsScriptUrl) setAppsScriptUrl(savedAppsScriptUrl);
    if (savedHeight) setNewHeight(savedHeight);

    // 如果有設定，自動載入工作表
    if (savedApiKey && savedSheetId) {
      loadAvailableSheets(savedApiKey, savedSheetId);
    }
  }, []);

  // 載入可用的工作表
  const loadAvailableSheets = async (key, sheetId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllSheets(
        key || apiKey,
        sheetId || spreadsheetId,
      );

      if (result.success) {
        setSheets(result.sheets);
        // 自動載入第一個工作表
        if (result.sheets.length > 0) {
          const firstSheetName = result.sheets[0].name;
          loadSheetDataHandler(firstSheetName, key, sheetId);
        }
      } else {
        setError(result.error || "無法載入工作表清單");
      }
    } catch (err) {
      setError("載入工作表失敗：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 載入指定工作表的資料
  const loadSheetDataHandler = async (sheetName, key, sheetId) => {
    setLoading(true);
    setError(null);
    setSelectedSheet(sheetName);

    try {
      const result = await getSheetData(
        sheetName,
        key || apiKey,
        sheetId || spreadsheetId,
      );

      if (result.success) {
        setSheetData(result.data);
        setHeaders(result.headers || []);
      } else {
        setError(result.error || "無法載入資料");
      }
    } catch (err) {
      setError("載入資料失敗：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 儲存設定
  const handleSaveSettings = () => {
    if (!tempApiKey.trim() || !tempSpreadsheetId.trim()) {
      alert("請填寫完整的設定");
      return;
    }

    // 儲存到 localStorage
    localStorage.setItem("google_sheets_api_key", tempApiKey.trim());
    localStorage.setItem("google_sheets_sheet_id", tempSpreadsheetId.trim());
    if (tempAppsScriptUrl.trim()) {
      localStorage.setItem("google_apps_script_url", tempAppsScriptUrl.trim());
    }

    // 更新狀態
    setApiKey(tempApiKey.trim());
    setSpreadsheetId(tempSpreadsheetId.trim());
    setAppsScriptUrl(tempAppsScriptUrl.trim());
    setShowSettings(false);

    // 載入工作表
    loadAvailableSheets(tempApiKey.trim(), tempSpreadsheetId.trim());
  };

  // 清除設定
  const handleClearSettings = () => {
    if (!confirm("確定要清除所有設定嗎？")) return;

    localStorage.removeItem("google_sheets_api_key");
    localStorage.removeItem("google_sheets_sheet_id");
    localStorage.removeItem("google_apps_script_url");
    setApiKey("");
    setSpreadsheetId("");
    setAppsScriptUrl("");
    setTempApiKey("");
    setTempSpreadsheetId("");
    setTempAppsScriptUrl("");
    setSheets([]);
    setSheetData([]);
    setSelectedSheet(null);
    setShowSettings(true);
  };

  // 開啟設定視窗
  const handleOpenSettings = () => {
    setTempApiKey(apiKey);
    setTempSpreadsheetId(spreadsheetId);
    setTempAppsScriptUrl(appsScriptUrl);
    setShowSettings(true);
  };

  // 重新載入
  const handleReload = () => {
    setSheetData([]);
    setSelectedSheet(null);
    setError(null);
    if (apiKey && spreadsheetId) {
      loadAvailableSheets();
    }
  };

  const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return null;
    const heightM = heightCm / 100;
    return Number((weight / heightM ** 2).toFixed(1));
  };

  const getBodyStatus = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "體重過輕";
    if (bmi < 24) return "正常範圍";
    if (bmi < 27) return "過重";
    if (bmi < 30) return "輕度肥胖";
    if (bmi < 35) return "中度肥胖";
    return "重度肥胖";
  };

  // 新增記錄
  const handleAddRecord = async () => {
    if (!newWeight || parseFloat(newWeight) <= 0) {
      alert("請輸入有效的體重");
      return;
    }

    if (!appsScriptUrl) {
      alert("⚠️ 請先在設定中填入 Apps Script URL！");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 格式
    const weight = parseFloat(newWeight);
    const height = newHeight ? parseFloat(newHeight) : null;

    if (!height) {
      alert("請先填一次身高（會自動記住下次使用）");
      return;
    }

    const bmi = calculateBMI(weight, height);
    const bodyStatus = getBodyStatus(bmi);

    const newRecord = {
      日期: today,
      體重: weight,
      身高: height,
      BMI: bmi || "",
      體位: bodyStatus,
    };

    try {
      setLoading(true);
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors", // Apps Script 需要使用 no-cors
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });

      // no-cors 模式無法讀取回應，但如果沒有錯誤就代表成功
      console.log("資料已發送到 Google Sheets");

      // 儲存身高以便下次使用
      if (height) {
        localStorage.setItem("weight_last_height", height.toString());
      }

      // 清空輸入並關閉表單
      setNewWeight("");
      setShowAddForm(false);
      setLoading(false);

      // 重新載入資料
      if (apiKey && spreadsheetId) {
        setTimeout(() => {
          loadAvailableSheets();
        }, 1000); // 等待 1 秒讓 Google Sheets 更新
      }

      alert("✅ 記錄已新增到 Google Sheets！");
    } catch (error) {
      console.error("寫入 Google Sheets 失敗:", error);
      setLoading(false);
      alert("❌ 無法寫入 Google Sheets，請檢查 Apps Script URL 設定是否正確");
      setNewWeight("");
      setShowAddForm(false);
    }
  };

  // 開啟新增表單
  const handleOpenAddForm = () => {
    setShowAddForm(true);
  };

  const isConfigured = apiKey && spreadsheetId;

  // 解析體重資料
  const parseWeightData = () => {
    if (!sheetData.length) return [];

    const dateKey = headers.find(
      (h) => h.includes("日期") || h.toLowerCase().includes("date"),
    );
    const weightKey = headers.find(
      (h) => h.includes("體重") || h.toLowerCase().includes("weight"),
    );
    const heightKey = headers.find(
      (h) => h.includes("身高") || h.toLowerCase().includes("height"),
    );
    const bmiKey = headers.find(
      (h) => h.includes("BMI") || h.toLowerCase().includes("bmi"),
    );

    if (!dateKey || !weightKey) return [];

    return sheetData
      .map((row) => ({
        日期: row[dateKey],
        體重: parseFloat(row[weightKey]),
        身高: heightKey ? parseFloat(row[heightKey]) : null,
        BMI: bmiKey ? parseFloat(row[bmiKey]) : null,
        rawData: row,
      }))
      .filter((item) => item.日期 && !isNaN(item.體重))
      .sort((a, b) => new Date(a.日期) - new Date(b.日期)); // 按日期由舊到新
  };

  // 計算統計資料
  const calculateStats = (data) => {
    if (!data.length) return null;

    const weights = data.map((d) => d.體重);
    const bmis = data.map((d) => d.BMI).filter((b) => b !== null);

    // 最新資料為日期最晚的一筆
    const latest = data[data.length - 1];
    const oldest = data[0];

    return {
      latest: {
        weight: latest.體重,
        bmi: latest.BMI,
        date: latest.日期,
      },
      weight: {
        max: Math.max(...weights),
        min: Math.min(...weights),
        avg: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1),
        change: (latest.體重 - oldest.體重).toFixed(1),
      },
      bmi:
        bmis.length > 0
          ? {
              max: Math.max(...bmis).toFixed(1),
              min: Math.min(...bmis).toFixed(1),
              avg: (bmis.reduce((a, b) => a + b, 0) / bmis.length).toFixed(1),
            }
          : null,
    };
  };

  const weightData = parseWeightData();
  const stats = calculateStats(weightData);
  useEffect(() => {
    if (!stats?.latest) return;
    const animateValue = (from, to, setValue, duration = 300) => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const current = from + (to - from) * progress;
        setValue(Number(current.toFixed(2)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    animateValue(
      animatedWeight ?? stats.latest.weight,
      stats.latest.weight,
      setAnimatedWeight,
    );
    if (stats.latest.bmi !== null && stats.latest.bmi !== undefined) {
      animateValue(
        animatedBmi ?? stats.latest.bmi,
        stats.latest.bmi,
        setAnimatedBmi,
      );
    }
  }, [stats?.latest?.weight, stats?.latest?.bmi]);
  const filteredTrendData = (() => {
    if (!weightData.length) return [];
    if (trendRange === "today") return weightData.slice(-1);
    if (trendRange === "7d") return weightData.slice(-7);
    if (trendRange === "30d") return weightData.slice(-30);
    return weightData;
  })();

  const filteredTableRows = sheetData;

  const latestHeight = weightData.length
    ? weightData[weightData.length - 1].身高
    : null;
  const idealWeight = latestHeight
    ? Number(((latestHeight / 100) ** 2 * 24).toFixed(1))
    : null;
  const latestWeightValue = stats?.latest?.weight || null;
  const needToLose =
    idealWeight && latestWeightValue
      ? Number((latestWeightValue - idealWeight).toFixed(1))
      : null;

  return (
    <div className="content-wrapper mission-control">
      <div className="page4-container">
        <div className="page4-header">
          <h2>📊 體重紀錄</h2>
          <div className="header-actions">
            <button
              onClick={handleOpenAddForm}
              className="add-record-btn"
              title="新增記錄"
            >
              ➕ 新增記錄
            </button>
            {isConfigured && (
              <>
                <button
                  onClick={handleOpenSettings}
                  className="settings-btn"
                  title="設定"
                >
                  ⚙️ 設定
                </button>
                <button
                  onClick={handleClearSettings}
                  className="clear-btn"
                  title="清除設定"
                >
                  🗑️ 清除
                </button>
                <button
                  onClick={handleReload}
                  className="reload-btn"
                  title="重新載入"
                >
                  🔄 重新載入
                </button>
              </>
            )}
          </div>
        </div>

        {/* 設定視窗 */}
        {showSettings && (
          <div className="settings-overlay">
            <div
              className="settings-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="settings-header">
                <h3>⚙️ Google Sheets 設定</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>

              <div className="settings-content">
                <div className="form-group">
                  <label>Google API Key *</label>
                  <input
                    type="text"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="貼上你的 Google API Key"
                    className="settings-input"
                  />
                  <p className="hint">
                    在{" "}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Cloud Console
                    </a>{" "}
                    建立
                  </p>
                </div>

                <div className="form-group">
                  <label>Google Spreadsheet ID *</label>
                  <input
                    type="text"
                    value={tempSpreadsheetId}
                    onChange={(e) => setTempSpreadsheetId(e.target.value)}
                    placeholder="貼上你的 Spreadsheet ID"
                    className="settings-input"
                  />
                  <p className="hint">
                    從 Google Sheets URL 中取得：
                    <code>
                      https://docs.google.com/spreadsheets/d/<strong>ID</strong>
                      /edit
                    </code>
                  </p>
                </div>

                <div className="form-group">
                  <label>Apps Script URL（選填，用於寫入）</label>
                  <input
                    type="text"
                    value={tempAppsScriptUrl}
                    onChange={(e) => setTempAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="settings-input"
                  />
                  <p className="hint">
                    設定後可以直接新增資料到 Google Sheets。詳見{" "}
                    <code>SETUP_APPS_SCRIPT.md</code>
                  </p>
                </div>

                <div className="info-box">
                  <h4>📋 快速設定步驟：</h4>
                  <ol>
                    <li>前往 Google Cloud Console 建立 API Key</li>
                    <li>限制 API Key：只允許你的網站網址</li>
                    <li>將 Google Sheet 設為「知道連結的任何人都可以查看」</li>
                    <li>複製 API Key 和 Spreadsheet ID 貼到上方</li>
                  </ol>
                  <p className="hint">
                    詳細步驟請參考 <code>SETUP_API_KEY.md</code>
                  </p>
                </div>

                <div className="settings-actions">
                  <button onClick={handleSaveSettings} className="save-btn">
                    💾 儲存設定
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="cancel-btn"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 新增記錄表單 */}
        {showAddForm && (
          <div className="settings-overlay">
            <div
              className="add-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="add-form-header">
                <h3>➕ 新增體重記錄</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>

              <div className="add-form-content">
                <div className="form-group">
                  <label>體重 (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="例如：70.5"
                    className="settings-input"
                    autoFocus
                  />
                  <p className="hint">今天的體重（必填）</p>
                </div>

                <div className="form-group">
                  <label>身高 (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value)}
                    placeholder="例如：175"
                    className="settings-input"
                  />
                  <p className="hint">選填，用於計算 BMI（會記住上次輸入）</p>
                </div>

                <div className="info-box-add">
                  <p>📅 日期：{new Date().toLocaleDateString("zh-TW")}</p>
                  {newWeight && newHeight && (
                    <>
                      <p>
                        📊 BMI：
                        {calculateBMI(
                          parseFloat(newWeight),
                          parseFloat(newHeight),
                        )}
                      </p>
                      <p>
                        🩺 體位：
                        {getBodyStatus(
                          calculateBMI(
                            parseFloat(newWeight),
                            parseFloat(newHeight),
                          ),
                        )}
                      </p>
                    </>
                  )}
                </div>

                <div className="settings-actions">
                  <button onClick={handleAddRecord} className="save-btn">
                    💾 儲存記錄
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="cancel-btn"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={handleReload} className="retry-btn">
              重試
            </button>
          </div>
        )}

        {!isConfigured && !showSettings && (
          <div className="welcome-section">
            <div className="welcome-content">
              <div className="welcome-icon">📊</div>
              <h3>歡迎使用體重管理功能</h3>
              <p>連接你的 Google Sheets 來追蹤體重變化趨勢。</p>
              <div className="welcome-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>從 Google Sheets 讀取體重資料</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>視覺化體重和 BMI 趨勢</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>查看統計數據與變化</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>支援多個工作表</span>
                </div>
              </div>
              <button
                onClick={handleOpenSettings}
                className="welcome-start-btn"
              >
                🚀 開始設定
              </button>
              <p className="welcome-hint">
                需要幫助？查看 <code>SETUP_API_KEY.md</code> 瞭解詳細設定步驟
              </p>
            </div>
          </div>
        )}

        {isConfigured && !showSettings && (
          <>
            {loading && !sheetData.length ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>載入中...</p>
              </div>
            ) : sheets.length === 0 && !loading ? (
              <div className="empty-state">
                <p>沒有找到工作表</p>
                <p className="hint">
                  請確認 Spreadsheet ID 正確且 Sheet 已設為公開
                </p>
                <button
                  onClick={handleOpenSettings}
                  className="empty-settings-btn"
                >
                  檢查設定
                </button>
              </div>
            ) : (
              <>
                {/* 工作表選擇器 */}
                {sheets.length > 1 && (
                  <div className="sheets-selector">
                    <label>選擇工作表：</label>
                    <div className="sheets-tabs">
                      {sheets.map((sheet) => (
                        <button
                          key={sheet.id}
                          className={`sheet-tab ${selectedSheet === sheet.name ? "active" : ""}`}
                          onClick={() => loadSheetDataHandler(sheet.name)}
                          disabled={loading}
                        >
                          📄 {sheet.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 即時狀態 */}
                {stats && (
                  <div className="live-status">
                    <div className="section-heading">
                      <h3>📡 體重 / BMI 即時狀態</h3>
                      <p>最新紀錄的體態資訊</p>
                    </div>
                    <div className="live-grid wide">
                      <div className="live-card card-fade-up">
                        <div className="overview-label">目前體重</div>
                        <div className="live-value">
                          {(animatedWeight ?? stats.latest.weight)?.toFixed
                            ? (animatedWeight ?? stats.latest.weight).toFixed(1)
                            : stats.latest.weight}{" "}
                          kg
                          <span
                            className={`delta ${parseFloat(stats.weight.change) > 0 ? "up" : "down"}`}
                          >
                            {stats.weight.change > 0 ? "↑" : "↓"}{" "}
                            {Math.abs(stats.weight.change)} kg vs 昨日
                          </span>
                        </div>
                        <div className="live-hint">{stats.latest.date}</div>
                      </div>
                      <div className="live-card card-fade-up">
                        <div className="overview-label">最新 BMI</div>
                        <div className="live-value">
                          {stats.latest.bmi
                            ? (animatedBmi ?? stats.latest.bmi).toFixed(2)
                            : "N/A"}
                          {stats.latest.bmi && (
                            <span
                              className={`pill ${getBodyStatus(stats.latest.bmi).includes("過重") ? "pill-warning" : "pill-safe"}`}
                            >
                              {getBodyStatus(stats.latest.bmi) || "—"}
                            </span>
                          )}
                        </div>
                        <div className="live-hint">自動計算</div>
                      </div>
                      <div className="live-actions">
                        <button
                          onClick={handleOpenAddForm}
                          className="primary-btn"
                        >
                          ➕ 新增
                        </button>
                        <button
                          onClick={handleReload}
                          className="ghost-btn compact"
                        >
                          🔄 重新載入
                        </button>
                        <button
                          onClick={handleOpenSettings}
                          className="ghost-btn compact"
                        >
                          ⚙️ 設定
                        </button>
                        <button
                          onClick={handleClearSettings}
                          className="ghost-btn danger compact"
                        >
                          🗑️ 清除
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 統計卡片 */}
                {stats && (
                  <div className="stats-grid">
                    <div className="stat-card primary">
                      <div className="stat-icon">⚖️</div>
                      <div className="stat-content">
                        <div className="stat-label">目前體重</div>
                        <div className="stat-value">
                          {stats.latest.weight} kg
                        </div>
                        <div
                          className="stat-change"
                          style={{
                            color:
                              parseFloat(stats.weight.change) > 0
                                ? "#ff4757"
                                : "#26de81",
                          }}
                        >
                          {stats.weight.change > 0 ? "↑" : "↓"}{" "}
                          {Math.abs(stats.weight.change)} kg
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📊</div>
                      <div className="stat-content">
                        <div className="stat-label">BMI 指數</div>
                        <div className="stat-value">
                          {stats.latest.bmi || "N/A"}
                        </div>
                        <div className="stat-hint">{stats.latest.date}</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📈</div>
                      <div className="stat-content">
                        <div className="stat-label">平均體重</div>
                        <div className="stat-value">{stats.weight.avg} kg</div>
                        <div className="stat-hint">
                          範圍: {stats.weight.min} - {stats.weight.max} kg
                        </div>
                      </div>
                    </div>

                    {stats.bmi && (
                      <div className="stat-card">
                        <div className="stat-icon">💪</div>
                        <div className="stat-content">
                          <div className="stat-label">平均 BMI</div>
                          <div className="stat-value">{stats.bmi.avg}</div>
                          <div className="stat-hint">
                            範圍: {stats.bmi.min} - {stats.bmi.max}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="stat-card">
                      <div className="stat-icon">🎯</div>
                      <div className="stat-content">
                        <div className="stat-label">理想體重 (BMI 24)</div>
                        <div className="stat-value">
                          {idealWeight ? `${idealWeight} kg` : "請填身高"}
                        </div>
                        <div className="stat-hint">
                          {latestHeight
                            ? `身高：${latestHeight} cm`
                            : "無身高資料"}
                          {needToLose !== null && (
                            <>
                              {" "}
                              ·{" "}
                              {needToLose > 0
                                ? `需減重 ${needToLose} kg`
                                : "已達理想或低於"}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 趨勢區域 */}
                {weightData.length > 0 && (
                  <div className="charts-section">
                    <div className="chart-container full-width">
                      <div className="chart-header">
                        <div>
                          <h3 className="chart-title">📉 趨勢圖</h3>
                          <p className="chart-subtitle">
                            切換觀察區間：7天 / 30天 / 全部
                          </p>
                        </div>
                        <div className="range-switcher">
                          {[
                            { key: "today", label: "今日" },
                            { key: "7d", label: "7 天" },
                            { key: "30d", label: "30 天" },
                            { key: "all", label: "全部" },
                          ].map((range) => (
                            <button
                              key={range.key}
                              className={`range-btn ${trendRange === range.key ? "active" : ""}`}
                              onClick={() => setTrendRange(range.key)}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>

                        <div className="range-switcher metric-tabs">
                          {[
                            { key: "weight", label: "體重", available: true },
                            {
                              key: "bmi",
                              label: "BMI",
                              available: !!stats?.bmi,
                            },
                          ].map((metric) => (
                            <button
                              key={metric.key}
                              disabled={!metric.available}
                              className={`range-btn ${chartMetric === metric.key ? "active" : ""}`}
                              onClick={() => setChartMetric(metric.key)}
                            >
                              {metric.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="charts-grid">
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart
                            data={filteredTrendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#1e293b"
                            />
                            <XAxis
                              dataKey="日期"
                              tick={{ fill: "#cbd5f5", fontSize: 12 }}
                              tickFormatter={(value) => {
                                const d = new Date(value);
                                return isNaN(d)
                                  ? value
                                  : `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
                              }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis
                              tick={{ fill: "#cbd5f5", fontSize: 12 }}
                              domain={["dataMin - 1", "dataMax + 1"]}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "rgba(15, 23, 42, 0.9)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "8px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                                color: "#e2e8f0",
                              }}
                            />
                            <Legend wrapperStyle={{ color: "#e2e8f0" }} />
                            <Line
                              type="monotone"
                              dataKey={chartMetric === "bmi" ? "BMI" : "體重"}
                              stroke={
                                chartMetric === "bmi" ? "#a855f7" : "#22d3ee"
                              }
                              strokeWidth={3}
                              dot={{
                                fill:
                                  chartMetric === "bmi" ? "#a855f7" : "#22d3ee",
                                r: 5,
                              }}
                              activeDot={{ r: 7 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="chart-summary">
                          {(() => {
                            const key = chartMetric === "bmi" ? "BMI" : "體重";
                            const values = filteredTrendData
                              .map((d) => d[key])
                              .filter((v) => v !== null && !isNaN(v));
                            if (!values.length) return "尚無可用數據";
                            const avg = (
                              values.reduce((a, b) => a + b, 0) / values.length
                            ).toFixed(1);
                            const change = (
                              values[values.length - 1] - values[0]
                            ).toFixed(1);
                            const label =
                              chartMetric === "bmi" ? "平均 BMI" : "平均體重";
                            const unit = chartMetric === "bmi" ? "" : " kg";
                            return `${label} ${avg}${unit}（${change >= 0 ? "+" : ""}${change}${unit}）`;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 資料表格 */}
                {sheetData.length > 0 && (
                  <div className="data-section">
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th className="row-number">#</th>
                            {headers.map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTableRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              <td className="row-number">{rowIndex + 1}</td>
                              {headers.map((header, colIndex) => (
                                <td key={colIndex}>{row[header]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Page4;
