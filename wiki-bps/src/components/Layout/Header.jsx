import { useRef, useState } from 'react'
import styles from './Header.module.css'

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

export default function Header({ wiki, theme, onThemeToggle }) {
  const [localQ, setLocalQ] = useState('')
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const handleSearch = (e) => {
    const q = e.target.value
    setLocalQ(q)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      wiki.doSearch(q, null)
    }, 280)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setLocalQ('')
      inputRef.current?.blur()
      wiki.doSearch('')
    }
  }

  return (
    <header className={styles.header}>
      {/* Brand */}
      <div className={styles.brand} onClick={wiki.goHome} role="button" tabIndex={0}>
        <div className={styles.logoMark}>📚</div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>Wiki BPS</span>
          <span className={styles.brandSub}>Dev Team · Deloitte</span>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <div className={styles.searchInner}>
          <SearchIcon />
          <input
            id="global-search"
            ref={inputRef}
            className={styles.searchInput}
            type="text"
            value={localQ}
            placeholder="Buscar en toda la wiki..."
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <div className={styles.searchHint}>
            <kbd>/</kbd>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className={styles.versionPill}>v1.0</div>
      </div>
    </header>
  )
}
