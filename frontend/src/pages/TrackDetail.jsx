import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiPlay, FiHeart } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import CommentSection from '../components/CommentSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './TrackDetail.css'

export default function TrackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchTrack()
    checkFavorite()
  }, [id])

  const fetchTrack = async () => {
    try {
      const res = await api.get(`/tracks/${id}`)
      setTrack(res.data)
    } catch {
      showToast('Трек не найден', 'error')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    try {
      const res = await api.get(`/favorites/check?item_type=track&item_id=${id}`)
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
      await api.post('/favorites/toggle', { item_type: 'track', item_id: id })
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

  if (!track) return null

  return (
    <div className="track-detail page">
      <div className="track-detail__backdrop">
        <img
          src={track.cover_url || 'https://via.placeholder.com/1920x600?text=No+Backdrop'}
          alt={track.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1920x600?text=No+Backdrop'
          }}
        />
        <div className="track-detail__backdrop-overlay" />
      </div>

      <div className="track-detail__container">
        <div className="track-detail__cover">
          <img
            src={track.cover_url || 'https://via.placeholder.com/300x300?text=No+Cover'}
            alt={track.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Cover'
            }}
          />
        </div>

        <div className="track-detail__info">
          <h1 className="track-detail__title">{track.title}</h1>

          <p className="track-detail__artist">{track.artist || 'Неизвестный исполнитель'}</p>

          {track.movie_title && (
            <p className="track-detail__movie">
              из фильма «
              <a href={`/movie/${track.movie_id}`} className="track-detail__movie-link">
                {track.movie_title}
              </a>
              »
            </p>
          )}

          <div className="track-detail__actions">
            {track.spotify_url && (
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="track-detail__btn track-detail__btn--primary"
              >
                <FiPlay size={18} />
                Слушать на Spotify
              </a>
            )}
            <button
              className={`track-detail__btn track-detail__btn--favorite ${isFavorite ? 'track-detail__btn--favorite-active' : ''}`}
              onClick={handleToggleFavorite}
            >
              <FiHeart size={18} fill={isFavorite ? 'var(--accent)' : 'none'} />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>

          {track.movie_id && (
            <button
              className="track-detail__btn track-detail__btn--secondary"
              onClick={() => handleSearch(`${track.movie_title} саундтрек`)}
            >
              Найти саундтреки
            </button>
          )}
        </div>
      </div>

      <div className="track-detail__comments">
        <CommentSection itemType="track" itemId={id} />
      </div>
    </div>
  )
}
