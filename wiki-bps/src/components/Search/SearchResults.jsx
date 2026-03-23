import { api } from '../../api/client'
import styles from './SearchResults.module.css'

const COLORS = {
  python: '#3b82f6', csharp: '#8b5cf6', vba: '#f59e0b',
  sql: '#10b981', testing: '#ef4444', github: '#6b7280',
  metodologias: '#06b6d4', cookiecutter: '#f97316',
  'buenas-practicas': '#84cc16', patrones: '#ec4899', arquitectura: '#a855f7',
}

function ResultCard({ result, onOpen }) {
  const color = COLORS[result.section_id] || '#5b6ef5'

  const handleDownload = (e) => {
    e.stopPropagation()
    const url = api.downloadUrl(result.section_id, result.nombre)
    const a   = document.createElement('a')
    a.href     = url
    a.download = result.nombre
    a.click()
  }

  return (
    <div className={styles.card} onClick={onOpen}>
      <div className={styles.cardLeft}>
        <div className={styles.sectionBadge} style={{ background: `${color}18`, color }}>
          {result.section_icono} {result.section_nombre}
        </div>

        <div className={styles.cardTitle}>{result.titulo}</div>

        {result.descripcion && (
          <div className={styles.cardDesc}>{result.descripcion}</div>
        )}

        {result.tags?.length > 0 && (
          <div className={styles.tags}>
            {result.tags.map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        )}

        <div className={styles.matchInfo}>
          <span className={styles.matchLabel}>encontrado en:</span>
          {result.match_en.map(m => (
            <span key={m} className={styles.matchChip}>{m}</span>
          ))}
        </div>
      </div>

      <div className={styles.cardRight}>
        <span className={`${styles.typeBadge} ${styles[`type_${result.tipo}`]}`}>
          {result.tipo}
        </span>
        <span className={styles.date}>{result.fecha}</span>
        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          title="Descargar"
        >↓</button>
        <span className={styles.arrow}>→</span>
      </div>
    </div>
  )
}

export default function SearchResults({ wiki }) {
  const {
    searchQuery, searchResults, searching,
    openDoc, goHome, goSection,
  } = wiki

  const handleOpen = (result) => {
    openDoc(result.section_id, result.nombre)
  }

  // Group results by section
  const grouped = searchResults.reduce((acc, r) => {
    if (!acc[r.section_id]) {
      acc[r.section_id] = {
        section_id:     r.section_id,
        section_nombre: r.section_nombre,
        section_icono:  r.section_icono,
        items: [],
      }
    }
    acc[r.section_id].items.push(r)
    return acc
  }, {})

  const groups = Object.values(grouped)

  return (
    <div className={styles.view}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span className={styles.bcItem} onClick={goHome}>Wiki</span>
        <span className={styles.bcSep}>›</span>
        <span className={styles.bcCurrent}>Búsqueda</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>
            {searching ? 'Buscando…' : `"${searchQuery}"`}
          </h1>
          {!searching && (
            <p className={styles.headerSub}>
              {searchResults.length === 0
                ? 'Sin resultados'
                : `${searchResults.length} ${searchResults.length === 1 ? 'resultado' : 'resultados'} en ${groups.length} ${groups.length === 1 ? 'sección' : 'secciones'}`
              }
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {searching && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Buscando en toda la wiki…</span>
        </div>
      )}

      {/* No results */}
      {!searching && searchResults.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <div className={styles.emptyTitle}>Sin resultados para "{searchQuery}"</div>
          <p className={styles.emptyDesc}>
            Intentá con otros términos o navegá por secciones.
          </p>
          <button className={styles.homeBtn} onClick={goHome}>
            Ir al inicio
          </button>
        </div>
      )}

      {/* Results grouped by section */}
      {!searching && groups.map(group => {
        const color = COLORS[group.section_id] || '#5b6ef5'

        return (
          <div key={group.section_id} className={styles.group}>
            <div className={styles.groupHeader}>
              <div
                className={styles.groupBadge}
                style={{ background: `${color}15`, borderColor: `${color}30`, color }}
                onClick={() => goSection(group.section_id)}
              >
                {group.section_icono} {group.section_nombre}
              </div>
              <span className={styles.groupCount}>
                {group.items.length} {group.items.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>

            <div className={`${styles.cards} fade-in`}>
              {group.items.map(r => (
                <ResultCard
                  key={`${r.section_id}-${r.nombre}`}
                  result={r}
                  onOpen={() => handleOpen(r)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
