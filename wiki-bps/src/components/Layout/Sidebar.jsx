import styles from './Sidebar.module.css'

const COLORS = {
  python:           '#3b82f6',
  csharp:           '#8b5cf6',
  vba:              '#f59e0b',
  sql:              '#10b981',
  testing:          '#ef4444',
  github:           '#6b7280',
  metodologias:     '#06b6d4',
  cookiecutter:     '#f97316',
  'buenas-practicas': '#84cc16',
  patrones:         '#ec4899',
  arquitectura:     '#a855f7',
}

export default function Sidebar({ wiki }) {
  const { sections, loading, currentSection, goSection, focused } = wiki

  if (focused) return null

  return (
    <aside className={styles.sidebar}>
      <div className={styles.body}>
        <span className={styles.label}>Secciones</span>

        {loading ? (
          <div className={styles.loading}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        ) : (
          <nav className={styles.nav}>
            {sections.map(sec => {
              const isActive = currentSection?.id === sec.id
              const color    = COLORS[sec.id] || '#5b6ef5'

              return (
                <button
                  key={sec.id}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={() => goSection(sec.id)}
                  style={isActive ? { '--item-color': color } : {}}
                >
                  <div
                    className={styles.iconBox}
                    style={isActive ? {
                      background: `${color}18`,
                      borderColor: `${color}40`,
                    } : {}}
                  >
                    {sec.icono}
                  </div>
                  <span className={styles.label2}>{sec.nombre}</span>
                  {sec.count > 0 && (
                    <span className={`${styles.badge} ${isActive ? styles.badgeActive : ''}`}>
                      {sec.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}
