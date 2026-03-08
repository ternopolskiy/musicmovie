import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import api from '../api/axios'
import HeroSlider from '../components/HeroSlider'
import MovieCard from '../components/MovieCard'
import TrackCard from '../components/TrackCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import { addFavoriteLocal, removeFavoriteLocal } from '../store/authSlice'
import './Home.css'

export default function Home() {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const favorites = useSelector((s) => s.auth.favorites || [])
  const [stats, setStats] = useState({ movies: 0, tracks: 0, users: 0 })
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTracks, setPopularTracks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, moviesRes, tracksRes] = await Promise.all([
        api.get('/stats'),
        api.get('/movies?limit=8'),
        api.get('/tracks?limit=8'),
      ])
      setStats(statsRes.data)
      setPopularMovies(moviesRes.data.items || [])
      setPopularTracks(tracksRes.data.items || [])
    } catch {
      showToast('Ошибка загрузки данных', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`)
      if (res.data.movies?.length > 0) {
        setPopularMovies(res.data.movies)
      } else if (res.data.tracks?.length > 0) {
        setPopularTracks(res.data.tracks)
      } else {
        showToast('Ничего не найдено', 'info')
      }
    } catch {
      showToast('Ошибка поиска', 'error')
    }
  }

  const handleToggleFavorite = async (itemType, itemId) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      showToast('Войдите, чтобы добавлять в избранное', 'info')
      return
    }

    try {
      const res = await api.post('/favorites/toggle', { item_type: itemType, item_id: itemId })
      const isFavorite = res.data.is_favorite
      if (isFavorite) {
        dispatch(addFavoriteLocal({ item_type: itemType, item_id: itemId }))
        showToast('Добавлено в избранное', 'success')
      } else {
        dispatch(removeFavoriteLocal({ item_type: itemType, item_id: itemId }))
        showToast('Удалено из избранного', 'info')
      }
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const isFavorite = (itemType, itemId) => {
    return favorites.some((f) => f.item_type === itemType && f.item_id === itemId)
  }

  if (loading) {
    return <LoadingSpinner size={60} text="Загрузка..." />
  }

  return (
    <div className="home page">
      <HeroSlider />

      <section className="home__stats section">
        <div className="home__stats-inner">
          <div className="home__stat-item">
            <span className="home__stat-value">{stats.movies}</span>
            <span className="home__stat-label">Фильмов</span>
          </div>
          <div className="home__stat-item">
            <span className="home__stat-value">{stats.tracks}</span>
            <span className="home__stat-label">Треков</span>
          </div>
          <div className="home__stat-item">
            <span className="home__stat-value">{stats.users}</span>
            <span className="home__stat-label">Пользователей</span>
          </div>
        </div>
      </section>

      <section className="home__search section">
        <form className="home__search-form" onSubmit={handleSearch}>
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Поиск фильмов и треков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Популярные треки</h2>
          <Link to="/catalog?tab=tracks" className="section__link">
            Смотреть все
          </Link>
        </div>
        <div className="grid tracks-grid">
          {popularTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite('track', track.id)}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Популярные фильмы</h2>
          <Link to="/catalog?tab=movies" className="section__link">
            Смотреть все
          </Link>
        </div>
        <div className="grid movies-grid">
          {popularMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite('movie', movie.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
