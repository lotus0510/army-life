/**
 * 使用 Google Sheets 公開 API 讀取資料
 * 此方法不需要後端伺服器，適合部署到 GitHub Pages
 *
 * 前置條件：
 * 1. Google Sheet 必須設為「任何知道連結的人都可以查看」
 * 2. 需要 Google API Key（在 Google Cloud Console 建立）
 */

/**
 * 取得所有工作表名稱
 * @param {string} apiKey - Google API Key
 * @param {string} spreadsheetId - Google Sheet ID
 */
export async function getAllSheets(apiKey, spreadsheetId) {
  // 優先使用傳入的參數，否則使用環境變數
  const key = apiKey || import.meta.env.VITE_GOOGLE_API_KEY
  const sheetId = spreadsheetId || import.meta.env.VITE_GOOGLE_SHEET_ID

  if (!key || !sheetId) {
    throw new Error('請提供 API Key 和 Spreadsheet ID')
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${key}`
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      sheets: data.sheets.map(sheet => ({
        name: sheet.properties.title,
        id: sheet.properties.sheetId
      }))
    }
  } catch (error) {
    console.error('取得工作表清單失敗:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 讀取指定工作表的資料
 * @param {string} sheetName - 工作表名稱
 * @param {string} apiKey - Google API Key
 * @param {string} spreadsheetId - Google Sheet ID
 * @param {string} range - 資料範圍，例如 'A:Z' 或 'A1:D100'
 */
export async function getSheetData(sheetName, apiKey, spreadsheetId, range = 'A:Z') {
  // 優先使用傳入的參數，否則使用環境變數
  const key = apiKey || import.meta.env.VITE_GOOGLE_API_KEY
  const sheetId = spreadsheetId || import.meta.env.VITE_GOOGLE_SHEET_ID

  if (!key || !sheetId) {
    throw new Error('請提供 API Key 和 Spreadsheet ID')
  }

  try {
    const fullRange = `${sheetName}!${range}`
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(fullRange)}?key=${key}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API 錯誤: ${response.status}`)
    }

    const result = await response.json()
    const rows = result.values || []

    if (rows.length === 0) {
      return { success: true, data: [], headers: [] }
    }

    // 第一行當作標題
    const headers = rows[0]
    const data = rows.slice(1).map(row => {
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })

    return {
      success: true,
      data,
      headers
    }
  } catch (error) {
    console.error('讀取資料失敗:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 讀取預設工作表的資料（第一個工作表）
 * @param {string} apiKey - Google API Key
 * @param {string} spreadsheetId - Google Sheet ID
 * @param {string} range - 資料範圍
 */
export async function getDefaultSheetData(apiKey, spreadsheetId, range = 'A:Z') {
  const sheetsResult = await getAllSheets(apiKey, spreadsheetId)

  if (!sheetsResult.success || sheetsResult.sheets.length === 0) {
    return {
      success: false,
      error: '找不到工作表'
    }
  }

  const firstSheetName = sheetsResult.sheets[0].name
  return getSheetData(firstSheetName, apiKey, spreadsheetId, range)
}
