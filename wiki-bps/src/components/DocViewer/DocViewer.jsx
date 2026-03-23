import { useEffect, useRef } from 'react'
import { api } from '../../api/client'
import styles from './DocViewer.module.css'

const COLORS = {
  python: '#3b82f6', csharp: '#8b5cf6', vba: '#f59e0b',
  sql: '#10b981', testing: '#ef4444', github: '#6b7280',
  metodologias: '#06b6d4', cookiecutter: '#f97316',
  'buenas-practicas': '#84cc16', patrones: '#ec4899', arquitectura: '#a855f7',
}

function FocusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  )
}

function ExitFocusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

export default function DocViewer({ wiki }) {
  const {
    currentSection, currentDoc, sectionData,
    docData, docLoading, docError,
    focused, setFocused,
    goHome, goSection,
  } = wiki

  const iframeRef = useRef(null)
  const color = COLORS[currentSection?.id] || '#5b6ef5'

  // Scroll to top on new doc
  useEffect(() => {
    document.getElementById('doc-scroll')?.scrollTo(0, 0)
  }, [currentDoc?.nombre])

  const handleDownload = () => {
    if (!currentSection?.id || !currentDoc?.nombre) return
    const url = api.downloadUrl(currentSection.id, currentDoc.nombre)
    const a   = document.createElement('a')
    a.href     = url
    a.download = currentDoc.nombre
    a.click()
  }

  const handleBack = () => {
    if (focused) { setFocused(false); return }
    if (currentSection?.id) goSection(currentSection.id)
    else goHome()
  }

  const isDocx = currentDoc?.nombre?.toLowerCase().endsWith('.docx')

  return (
    <div className={`${styles.viewer} ${focused ? styles.focused : ''}`}>

      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={handleBack} title="Volver (Esc)">
          <BackIcon />
          <span>{focused ? 'Salir del foco' : currentSection?.nombre || 'Volver'}</span>
        </button>

        <div className={styles.topCenter}>
          {currentDoc && (
            <>
              <span
                className={styles.sectionChip}
                style={{ background: `${color}18`, color }}
              >
                {currentSection?.icono} {currentSection?.nombre}
              </span>
              <span className={styles.docTitleTop}>{currentDoc.titulo}</span>
            </>
          )}
        </div>

        <div className={styles.topActions}>
          <button
            className={styles.actionBtn}
            onClick={handleDownload}
            title="Descargar archivo"
            disabled={docLoading}
          >
            <DownloadIcon />
            <span>Descargar</span>
          </button>
          <button
            className={`${styles.actionBtn} ${focused ? styles.actionActive : ''}`}
            onClick={() => setFocused(f => !f)}
            title={focused ? 'Salir del modo lectura (F)' : 'Modo lectura (F)'}
          >
            {focused ? <ExitFocusIcon /> : <FocusIcon />}
            <span>{focused ? 'Salir' : 'Foco'}</span>
          </button>
        </div>
      </div>

      {/* Doc header (shown in focused mode too) */}
      {currentDoc && !docLoading && !docError && (
        <div className={styles.docHeader}>
          <div className={styles.docMeta}>
            <span className={`${styles.typeBadge} ${styles[`type_${currentDoc.tipo}`]}`}>
              {currentDoc.tipo}
            </span>
            {currentDoc.fecha && (
              <span className={styles.metaDate}>{currentDoc.fecha}</span>
            )}
          </div>
          <h1 className={styles.docTitle}>{currentDoc.titulo}</h1>
          {currentDoc.descripcion && (
            <p className={styles.docDesc}>{currentDoc.descripcion}</p>
          )}
          {currentDoc.tags?.length > 0 && (
            <div className={styles.docTags}>
              {currentDoc.tags.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          )}
          <div className={styles.docDivider} />
        </div>
      )}

      {/* Content area */}
      <div className={styles.contentArea}>

        {/* Loading */}
        {docLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span className={styles.loadingText}>
              {isDocx ? 'Convirtiendo a PDF… (solo la primera vez)' : 'Cargando documento…'}
            </span>
          </div>
        )}

        {/* Error */}
        {docError && !docLoading && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorTitle}>No se pudo cargar el documento</div>
            <div className={styles.errorMsg}>{docError}</div>
            <button className={styles.retryBtn} onClick={handleBack}>
              Volver a la sección
            </button>
          </div>
        )}

        {/* html_fragment — rendered markdown / docx fallback */}
        {docData?.tipo === 'html_fragment' && !docLoading && (
          <div className={styles.htmlWrap} id="doc-scroll">
            <div
              className={`doc-content ${styles.docContent}`}
              dangerouslySetInnerHTML={{ __html: docData.html }}
            />
          </div>
        )}

        {/* iframe — PDF / HTML completo */}
        {(docData?.tipo === 'iframe' || docData?.tipo === 'pdf') && !docLoading && (
          <iframe
            ref={iframeRef}
            className={styles.iframe}
            src={docData.url}
            title={currentDoc?.titulo}
          />
        )}
      </div>

      {/* Focused mode overlay hint */}
      {focused && (
        <div className={styles.focusHint}>
          <span>Modo lectura · <kbd>F</kbd> o <kbd>Esc</kbd> para salir</span>
        </div>
      )}
    </div>
  )
}
