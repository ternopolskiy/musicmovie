import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiPlay, FiHeart } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import CommentSection from '../components/CommentSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './MovieDetail.css'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchMovie()
    checkFavorite()
  }, [id])

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/movies/${id}`)
      setMovie(res.data)
    } catch {
      showToast('Фильм не найден', 'error')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    try {
      const res = await api.get(`/favorites/check?item_type=movie&item_id=${id}`)
      setIsFavorite(res.data.is_favorite)
    } catch {
      // Not logged in or error
    }
  }

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      showToast('Войдите, чтобы добавлять в избранное', 'info')
      return
    }
    try {
      await api.post('/favorites/toggle', { item_type: 'movie', item_id: id })
      setIsFavorite(!isFavorite)
      showToast(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const handleSearch = (query) => {
    window.open(`https://yandex.ru/search/?text=${encodeURIComponent(query)}`, '_blank')
  }

  if (loading) {
    return <LoadingSpinner size={60} text="Загрузка..." />
  }

  if (!movie) return null

  return (
    <div className="movie-detail page">
      <div className="movie-detail__backdrop">
        <img
          src={movie.poster_url || 'https://via.placeholder.com/1920x600?text=No+Backdrop'}
          alt={movie.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1920x600?text=No+Backdrop'
          }}
        />
        <div className="movie-detail__backdrop-overlay" />
      </div>

      <div className="movie-detail__container">
        <div className="movie-detail__poster">
          <img
            src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'
            }}
          />
        </div>

        <div className="movie-detail__info">
          <h1 className="movie-detail__title">{movie.title}</h1>

          <div className="movie-detail__meta">
            {movie.year && <span className="movie-detail__year">{movie.year}</span>}
            {movie.director && (
              <span className="movie-detail__director">Режиссер: {movie.director}</span>
            )}
            {movie.genres && (
              <span className="movie-detail__genres">{movie.genres}</span>
            )}
          </div>

          {movie.description && (
            <p className="movie-detail__description">{movie.description}</p>
          )}

          <div className="movie-detail__actions">
            {movie.trailer_query && (
              <button
                className="movie-detail__btn movie-detail__btn--primary"
                onClick={() => handleSearch(movie.trailer_query)}
              >
                <FiPlay size={18} />
                Трейлер
              </button>
            )}
            {movie.watch_query && (
              <button
                className="movie-detail__btn movie-detail__btn--secondary"
                onClick={() => handleSearch(movie.watch_query)}
              >
                Смотреть
              </button>
            )}
            <button
              className={`movie-detail__btn movie-detail__btn--favorite ${isFavorite ? 'movie-detail__btn--favorite-active' : ''}`}
              onClick={handleToggleFavorite}
            >
              <FiHeart size={18} fill={isFavorite ? 'var(--accent)' : 'none'} />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>

          {movie.tracks && movie.tracks.length > 0 && (
            <div className="movie-detail__tracks">
              <h3 className="movie-detail__tracks-title">Саундтреки</h3>
              <ul className="movie-detail__tracks-list">
                {movie.tracks.map((track) => (
                  <li key={track.id} className="movie-detail__track">
                    <span className="movie-detail__track-title">{track.title}</span>
                    <span className="movie-detail__track-artist">{track.artist}</span>
                    {track.spotify_url && (
                      <a
                        href={track.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="movie-detail__track-link"
                      >
                        Слушать
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="movie-detail__comments">
        <CommentSection itemType="movie" itemId={id} />
      </div>
    </div>
  )
}
