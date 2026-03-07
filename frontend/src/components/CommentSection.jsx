import { useState, useEffect } from 'react'
import { FiSend, FiTrash2 } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useToast } from '../contexts/ToastContext'
import api from '../api/axios'
import './CommentSection.css'

export default function CommentSection({ itemType, itemId }) {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { showToast } = useToast()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [itemType, itemId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/comments/${itemType}/${itemId}`)
      setComments(res.data.items || [])
    } catch {
      showToast('Ошибка загрузки комментариев', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const res = await api.post('/comments', {
        item_type: itemType,
        item_id: itemId,
        text: newComment.trim(),
      })
      setComments([res.data, ...comments])
      setNewComment('')
      showToast('Комментарий добавлен', 'success')
    } catch (error) {
      showToast(error.response?.data?.detail || 'Ошибка', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      setComments(comments.filter((c) => c.id !== commentId))
      showToast('Комментарий удален', 'success')
    } catch {
      showToast('Ошибка удаления', 'error')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="comment-section">
      <h3 className="comment-section__title">Комментарии ({comments.length})</h3>

      {isAuthenticated ? (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <textarea
            className="comment-section__textarea"
            placeholder="Напишите комментарий..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            maxLength={2000}
          />
          <button
            type="submit"
            className="comment-section__submit"
            disabled={submitting || !newComment.trim()}
          >
            <FiSend size={18} />
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      ) : (
        <p className="comment-section__login">
          Войдите, чтобы оставить комментарий
        </p>
      )}

      <div className="comment-section__list">
        {loading ? (
          <p className="comment-section__loading">Загрузка...</p>
        ) : comments.length === 0 ? (
          <p className="comment-section__empty">Пока нет комментариев</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-section__item">
              <div className="comment-section__item-header">
                <span className="comment-section__author">
                  {comment.author?.username || 'Аноним'}
                </span>
                <span className="comment-section__date">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="comment-section__text">{comment.text}</p>
              {(comment.user_id === isAuthenticated?.id || isAuthenticated?.role === 'admin') && (
                <button
                  className="comment-section__delete"
                  onClick={() => handleDelete(comment.id)}
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
