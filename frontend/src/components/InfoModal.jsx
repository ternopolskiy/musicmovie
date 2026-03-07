import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import './InfoModal.css'

export default function InfoModal({ title, children, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal__header">
          <h2>{title}</h2>
          <button className="info-modal__close" onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>
        <div className="info-modal__body">{children}</div>
      </div>
    </div>
  )
}
