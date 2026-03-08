import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { useToast } from '../contexts/ToastContext'
import api from '../api/axios'
import './Contacts.css'

export default function Contacts() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/contact', formData)
      showToast('Сообщение отправлено!', 'success')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      showToast('Ошибка отправки', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contacts page">
      <div className="contacts__header">
        <h1 className="contacts__title">Контакты</h1>
        <p className="contacts__subtitle">
          Свяжитесь с нами любым удобным способом
        </p>
      </div>

      <div className="contacts__container">
        <div className="contacts__info">
          <div className="contacts__card">
            <FiMail className="contacts__icon" />
            <h3>Email</h3>
            <a href="mailto:spotik.akount@gmail.com">spotik.akount@gmail.com</a>
          </div>

          <div className="contacts__card">
            <FiPhone className="contacts__icon" />
            <h3>Телефон</h3>
            <a href="tel:+79237008277">+7 (923) 700-82-77</a>
          </div>

          <div className="contacts__card">
            <FiMapPin className="contacts__icon" />
            <h3>Адрес</h3>
            <p>Новосибирск, Россия</p>
          </div>
        </div>

        <form className="contacts__form" onSubmit={handleSubmit}>
          <h2 className="contacts__form-title">Напишите нам</h2>

          <div className="contacts__field">
            <label>Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              required
            />
          </div>

          <div className="contacts__field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="contacts__field">
            <label>Сообщение</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ваше сообщение..."
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className="contacts__submit"
            disabled={submitting}
          >
            <FiSend size={18} />
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  )
}
