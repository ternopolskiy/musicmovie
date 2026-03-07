import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiFilm, FiMusic } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites, removeFavoriteLocal } from '../store/authSlice'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './Favorites.css'

export default function Favorites() {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const { favorites, user } = useSelector((s) => s.auth)
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchFavoritesData()
  }, [activeTab])

  const fetchFavoritesData = async () => {
    setLoading(true)
    try {
      const params = activeTab === 'all' ? {} : { item_type: activeTab }
      const res = await api.get('/favorites', { params })
      setItems(res.data.items || [])
    } catch {
      showToast('Ошибка загрузки', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemType, itemId) => {
    try {
      await api.post('/favorites/toggle', { item_type: itemType, item_id: itemId })
      dispatch(removeFavoriteLocal({ item_type: itemType, item_id: itemId }))
      setItems(items.filter((f) => !(f.item_type === itemType && f.item_id === itemId)))
      showToast('Удалено из избранного', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const filteredItems = activeTab === 'all'
    ? items
    : items.filter((item) => item.item_type === activeTab)

  return (
    <div className="favorites page">
      <div className="favorites__header">
        <h1 className="favorites__title">Избранное</h1>
        <p className="favorites__subtitle">
          {user?.username}, ваши сохраненные треки и фильмы
        </p>

        <div className="favorites__tabs">
          <button
            className={`favorites__tab ${activeTab === 'all' ? 'favorites__tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Все
          </button>
          <button
            className={`favorites__tab ${activeTab === 'movie' ? 'favorites__tab--active' : ''}`}
            onClick={() => setActiveTab('movie')}
          >
            <FiFilm size={16} />
            Фильмы
          </button>
          <button
            className={`favorites__tab ${activeTab === 'track' ? 'favorites__tab--active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <FiMusic size={16} />
            Треки
          </button>
        </div>
      </div>

      <div className="favorites__content">
        {loading ? (
          <LoadingSpinner size={60} text="Загрузка..." />
        ) : filteredItems.length === 0 ? (
          <div className="favorites__empty">
            <FiFilm size={48} />
            <p>Список избранного пуст</p>
            <Link to="/catalog" className="favorites__link">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="favorites__list">
            {filteredItems.map((item) => (
              <div key={item.id} className="favorites__item">
                <Link
                  to={`/${item.item_type}/${item.item_id}`}
                  className="favorites__item-link"
                >
                  <img
                    src={item.item_poster || 'https://via.placeholder.com/60x60'}
                    alt={item.item_title}
                    className="favorites__item-image"
                  />
                  <div className="favorites__item-info">
                    <span className="favorites__item-type">
                      {item.item_type === 'movie' ? 'Фильм' : 'Трек'}
                    </span>
                    <span className="favorites__item-title">{item.item_title}</span>
                  </div>
                </Link>
                <button
                  className="favorites__remove"
                  onClick={() => handleRemove(item.item_type, item.item_id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
