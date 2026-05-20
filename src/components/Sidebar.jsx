import { Sparkles } from 'lucide-react'

export default function Sidebar({ navItems, professions, activeView, professionId, onNavigate, onSwitchProfession }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={22} />
        </div>
        <div>
          <strong>AI w Twoim Zawodzie</strong>
          <span>by Cyfrowy Przyjaciel</span>
        </div>
      </div>

      <p className="sidebar-label">Nawigacja</p>
      <nav className="nav-list" aria-label="Nawigacja">
        {navItems.map(([id, label, Icon]) => (
          <button
            className={activeView === id ? 'active' : ''}
            type="button"
            key={id}
            onClick={() => onNavigate(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <p className="sidebar-label">Zawody</p>
      <div className="profession-list">
        {professions.map((item) => {
          const Icon = item.icon
          return (
            <button
              className={item.id === professionId ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => onSwitchProfession(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
