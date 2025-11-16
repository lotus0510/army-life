import './TabNavigation.css'

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: '首頁', icon: '🏠' },
    { id: 'page2', label: '搜尋報表', icon: '📊' },
    { id: 'page3', label: '筆記', icon: '📝' },
    { id: 'page4', label: '體重紀錄', icon: '📈' }
]

  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TabNavigation
