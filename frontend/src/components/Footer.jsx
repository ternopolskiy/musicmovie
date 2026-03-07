import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiInfo, FiFileText, FiHelpCircle, FiX } from 'react-icons/fi'
import InfoModal from './InfoModal'
import './Footer.css'

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null)

  const modals = {
    about: {
      title: 'О проекте',
      content: (
        <>
          <p>MusicMovie — это уникальная платформа, объединяющая миры музыки и кино.</p>
          <p>Мы помогаем пользователям находить саундтреки к любимым фильмам, открывать новые музыкальные композиции и делиться своими впечатлениями.</p>
          <p>Наша миссия — создать сообщество ценителей качественного контента, где каждый может найти что-то особенное.</p>
        </>
      ),
    },
    policy: {
      title: 'Политика конфиденциальности',
      content: (
        <>
          <p>Мы уважаем вашу конфиденциальность и защищаем персональные данные.</p>
          <p>Собранная информация используется только для предоставления услуг платформы.</p>
          <p>Мы не передаем данные третьим лицам без вашего согласия.</p>
        </>
      ),
    },
    help: {
      title: 'Помощь',
      content: (
        <>
          <p>Если у вас возникли вопросы, свяжитесь с нами через страницу «Контакты».</p>
          <p>Также вы можете посетить наш форум, где сообщество поможет вам.</p>
        </>
      ),
    },
  }

  return (
    <>
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__section">
            <h3 className="footer__title">MusicMovie</h3>
            <p className="footer__text">
              Ваш гид в мире музыки и кино
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Информация</h4>
            <ul className="footer__links">
              <li>
                <button onClick={() => setActiveModal('about')}>
                  <FiInfo size={16} />
                  О проекте
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('policy')}>
                  <FiFileText size={16} />
                  Политика
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('help')}>
                  <FiHelpCircle size={16} />
                  Помощь
                </button>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Навигация</h4>
            <ul className="footer__links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/forum">Форум</Link></li>
              <li><Link to="/news">Новости</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} MusicMovie. Все права защищены.</p>
        </div>
      </footer>

      {activeModal && (
        <InfoModal
          title={modals[activeModal].title}
          onClose={() => setActiveModal(null)}
        >
          {modals[activeModal].content}
        </InfoModal>
      )}
    </>
  )
}
