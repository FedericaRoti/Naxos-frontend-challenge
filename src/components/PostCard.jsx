import './PostCard.css'

export default function PostCard({ post, featured, isNew }) {
  const number = String(post.id).padStart(2, '0')
  const className = ['card', 'glass', featured && 'card-featured', post.added && 'card-added', isNew && 'card-new']
    .filter(Boolean)
    .join(' ')

  return (
    <article className={className}>
      <div className="card-meta">
        <span className="card-dot" aria-hidden="true" />
        N. {number}
        {featured && <span className="card-pin">In evidenza</span>}
        {post.added && <span className="card-tag">Aggiunta da te</span>}
      </div>
      <h2 title={post.title}>{post.title}</h2>
      <div className="card-rule" aria-hidden="true" />
      <p title={post.body}>{post.body}</p>
      {featured && (
        <span className="card-watermark" aria-hidden="true">
          {number}
        </span>
      )}
    </article>
  )
}
