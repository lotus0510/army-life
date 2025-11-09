import { useState } from 'react'
import './DaysCounter.css'

function DaysCounter({ enlistDate, serviceDuration = 365, setEnlistDate, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const dateInput = e.target.enlistDate.value
    const durationInput = parseInt(e.target.serviceDuration.value)
    if (dateInput) {
      setEnlistDate(dateInput, durationInput)
    }
  }

  const handleOverlayClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="settings-modal-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-form">
          <h2>⚙️ 設定軍旅資訊</h2>
          <div className="form-group">
            <label htmlFor="enlistDate">入伍日期</label>
            <input
              type="date"
              id="enlistDate"
              name="enlistDate"
              defaultValue={enlistDate}
              required
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
            />
          </div>
          <div className="form-group">
            <label>服役天數</label>
            <select name="serviceDuration" defaultValue={serviceDuration}>
              <option value="120">義務役 (4個月 - 120天)</option>
              <option value="365">一年義務役 (365天)</option>
              <option value="730">兩年義務役 (730天)</option>
              <option value="1095">三年志願役 (1095天)</option>
              <option value="1460">四年志願役 (1460天)</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">確定</button>
            {enlistDate && onClose && (
              <button type="button" onClick={onClose} className="cancel-btn">
                取消
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default DaysCounter
