import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import api from '../api/axios'
import MovieCard from '../components/MovieCard'
import TrackCard from '../components/TrackCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './Catalog.css'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'movies')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const tab = searchParams.get('tab') || 'movies'
    setActiveTab(tab)
    fetchItems(tab, searchQuery)
  }, [searchParams])

  const fetchItems = async (tab, query = '') => {
    setLoading(true)
    try {
      const endpoint = tab === 'movies' ? '/movies' : '/tracks'
      const params = { limit: 50 }
      if (query) params.search = query
      const res = await api.get(endpoint, { params })
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {
      showToast('Ошибка загрузки', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setSearchParams({ tab })
    setItems([])
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchItems(activeTab, searchQuery)
  }

  const handleToggleFavorite = async (itemType, itemId) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      showToast('Войдите, чтобы добавлять в избранное', 'info')
      return
    }
    try {
      await api.post('/favorites/toggle', { item_type: itemType, item_id: itemId })
      showToast('Добавлено в избранное', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  return (
    <div className="catalog page">
      <div className="catalog__header">
        <h1 className="catalog__title">Каталог</h1>

        <div className="catalog__tabs">
          <button
            className={`catalog__tab ${activeTab === 'movies' ? 'catalog__tab--active' : ''}`}
            onClick={() => handleTabChange('movies')}
          >
            Фильмы
          </button>
          <button
            className={`catalog__tab ${activeTab === 'tracks' ? 'catalog__tab--active' : ''}`}
            onClick={() => handleTabChange('tracks')}
          >
            Треки
          </button>
        </div>

        <form className="catalog__search" onSubmit={handleSearch}>
          <FiSearch size={18} />
          <input
            type="text"
            placeholder={`Поиск ${activeTab === 'movies' ? 'фильмов' : 'треков'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="catalog__content">
        {loading ? (
          <LoadingSpinner size={60} text="Загрузка..." />
        ) : items.length === 0 ? (
          <div className="catalog__empty">
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <>
            <p className="catalog__count">Найдено: {total}</p>
            {activeTab === 'movies' ? (
              <div className="catalog__grid movies-grid">
                {items.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog__grid tracks-grid">
                {items.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
