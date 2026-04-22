const GENRE_STYLES = {
  Fiction:    { bg: 'linear-gradient(135deg,#312e81,#4c1d95)', emoji: '✨' },
  Science:    { bg: 'linear-gradient(135deg,#164e63,#0e7490)', emoji: '🔬' },
  History:    { bg: 'linear-gradient(135deg,#713f12,#92400e)', emoji: '🏛️' },
  Fantasy:    { bg: 'linear-gradient(135deg,#831843,#9d174d)', emoji: '🐉' },
  Technology: { bg: 'linear-gradient(135deg,#064e3b,#065f46)', emoji: '💻' },
  Biography:  { bg: 'linear-gradient(135deg,#7c2d12,#9a3412)', emoji: '🧑‍💼' },
}

const DEFAULT_STYLE = { bg: 'linear-gradient(135deg,#1e293b,#334155)', emoji: '📖' }

export default function BookCard({ book, onClick }) {
  const style = GENRE_STYLES[book.genre] || DEFAULT_STYLE
  const available = book.availableCopies > 0

  return (
    <article
      className="book-card fade-in"
      onClick={() => onClick(book)}
      id={`book-card-${book.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
    >
      <div className="book-card-cover" style={{ background: style.bg }}>
        <span style={{ position: 'relative', zIndex: 1, fontSize: '3rem' }}>{style.emoji}</span>
      </div>
      <div className="book-card-body">
        <div className="book-card-title">{book.title}</div>
        <div className="book-card-author">by {book.author}</div>
      </div>
      <div className="book-card-footer">
        <span className={`badge badge-${book.genre?.toLowerCase()}`}>{book.genre}</span>
        <span className={`availability-pill ${available ? 'available' : 'unavailable'}`}>
          {available ? `${book.availableCopies} left` : 'Unavailable'}
        </span>
      </div>
    </article>
  )
}
