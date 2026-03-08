import { Link } from 'react-router-dom'
import { FiHeart, FiPlay } from 'react-icons/fi'
import './TrackCard.css'

export default function TrackCard({ track, onToggleFavorite, isFavorite = false }) {
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.('track', track.id)
  }

  return (
    <Link to={`/track/${track.id}`} className="track-card">
      <div className="track-card__image">
        <img
          src={track.cover_url || 'https://via.placeholder.com/300x300?text=No+Cover'}
          alt={track.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Cover'
          }}
        />
        <div className="track-card__overlay">
          <a
            href={track.spotify_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="track-card__play"
            onClick={(e) => e.stopPropagation()}
          >
            <FiPlay size={24} fill="#fff" />
          </a>
          <button
            className={`track-card__favorite ${isFavorite ? 'track-card__favorite--active' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <FiHeart
              size={20}
              fill={isFavorite ? '#fff' : 'none'}
              stroke="#fff"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
      <div className="track-card__content">
        <h3 className="track-card__title">{track.title}</h3>
        <p className="track-card__artist">{track.artist || 'Неизвестный исполнитель'}</p>
        {track.movie_title && (
          <p className="track-card__movie">из фильма «{track.movie_title}»</p>
        )}
      </div>
    </Link>
  )
}
