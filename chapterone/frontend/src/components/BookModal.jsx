import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { borrowBook } from '../api/borrowApi.js'

const GENRE_STYLES = {
  Fiction:    { bg: 'linear-gradient(135deg,#312e81,#4c1d95)', emoji: '✨' },
  Science:    { bg: 'linear-gradient(135deg,#164e63,#0e7490)', emoji: '🔬' },
  History:    { bg: 'linear-gradient(135deg,#713f12,#92400e)', emoji: '🏛️' },
  Fantasy:    { bg: 'linear-gradient(135deg,#831843,#9d174d)', emoji: '🐉' },
  Technology: { bg: 'linear-gradient(135deg,#064e3b,#065f46)', emoji: '💻' },
  Biography:  { bg: 'linear-gradient(135deg,#7c2d12,#9a3412)', emoji: '🧑‍💼' },
}
const DEFAULT_STYLE = { bg: 'linear-gradient(135deg,#1e293b,#334155)', emoji: '📖' }

export default function BookModal({ book, onClose, onBorrowed, activeBorrowIds = [] }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!book) return null

  const style = GENRE_STYLES[book.genre] || DEFAULT_STYLE
  const available = book.availableCopies > 0
  const alreadyBorrowed = activeBorrowIds.includes(book.id)

  const handleBorrow = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      await borrowBook(user.id, book.id)
      setSuccess(true)
      onBorrowed && onBorrowed()
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to borrow. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} id="book-modal-overlay">
      <div className="modal" id={`book-modal-${book.id}`}>
        <div className="modal-header">
          <span className={`badge badge-${book.genre?.toLowerCase()}`}>{book.genre}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose} id="modal-close-btn" aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-cover" style={{ background: style.bg }}>
            <span style={{ fontSize: '4.5rem' }}>{style.emoji}</span>
          </div>

          <h2 className="modal-title">{book.title}</h2>
          <p className="modal-meta">by {book.author} · {book.publishedYear || 'N/A'}</p>
          {book.isbn && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>ISBN: {book.isbn}</p>}

          {book.description && (
            <p className="modal-description">{book.description}</p>
          )}

          <div className="modal-stats">
            <div className="stat-box">
              <div className="stat-box-value">{book.totalCopies}</div>
              <div className="stat-box-label">Total Copies</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-value" style={{ color: book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {book.availableCopies}
              </div>
              <div className="stat-box-label">Available</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-value" style={{ fontSize: '1rem' }}>14</div>
              <div className="stat-box-label">Days Loan</div>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">🎉 Book borrowed successfully!</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            {alreadyBorrowed ? (
              <button className="btn btn-outline" disabled style={{ flex: 1 }}>
                ✅ Already on your shelf
              </button>
            ) : (
              <button
                id="borrow-btn"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!available || loading || success}
                onClick={handleBorrow}
              >
                {loading ? '⏳ Borrowing…' : !available ? '📵 Unavailable' : '📗 Borrow Book'}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
