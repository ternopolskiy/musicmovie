import { Link } from 'react-router-dom'
import { FiMessageSquare, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import './ForumPostCard.css'

export default function ForumPostCard({ post, onVote }) {
  const handleUpvote = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onVote?.(post.id, 1)
  }

  const handleDownvote = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onVote?.(post.id, -1)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Только что'
    if (hours < 24) return `${hours} ч. назад`
    if (days < 7) return `${days} дн. назад`
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <Link to={`/forum/${post.id}`} className="forum-post-card">
      <div className="forum-post-card__votes">
        <button
          className={`forum-post-card__vote ${post.user_vote === 1 ? 'forum-post-card__vote--up' : ''}`}
          onClick={handleUpvote}
        >
          <FiArrowUp size={20} />
        </button>
        <span className={`forum-post-card__rating ${post.rating > 0 ? 'forum-post-card__rating--positive' : post.rating < 0 ? 'forum-post-card__rating--negative' : ''}`}>
          {post.rating}
        </span>
        <button
          className={`forum-post-card__vote ${post.user_vote === -1 ? 'forum-post-card__vote--down' : ''}`}
          onClick={handleDownvote}
        >
          <FiArrowDown size={20} />
        </button>
      </div>

      <div className="forum-post-card__content">
        <h3 className="forum-post-card__title">{post.title}</h3>
        <p className="forum-post-card__preview">
          {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
        </p>
        <div className="forum-post-card__meta">
          <span className="forum-post-card__author">{post.author?.username || 'Аноним'}</span>
          <span className="forum-post-card__time">{formatDate(post.created_at)}</span>
          <span className="forum-post-card__comments">
            <FiMessageSquare size={14} />
            {post.comments_count}
          </span>
        </div>
      </div>
    </Link>
  )
}
