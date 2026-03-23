import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

export function useWiki() {
  const [sections, setSections]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // Navigation state
  const [view, setView]               = useState('home') // home | section | search | doc
  const [currentSection, setCurrentSection] = useState(null)
  const [currentDoc, setCurrentDoc]   = useState(null)
  const [sectionData, setSectionData] = useState(null)

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching]     = useState(false)

  // Doc viewer
  const [docData, setDocData]         = useState(null)
  const [docLoading, setDocLoading]   = useState(false)
  const [docError, setDocError]       = useState(null)

  // Focused reading mode
  const [focused, setFocused]         = useState(false)

  // Load sections on mount
  useEffect(() => {
    api.getSections()
      .then(data => { setSections(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Escape: close focused mode or go back
      if (e.key === 'Escape') {
        if (focused) { setFocused(false); return }
        if (view === 'doc') { goSection(currentSection?.id); return }
        if (view !== 'home') { goHome(); return }
      }
      // F: toggle focused mode (only in doc view)
      if (e.key === 'f' && view === 'doc' && document.activeElement.tagName !== 'INPUT') {
        setFocused(f => !f)
      }
      // /: focus search
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        document.getElementById('global-search')?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [focused, view, currentSection])

  const goHome = useCallback(() => {
    setView('home')
    setCurrentSection(null)
    setCurrentDoc(null)
    setDocData(null)
    setSearchQuery('')
    setFocused(false)
  }, [])

  const goSection = useCallback(async (sectionId) => {
    setView('section')
    setCurrentDoc(null)
    setDocData(null)
    setSearchQuery('')
    setFocused(false)

    const sec = sections.find(s => s.id === sectionId)
    setCurrentSection(sec || { id: sectionId })

    try {
      const data = await api.getSectionDocs(sectionId)
      setSectionData(data)
      setCurrentSection(data.section)
    } catch (err) {
      console.error(err)
    }
  }, [sections])

  const openDoc = useCallback(async (sectionId, docNombre) => {
    setView('doc')
    setDocLoading(true)
    setDocError(null)
    setDocData(null)

    const sec    = sections.find(s => s.id === sectionId) || sectionData?.section
    const docInf = sectionData?.docs?.find(d => d.nombre === docNombre)

    setCurrentSection(sec)
    setCurrentDoc(docInf || { nombre: docNombre, titulo: docNombre, tags: [], tipo: '' })

    try {
      const data = await api.renderDoc(sectionId, docNombre)
      setDocData(data)
    } catch (err) {
      setDocError(err.message)
    } finally {
      setDocLoading(false)
    }
  }, [sections, sectionData])

  const doSearch = useCallback(async (q, sectionId = null) => {
    if (!q.trim()) {
      setSearchQuery('')
      setSearchResults([])
      if (sectionId) goSection(sectionId)
      else goHome()
      return
    }

    setSearchQuery(q)
    setView('search')
    setSearching(true)

    try {
      const results = await api.search(q, sectionId)
      setSearchResults(results)
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }, [goHome, goSection])

  return {
    // State
    sections, loading, error,
    view, currentSection, currentDoc, sectionData,
    searchQuery, searchResults, searching,
    docData, docLoading, docError,
    focused,

    // Actions
    goHome, goSection, openDoc, doSearch,
    setFocused,
    setSections,
  }
}
