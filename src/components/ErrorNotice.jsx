export default function ErrorNotice({ onRetry }) {
  return (
    <div className="notice glass" role="alert">
      <p>Non siamo riusciti a caricare le voci. Controlla la connessione e riprova.</p>
      <button type="button" className="btn btn-accent" onClick={onRetry}>
        Riprova
      </button>
    </div>
  )
}
