import { useEffect, useMemo, useRef, useState } from 'react'
import { usePosts } from './usePosts.js'
import { filterBySource, filterPosts, formatCount, sortPosts } from './listing.js'
import Backdrop from './components/Backdrop.jsx'
import Toolbar from './components/Toolbar.jsx'
import PostForm from './components/PostForm.jsx'
import PostCard from './components/PostCard.jsx'
import LoadingGrid from './components/LoadingGrid.jsx'
import ErrorNotice from './components/ErrorNotice.jsx'
import EmptyState from './components/EmptyState.jsx'

const PAGE_SIZE = 12

export default function App() {
  const { posts, status, retry, addPost } = usePosts()
  const [formOpen, setFormOpen] = useState(false)
  const [highlightId, setHighlightId] = useState(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('new')
  const [source, setSource] = useState('all')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [focusIndex, setFocusIndex] = useState(null)
  const addButtonRef = useRef(null)
  const searchRef = useRef(null)
  const mainRef = useRef(null)
  const listRef = useRef(null)

  const matchingPosts = useMemo(
    () => sortPosts(filterPosts(filterBySource(posts, source), query), sort),
    [posts, source, query, sort],
  )
  const shownPosts = matchingPosts.slice(0, limit)
  const remaining = matchingPosts.length - shownPosts.length

  useEffect(() => {
    if (highlightId === null) return
    const timer = setTimeout(() => setHighlightId(null), 2200)
    return () => clearTimeout(timer)
  }, [highlightId])

  useEffect(() => {
    if (focusIndex === null) return
    listRef.current?.children[focusIndex]?.focus()
    setFocusIndex(null)
  }, [focusIndex])

  function showMore() {
    setFocusIndex(limit)
    setLimit(limit + PAGE_SIZE)
  }

  function changeQuery(value) {
    setQuery(value)
    setLimit(PAGE_SIZE)
  }

  function changeSort(value) {
    setSort(value)
    setLimit(PAGE_SIZE)
  }

  function changeSource(value) {
    setSource(value)
    setLimit(PAGE_SIZE)
  }

  function closeForm() {
    setFormOpen(false)
    const button = addButtonRef.current
    ;(button.disabled ? mainRef.current : button).focus()
  }

  function openForm() {
    if (formOpen) document.getElementById('post-title')?.focus()
    else setFormOpen(true)
  }

  function handleAdd(title, body) {
    const post = addPost(title, body)
    setQuery('')
    setSort('new')
    setSource('all')
    setLimit(PAGE_SIZE)
    setHighlightId(post.id)
    closeForm()
  }

  function clearSearch() {
    changeQuery('')
    searchRef.current.focus()
  }

  const loading = status === 'loading'
  const hasPosts = posts.length > 0
  const countLabel = loading
    ? 'Caricamento…'
    : status === 'error' && !hasPosts
      ? ''
      : formatCount(shownPosts.length, matchingPosts.length)

  return (
    <>
      <Backdrop />
      <div className="app">
        <header className="top">
          <div>
            <p className="kicker">
              <span className="kicker-dot" aria-hidden="true" />
              Archivio{hasPosts && ` · ${posts.length} voci`}
            </p>
            <h1>Catalogo</h1>
          </div>
          <div className="top-side">
            <p className="lede">Una raccolta di contenuti che cresce con te.</p>
            <p className="count" aria-live="polite">
              {countLabel}
            </p>
          </div>
        </header>

        <Toolbar
          query={query}
          onQueryChange={changeQuery}
          sort={sort}
          onSortChange={changeSort}
          source={source}
          onSourceChange={changeSource}
          inputRef={searchRef}
          disabled={loading}
          formOpen={formOpen}
          onToggleForm={() => setFormOpen((open) => !open)}
          addButtonRef={addButtonRef}
        />

        {formOpen && <PostForm onSubmit={handleAdd} onCancel={closeForm} />}

        <main ref={mainRef} tabIndex={-1}>
          {loading && <LoadingGrid />}
          {status === 'error' && <ErrorNotice onRetry={retry} />}

          {!loading && shownPosts.length > 0 && (
            <ul className="grid" ref={listRef}>
              {shownPosts.map((post, index) => {
                const featured = index === 0 && shownPosts.length > 2
                return (
                  <li
                    key={post.id}
                    tabIndex={-1}
                    className={featured ? 'grid-featured' : undefined}
                  >
                    <PostCard post={post} featured={featured} isNew={post.id === highlightId} />
                  </li>
                )
              })}
            </ul>
          )}

          {!loading && remaining > 0 && (
            <div className="more">
              <button
                type="button"
                className="btn btn-glass"
                onClick={showMore}
              >
                Mostra altre {Math.min(PAGE_SIZE, remaining)}
              </button>
            </div>
          )}

          {status === 'ready' && !hasPosts && (
            <EmptyState
              title="Il catalogo è vuoto"
              text="Aggiungi la prima voce con “Nuova voce”."
            />
          )}

          {!loading && hasPosts && matchingPosts.length === 0 && query.trim() && (
            <EmptyState
              title={`Nessuna voce per “${query.trim()}”`}
              actionLabel="Cancella ricerca"
              onAction={clearSearch}
            />
          )}

          {!loading && hasPosts && matchingPosts.length === 0 && !query.trim() && source === 'added' && (
            <EmptyState
              title="Non hai ancora aggiunto voci"
              actionLabel="Aggiungi una voce"
              onAction={openForm}
            />
          )}
        </main>
      </div>
    </>
  )
}
