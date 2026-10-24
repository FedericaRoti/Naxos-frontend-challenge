export const SORT_OPTIONS = [
  { value: 'new', label: 'Prima le nuove' },
  { value: 'id', label: 'Id crescente' },
  { value: 'title', label: 'Titolo A–Z' },
]

export const SOURCE_OPTIONS = [
  { value: 'all', label: 'Tutte' },
  { value: 'added', label: 'Aggiunte da te' },
  { value: 'archive', label: 'Dall’archivio' },
]

export function filterBySource(posts, source) {
  if (source === 'added') return posts.filter((post) => post.added)
  if (source === 'archive') return posts.filter((post) => !post.added)
  return posts
}

export function filterPosts(posts, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return posts
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(needle) || post.body.toLowerCase().includes(needle),
  )
}

export function sortPosts(posts, sort) {
  if (sort === 'id') return [...posts].sort((a, b) => a.id - b.id)
  if (sort === 'title') return [...posts].sort((a, b) => a.title.localeCompare(b.title, 'it'))
  return posts
}

export function formatCount(shown, total) {
  if (shown === total) return `${total} ${total === 1 ? 'voce' : 'voci'}`
  return `Mostrate ${shown} di ${total}`
}
