import { useCallback, useEffect, useMemo, useState } from 'react'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'
const STORAGE_KEY = 'catalogo.addedPosts'
const FIRST_ADDED_ID = 101

function isPost(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    typeof value.body === 'string'
  )
}

function loadAdded() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(stored)) return []
    const valid = stored.filter((post) => isPost(post) && post.id >= FIRST_ADDED_ID)
    return valid.filter((post, index) => valid.findIndex((other) => other.id === post.id) === index)
  } catch {
    return []
  }
}

function saveAdded(added) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(added))
  } catch {
    return
  }
}

export function usePosts() {
  const [remote, setRemote] = useState([])
  const [added, setAdded] = useState(loadAdded)
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    fetch(API_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Risposta non valida')
        setRemote(data.filter(isPost))
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const addPost = (title, body) => {
    const current = loadAdded()
    const id = Math.max(FIRST_ADDED_ID - 1, ...current.map((post) => post.id)) + 1
    const post = { id, title, body }
    const next = [post, ...current]
    setAdded(next)
    saveAdded(next)
    return post
  }

  const posts = useMemo(
    () => [...added.map((post) => ({ ...post, added: true })), ...remote],
    [added, remote],
  )

  return { posts, status, retry, addPost }
}
