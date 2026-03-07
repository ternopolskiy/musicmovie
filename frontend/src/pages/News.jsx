import { useState, useEffect } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'
import './News.css'

export default function News() {
  const { showToast } = useToast()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await api.get('/news', { params: { limit: 50 } })
      setNews(res.data.items || [])
    } catch {
      showToast('Ошибка загрузки', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="news page">
      <div className="news__header">
        <h1 className="news__title">Новости</h1>
      </div>

      <div className="news__content">
        {loading ? (
          <LoadingSpinner size={60} text="Загрузка..." />
        ) : news.length === 0 ? (
          <div className="news__empty">
            <p>Новостей пока нет</p>
          </div>
        ) : (
          <div className="news__grid">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.source_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card"
              >
                {item.image_url && (
                  <div className="news-card__image">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
                      }}
                    />
                  </div>
                )}
                <div className="news-card__content">
                  <h3 className="news-card__title">{item.title}</h3>
                  {item.description && (
                    <p className="news-card__description">
                      {item.description.length > 150
                        ? `${item.description.slice(0, 150)}...`
                        : item.description}
                    </p>
                  )}
                  <div className="news-card__meta">
                    <span className="news-card__date">{formatDate(item.date || item.created_at)}</span>
                    <FiExternalLink size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
