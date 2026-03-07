import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowUp, FiArrowDown, FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './ForumPostDetail.css'

export default function ForumPostDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const { showToast } = useToast()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const res = await api.get(`/forum/posts/${id}`)
      setPost(res.data)
    } catch {
      showToast('Пост не найден', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (value) => {
    if (!isAuthenticated) {
      showToast('Войдите, чтобы голосовать', 'info')
      return
    }
    try {
      const res = await api.post(`/forum/posts/${id}/vote`, { value })
      setPost({ ...post, rating: res.data.rating, user_vote: res.data.user_vote })
    } catch {
      showToast('Ошибка голосования', 'error')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await api.post(`/forum/posts/${id}/comments`, { text: newComment.trim() })
      setPost({ ...post, comments: [...(post.comments || []), res.data] })
      setNewComment('')
      showToast('Комментарий добавлен', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/forum/comments/${commentId}`)
      setPost({ ...post, comments: post.comments.filter((c) => c.id !== commentId) })
      showToast('Комментарий удален', 'success')
    } catch {
      showToast('Ошибка удаления', 'error')
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('Удалить пост?')) return
    try {
      await api.delete(`/forum/posts/${id}`)
      showToast('Пост удален', 'success')
      window.history.back()
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

  if (loading) {
    return <LoadingSpinner size={60} text="Загрузка..." />
  }

  if (!post) return null

  return (
    <div className="forum-post-detail page">
      <div className="forum-post-detail__container">
        <Link to="/forum" className="forum-post-detail__back">
          ← Назад к форуму
        </Link>

        <div className="forum-post-detail__post">
          <div className="forum-post-detail__votes">
            <button
              className={`forum-post-detail__vote ${post.user_vote === 1 ? 'forum-post-detail__vote--up' : ''}`}
              onClick={() => handleVote(1)}
            >
              <FiArrowUp size={24} />
            </button>
            <span className={`forum-post-detail__rating ${post.rating > 0 ? 'forum-post-detail__rating--positive' : post.rating < 0 ? 'forum-post-detail__rating--negative' : ''}`}>
              {post.rating}
            </span>
            <button
              className={`forum-post-detail__vote ${post.user_vote === -1 ? 'forum-post-detail__vote--down' : ''}`}
              onClick={() => handleVote(-1)}
            >
              <FiArrowDown size={24} />
            </button>
          </div>

          <div className="forum-post-detail__content">
            <div className="forum-post-detail__header">
              <h1 className="forum-post-detail__title">{post.title}</h1>
              {(user?.id === post.author?.id || user?.role === 'admin') && (
                <button className="forum-post-detail__delete" onClick={handleDeletePost}>
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>

            <div className="forum-post-detail__meta">
              <span className="forum-post-detail__author">{post.author?.username || 'Аноним'}</span>
              <span className="forum-post-detail__time">{formatDate(post.created_at)}</span>
            </div>

            <div className="forum-post-detail__body">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="forum-post-detail__comments">
          <h3 className="forum-post-detail__comments-title">
            <FiMessageSquare size={20} />
            Комментарии ({post.comments?.length || 0})
          </h3>

          {isAuthenticated ? (
            <form className="forum-post-detail__comment-form" onSubmit={handleAddComment}>
              <textarea
                placeholder="Напишите комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                maxLength={5000}
              />
              <button type="submit" disabled={!newComment.trim()}>
                Отправить
              </button>
            </form>
          ) : (
            <p className="forum-post-detail__login-hint">Войдите, чтобы комментировать</p>
          )}

          <div className="forum-post-detail__comments-list">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="forum-post-detail__comment">
                <div className="forum-post-detail__comment-header">
                  <span className="forum-post-detail__comment-author">
                    {comment.author?.username || 'Аноним'}
                  </span>
                  <span className="forum-post-detail__comment-time">
                    {formatDate(comment.created_at)}
                  </span>
                  {(user?.id === comment.user_id || user?.role === 'admin') && (
                    <button
                      className="forum-post-detail__comment-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="forum-post-detail__comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
