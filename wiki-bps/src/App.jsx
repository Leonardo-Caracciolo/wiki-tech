import { useTheme }  from './hooks/useTheme'
import { useWiki }   from './hooks/useWiki'
import Header        from './components/Layout/Header'
import Sidebar       from './components/Layout/Sidebar'
import Home          from './components/Home/Home'
import SectionView   from './components/Section/SectionView'
import DocViewer     from './components/DocViewer/DocViewer'
import SearchResults from './components/Search/SearchResults'
import styles        from './App.module.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const wiki = useWiki()

  const renderContent = () => {
    switch (wiki.view) {
      case 'home':    return <Home    wiki={wiki} />
      case 'section': return <SectionView wiki={wiki} />
      case 'search':  return <SearchResults wiki={wiki} />
      case 'doc':     return <DocViewer wiki={wiki} />
      default:        return <Home wiki={wiki} />
    }
  }

  return (
    <div className={`${styles.app} ${wiki.focused ? styles.focused : ''}`}>
      {/* Header */}
      <Header
        wiki={wiki}
        theme={theme}
        onThemeToggle={toggle}
      />

      {/* Body */}
      <div className={styles.body}>
        <Sidebar wiki={wiki} />
        <main className={styles.main}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
