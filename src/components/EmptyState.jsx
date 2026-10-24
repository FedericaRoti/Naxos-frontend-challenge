export default function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="empty glass" role="status">
      <p className="empty-title">{title}</p>
      {text && <p>{text}</p>}
      {actionLabel && (
        <button type="button" className="btn btn-glass" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
