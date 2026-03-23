import { useState, useMemo } from 'react'
import { api } from '../../api/client'
import styles from './SectionView.module.css'

const COLORS = {
  python: '#3b82f6', csharp: '#8b5cf6', vba: '#f59e0b',
  sql: '#10b981', testing: '#ef4444', github: '#6b7280',
  metodologias: '#06b6d4', cookiecutter: '#f97316',
  'buenas-practicas': '#84cc16', patrones: '#ec4899', arquitectura: '#a855f7',
}

function TypeBadge({ tipo }) {
  return <span className={`${styles.badge} ${styles[`badge_${tipo}`]}`}>{tipo}</span>
}

function DocRow({ doc, sectionId, onOpen }) {
  const downloadUrl = api.downloadUrl(sectionId, doc.nombre)

  const handleDownload = (e) => {
    e.stopPropagation()
    const a = document.createElement('a')
    a.href  = downloadUrl
    a.download = doc.nombre
    a.click()
  }

  return (
    <div className={styles.row} onClick={onOpen}>
      <TypeBadge tipo={doc.tipo} />

      <div className={styles.rowMain}>
        <div className={styles.rowTitle}>{doc.titulo}</div>
        {doc.descripcion && (
          <div className={styles.rowDesc}>{doc.descripcion}</div>
        )}
        {doc.tags?.length > 0 && (
          <div className={styles.tags}>
            {doc.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}
      </div>

      <div className={styles.rowRight}>
        <span className={styles.rowDate}>{doc.fecha}</span>
        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          title="Descargar archivo"
        >
          ↓
        </button>
        <span className={styles.rowArrow}>→</span>
      </div>
    </div>
  )
}

export default function SectionView({ wiki }) {
  const { sectionData, currentSection, openDoc, goHome } = wiki
  const [filter, setFilter] = useState('')

  const color = COLORS[currentSection?.id] || '#5b6ef5'

  const docs = useMemo(() => {
    if (!sectionData?.docs) return []
    if (!filter.trim()) return sectionData.docs
    const q = filter.toLowerCase()
    return sectionData.docs.filter(d =>
      d.titulo.toLowerCase().includes(q) ||
      d.descripcion?.toLowerCase().includes(q) ||
      d.nombre.toLowerCase().includes(q) ||
      d.tags?.some(t => t.toLowerCase().includes(q))
    )
  }, [sectionData, filter])

  if (!sectionData && !currentSection) return null

  const section = sectionData?.section || currentSection

  return (
    <div className={styles.view}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span className={styles.bcItem} onClick={goHome}>Wiki</span>
        <span className={styles.bcSep}>›</span>
        <span className={styles.bcCurrent}>{section?.nombre}</span>
      </div>

      {/* Section hero */}
      <div className={styles.hero}>
        <div
          className={styles.heroIcon}
          style={{ background: `${color}15`, borderColor: `${color}30` }}
        >
          {section?.icono}
        </div>
        <div>
          <h1 className={styles.heroTitle} style={{ color }}>{section?.nombre}</h1>
          <p className={styles.heroDesc}>{section?.descripcion}</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.filterWrap}>
          <span className={styles.filterIcon}>🔍</span>
          <input
            className={styles.filterInput}
            type="text"
            placeholder={`Filtrar en ${section?.nombre}...`}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            autoComplete="off"
          />
        </div>
        <span className={styles.docCount}>
          {docs.length} {docs.length === 1 ? 'documento' : 'documentos'}
        </span>
      </div>

      {/* Doc list */}
      <div className={styles.list}>
        {!sectionData ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className={styles.rowSkeleton} style={{ animationDelay: `${i * 80}ms` }} />
          ))
        ) : docs.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📂</div>
            <div className={styles.emptyTitle}>Sin documentos</div>
            <code className={styles.emptyHint}>docs/{currentSection?.id}/</code>
          </div>
        ) : (
          docs.map(doc => (
            <DocRow
              key={doc.nombre}
              doc={doc}
              sectionId={currentSection?.id}
              onOpen={() => openDoc(currentSection?.id, doc.nombre)}
            />
          ))
        )}
      </div>
    </div>
  )
}
