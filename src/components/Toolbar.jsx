import { SORT_OPTIONS, SOURCE_OPTIONS } from '../listing.js'
import './Toolbar.css'

export default function Toolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  source,
  onSourceChange,
  inputRef,
  disabled,
  formOpen,
  onToggleForm,
  addButtonRef,
}) {
  return (
    <div className="toolbar glass">
      <div role="search" className="toolbar-search">
        <label className="visually-hidden" htmlFor="search">
          Cerca nelle voci
        </label>
        <input
          id="search"
          ref={inputRef}
          type="search"
          className="field"
          placeholder="Cerca nelle voci"
          value={query}
          disabled={disabled}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div>
        <label className="visually-hidden" htmlFor="sort">
          Ordina per
        </label>
        <select
          id="sort"
          className="field"
          value={sort}
          disabled={disabled}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="visually-hidden" htmlFor="source">
          Mostra
        </label>
        <select
          id="source"
          className="field"
          value={source}
          disabled={disabled}
          onChange={(event) => onSourceChange(event.target.value)}
        >
          {SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        ref={addButtonRef}
        type="button"
        className="btn btn-accent"
        disabled={disabled}
        aria-expanded={formOpen}
        aria-controls={formOpen ? 'post-form' : undefined}
        onClick={onToggleForm}
      >
        + Nuova voce
      </button>
    </div>
  )
}
