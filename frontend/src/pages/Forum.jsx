import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ForumPostCard from '../components/ForumPostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './Forum.css'

export default function Forum() {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('new')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '' })

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/forum/posts', {
        params: { sort: sortBy, limit: 50 },
      })
      setPosts(res.data.items || [])
    } catch {
      showToast('Ошибка загрузки', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      fetchPosts()
      return
    }
    setLoading(true)
    api.get('/forum/posts', { params: { search: searchQuery, limit: 50 } })
      .then((res) => setPosts(res.data.items || []))
      .catch(() => showToast('Ошибка поиска', 'error'))
      .finally(() => setLoading(false))
  }

  const handleVote = async (postId, value) => {
    if (!isAuthenticated) {
      showToast('Войдите, чтобы голосовать', 'info')
      return
    }
    try {
      const res = await api.post(`/forum/posts/${postId}/vote`, { value })
      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, rating: res.data.rating, user_vote: res.data.user_vote }
          : p
      ))
    } catch {
      showToast('Ошибка голосования', 'error')
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim()) return

    try {
      const res = await api.post('/forum/posts', newPost)
      setPosts([res.data, ...posts])
      setShowCreateModal(false)
      setNewPost({ title: '', content: '' })
      showToast('Пост создан', 'success')
    } catch {
      showToast('Ошибка создания поста', 'error')
    }
  }

  return (
    <div className="forum page">
      <div className="forum__header">
        <h1 className="forum__title">Форум</h1>

        <div className="forum__controls">
          <form className="forum__search" onSubmit={handleSearch}>
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Поиск постов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <select
            className="forum__sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="new">Новые</option>
            <option value="top">Популярные</option>
            <option value="old">Старые</option>
          </select>

          {isAuthenticated ? (
            <button
              className="forum__create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <FiPlus size={18} />
              Создать пост
            </button>
          ) : (
            <p className="forum__login-hint">
              Войдите, чтобы создать пост
            </p>
          )}
        </div>
      </div>

      <div className="forum__content">
        {loading ? (
          <LoadingSpinner size={60} text="Загрузка..." />
        ) : posts.length === 0 ? (
          <div className="forum__empty">
            <p>Пока нет постов</p>
          </div>
        ) : (
          <div className="forum__list">
            {posts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="forum-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="forum-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="forum-modal__title">Создать пост</h2>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                className="forum-modal__input"
                placeholder="Заголовок"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                maxLength={300}
                required
              />
              <textarea
                className="forum-modal__textarea"
                placeholder="Текст поста..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={6}
                required
              />
              <div className="forum-modal__actions">
                <button
                  type="button"
                  className="forum-modal__cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="forum-modal__submit">
                  Опубликовать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
