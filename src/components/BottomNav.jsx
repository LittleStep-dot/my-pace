export default function BottomNav({ tab, setTab }) {
  const items = [
    { key: 'today', label: '오늘', icon: '🏠' },
    { key: 'journey', label: '여정', icon: '🗺️' },
    { key: 'profile', label: '프로필', icon: '👤' },
  ]

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.key}
          className={tab === item.key ? 'active' : ''}
          aria-current={tab === item.key ? 'page' : undefined}
          onClick={() => { setTab(item.key); window.scrollTo({ top: 0, behavior: 'instant' }) }}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
