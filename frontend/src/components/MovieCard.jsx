import { Link } from 'react-router-dom'
import { FiHeart, FiPlay } from 'react-icons/fi'
import './MovieCard.css'

export default function MovieCard({ movie, onToggleFavorite, isFavorite = false }) {
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.('movie', movie.id)
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card__image">
        <img
          src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
          alt={movie.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'
          }}
        />
        <div className="movie-card__overlay">
          <button
            className={`movie-card__favorite ${isFavorite ? 'movie-card__favorite--active' : ''}`}
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
      <div className="movie-card__content">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__meta">
          {movie.year && <span>{movie.year}</span>}
          {movie.director && <span>{movie.director}</span>}
        </p>
        {movie.genres && (
          <p className="movie-card__genres">{movie.genres}</p>
        )}
      </div>
    </Link>
  )
}
