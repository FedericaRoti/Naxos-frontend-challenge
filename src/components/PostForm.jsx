import { useEffect, useRef, useState } from 'react'
import './PostForm.css'

export default function PostForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState({})
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  function clearError(field) {
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanBody = body.trim()
    const next = {}
    if (!cleanTitle) next.title = 'Inserisci un titolo.'
    if (!cleanBody) next.body = 'Scrivi il testo della voce.'
    setErrors(next)

    if (next.title) return titleRef.current.focus()
    if (next.body) return bodyRef.current.focus()
    onSubmit(cleanTitle, cleanBody)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') onCancel()
  }

  return (
    <form
      id="post-form"
      className="form glass"
      aria-label="Nuova voce"
      noValidate
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <div>
        <label htmlFor="post-title">Titolo</label>
        <input
          id="post-title"
          ref={titleRef}
          className="field"
          value={title}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
          onChange={(event) => {
            setTitle(event.target.value)
            clearError('title')
          }}
        />
        {errors.title && (
          <p id="post-title-error" className="field-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="post-body">Testo</label>
        <textarea
          id="post-body"
          ref={bodyRef}
          className="field"
          rows={3}
          value={body}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
          onChange={(event) => {
            setBody(event.target.value)
            clearError('body')
          }}
        />
        {errors.body && (
          <p id="post-body-error" className="field-error" role="alert">
            {errors.body}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-accent">
          Aggiungi voce
        </button>
        <button type="button" className="btn btn-glass" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </form>
  )
}
