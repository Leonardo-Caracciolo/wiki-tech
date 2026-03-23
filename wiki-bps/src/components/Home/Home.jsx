import styles from './Home.module.css'

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

function SectionCard({ section, onClick }) {
  const color = COLORS[section.id] || '#5b6ef5'

  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{ '--card-color': color }}
    >
      <div className={styles.cardTop}>
        <div
          className={styles.cardIcon}
          style={{ background: `${color}18`, borderColor: `${color}30` }}
        >
          {section.icono}
        </div>
        <span className={styles.cardArrow}>↗</span>
      </div>
      <div className={styles.cardName}>{section.nombre}</div>
      <div className={styles.cardDesc}>{section.descripcion}</div>
      <div className={styles.cardFoot}>
        <span className={styles.cardCount}>
          <strong>{section.count}</strong> {section.count === 1 ? 'doc' : 'docs'}
        </span>
        <div className={styles.cardDot} style={{ '--dot-color': color }} />
      </div>
    </div>
  )
}

export default function Home({ wiki }) {
  const { sections, loading, goSection } = wiki

  const totalDocs = sections.reduce((a, s) => a + s.count, 0)

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Documentación del<br />
            <em>equipo BPS</em>
          </h1>
          <p className={styles.heroDesc}>
            Base de conocimiento centralizada del equipo de desarrollo y automatización.
            Guías, referencias y buenas prácticas en un solo lugar.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{sections.length}</div>
            <div className={styles.statLabel}>Secciones</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{totalDocs}</div>
            <div className={styles.statLabel}>Documentos</div>
          </div>
        </div>
      </div>

      <div className={styles.gridLabel}>Explorar por tecnología</div>

      {loading ? (
        <div className={styles.grid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.cardSkeleton} style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      ) : (
        <div className={`${styles.grid} stagger`}>
          {sections.map(sec => (
            <SectionCard
              key={sec.id}
              section={sec}
              onClick={() => goSection(sec.id)}
            />
          ))}
        </div>
      )}

      {/* Keyboard hints */}
      <div className={styles.hints}>
        <span className={styles.hint}><kbd>/</kbd> Buscar</span>
        <span className={styles.hint}><kbd>Esc</kbd> Volver</span>
      </div>
    </div>
  )
}
