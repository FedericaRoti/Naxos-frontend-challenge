import './PostCard.css'

export default function LoadingGrid() {
  return (
    <ul className="grid" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className={index === 0 ? 'grid-featured' : undefined}>
          <div className="card glass skeleton" />
        </li>
      ))}
    </ul>
  )
}
