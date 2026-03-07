import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiFilm, FiMusic, FiFileText, FiUsers, FiMessageSquare } from 'react-icons/fi'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './Admin.css'

export default function Admin() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('movies')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  // Moderation data
  const [comments, setComments] = useState([])
  const [forumPosts, setForumPosts] = useState([])
  const [forumComments, setForumComments] = useState([])
  const [users, setUsers] = useState([])

  const tabs = [
    { id: 'movies', label: 'Фильмы', icon: FiFilm },
    { id: 'tracks', label: 'Треки', icon: FiMusic },
    { id: 'news', label: 'Новости', icon: FiFileText },
    { id: 'users', label: 'Пользователи', icon: FiUsers },
    { id: 'moderation', label: 'Модерация', icon: FiMessageSquare },
  ]

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      let res
      switch (activeTab) {
        case 'movies':
          res = await api.get('/movies', { params: { limit: 100 } })
          setData(res.data.items || [])
          break
        case 'tracks':
          res = await api.get('/tracks', { params: { limit: 100 } })
          setData(res.data.items || [])
          break
        case 'news':
          res = await api.get('/news', { params: { limit: 100 } })
          setData(res.data.items || [])
          break
        case 'users':
          res = await api.get('/admin/users')
          setUsers(res.data.users || [])
          break
        case 'moderation':
          const [commentsRes, postsRes, forumCommentsRes] = await Promise.all([
            api.get('/admin/moderation/comments'),
            api.get('/admin/moderation/forum/posts'),
            api.get('/admin/moderation/forum/comments'),
          ])
          setComments(commentsRes.data.items || [])
          setForumPosts(postsRes.data.items || [])
          setForumComments(forumCommentsRes.data.items || [])
          break
        default:
          break
      }
    } catch (error) {
      showToast('Ошибка загрузки', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({ ...item })
    } else {
      setFormData({})
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await api.put(`/${activeTab}/${editingItem.id}`, formData)
        showToast('Обновлено', 'success')
      } else {
        await api.post(`/${activeTab}`, formData)
        showToast('Создано', 'success')
      }
      handleCloseModal()
      fetchData()
    } catch (error) {
      showToast(error.response?.data?.detail || 'Ошибка', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return
    try {
      await api.delete(`/${activeTab}/${id}`)
      showToast('Удалено', 'success')
      fetchData()
    } catch {
      showToast('Ошибка удаления', 'error')
    }
  }

  // Moderation handlers
  const handleDeleteComment = async (id) => {
    if (!confirm('Удалить комментарий?')) return
    try {
      await api.delete(`/admin/moderation/comments/${id}`)
      setComments(comments.filter((c) => c.id !== id))
      showToast('Удалено', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const handleDeleteForumPost = async (id) => {
    if (!confirm('Удалить пост?')) return
    try {
      await api.delete(`/admin/moderation/forum/posts/${id}`)
      setForumPosts(forumPosts.filter((p) => p.id !== id))
      showToast('Удалено', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const handleDeleteForumComment = async (id) => {
    if (!confirm('Удалить комментарий форума?')) return
    try {
      await api.delete(`/admin/moderation/forum/comments/${id}`)
      setForumComments(forumComments.filter((c) => c.id !== id))
      showToast('Удалено', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const getFormFields = () => {
    switch (activeTab) {
      case 'movies':
        return (
          <>
            <div className="admin__field">
              <label>Название *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="admin__field">
              <label>URL постера</label>
              <input
                type="url"
                value={formData.poster_url || ''}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>Год</label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
            <div className="admin__field">
              <label>Режиссер</label>
              <input
                type="text"
                value={formData.director || ''}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>Жанры</label>
              <input
                type="text"
                value={formData.genres || ''}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>Описание</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="admin__field">
              <label>Поиск трейлера</label>
              <input
                type="text"
                value={formData.trailer_query || ''}
                onChange={(e) => setFormData({ ...formData, trailer_query: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>Поиск просмотра</label>
              <input
                type="text"
                value={formData.watch_query || ''}
                onChange={(e) => setFormData({ ...formData, watch_query: e.target.value })}
              />
            </div>
          </>
        )
      case 'tracks':
        return (
          <>
            <div className="admin__field">
              <label>Название *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="admin__field">
              <label>URL обложки</label>
              <input
                type="url"
                value={formData.cover_url || ''}
                onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>Исполнитель</label>
              <input
                type="text"
                value={formData.artist || ''}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>ID фильма</label>
              <input
                type="number"
                value={formData.movie_id || ''}
                onChange={(e) => setFormData({ ...formData, movie_id: parseInt(e.target.value) || null })}
              />
            </div>
            <div className="admin__field">
              <label>Spotify URL</label>
              <input
                type="url"
                value={formData.spotify_url || ''}
                onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
              />
            </div>
          </>
        )
      case 'news':
        return (
          <>
            <div className="admin__field">
              <label>Заголовок *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="admin__field">
              <label>Описание</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="admin__field">
              <label>URL изображения</label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div className="admin__field">
              <label>URL источника</label>
              <input
                type="url"
                value={formData.source_url || ''}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  const renderTable = () => {
    switch (activeTab) {
      case 'movies':
        return (
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Год</th>
                <th>Режиссер</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.year || '-'}</td>
                  <td>{item.director || '-'}</td>
                  <td>
                    <button className="admin__btn-icon" onClick={() => handleOpenModal(item)}>
                      <FiEdit2 size={16} />
                    </button>
                    <button className="admin__btn-icon admin__btn-icon--danger" onClick={() => handleDelete(item.id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'tracks':
        return (
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Исполнитель</th>
                <th>Фильм</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.artist || '-'}</td>
                  <td>{item.movie_title || '-'}</td>
                  <td>
                    <button className="admin__btn-icon" onClick={() => handleOpenModal(item)}>
                      <FiEdit2 size={16} />
                    </button>
                    <button className="admin__btn-icon admin__btn-icon--danger" onClick={() => handleDelete(item.id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'news':
        return (
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Заголовок</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{new Date(item.date || item.created_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <button className="admin__btn-icon" onClick={() => handleOpenModal(item)}>
                      <FiEdit2 size={16} />
                    </button>
                    <button className="admin__btn-icon admin__btn-icon--danger" onClick={() => handleDelete(item.id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'users':
        return (
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`admin__role ${user.role === 'admin' ? 'admin__role--admin' : ''}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'moderation':
        return (
          <div className="admin__moderation">
            <div className="admin__moderation-section">
              <h3>Комментарии к фильмам/трекам ({comments.length})</h3>
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Текст</th>
                    <th>Тип</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.text.slice(0, 50)}...</td>
                      <td>{item.item_type}</td>
                      <td>
                        <button className="admin__btn-icon admin__btn-icon--danger" onClick={() => handleDeleteComment(item.id)}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin__moderation-section">
              <h3>Посты форума ({forumPosts.length})</h3>
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Заголовок</th>
                    <th>Рейтинг</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {forumPosts.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.rating}</td>
                      <td>
                        <button className="admin__btn-icon admin__btn-icon--danger" onClick={() => handleDeleteForumPost(item.id)}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin__moderation-section">
              <h3>Комментарии форума ({forumComments.length})</h3>
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Текст</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {forumComments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.text.slice(0, 50)}...</td>
                      <td>
                        <button className="admin__btn-icon admin__btn-icon--danger" onClick={() => handleDeleteForumComment(item.id)}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="admin page">
      <div className="admin__header">
        <h1 className="admin__title">Админ-панель</h1>

        <div className="admin__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin__tab ${activeTab === tab.id ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {['movies', 'tracks', 'news'].includes(activeTab) && (
          <button className="admin__create-btn" onClick={() => handleOpenModal()}>
            <FiPlus size={18} />
            Добавить
          </button>
        )}
      </div>

      <div className="admin__content">
        {loading ? (
          <LoadingSpinner size={60} text="Загрузка..." />
        ) : (
          renderTable()
        )}
      </div>

      {showModal && ['movies', 'tracks', 'news'].includes(activeTab) && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">
              {editingItem ? 'Редактировать' : 'Добавить'} {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <form onSubmit={handleSubmit}>
              {getFormFields()}
              <div className="admin-modal__actions">
                <button type="button" className="admin-modal__cancel" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="submit" className="admin-modal__submit">
                  {editingItem ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
