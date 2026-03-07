import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useToast } from '../contexts/ToastContext'
import AuthModal from './AuthModal'
import {
  FiMusic,
  FiHeart,
  FiLogOut,
  FiSettings,
  FiUser,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import './Header.css'

export default function Header() {
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [showAuth, setShowAuth] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    showToast('Вы вышли из аккаунта', 'info')
    navigate('/')
  }

  const navItems = [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/forum', label: 'Форум' },
    { to: '/news', label: 'Новости' },
    { to: '/contacts', label: 'Контакты' },
  ]

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="header__logo" onClick={() => setMobileMenu(false)}>
            <FiMusic size={28} className="header__logo-icon" />
            <span className="header__logo-text">
              Music<span className="header__logo-accent">Movie</span>
            </span>
          </Link>

          <nav className={`header__nav ${mobileMenu ? 'header__nav--open' : ''}`}>
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                }
                onClick={() => setMobileMenu(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            {isAuthenticated ? (
              <div className="header__user">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="header__icon-btn" title="Админ-панель">
                    <FiSettings size={20} />
                  </Link>
                )}
                <Link to="/favorites" className="header__icon-btn" title="Избранное">
                  <FiHeart size={20} />
                </Link>
                <div className="header__user-info">
                  <FiUser size={16} />
                  <span>{user?.username}</span>
                </div>
                <button className="header__icon-btn" onClick={handleLogout} title="Выйти">
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <button className="header__login-btn" onClick={() => setShowAuth(true)}>
                Войти
              </button>
            )}

            <button
              className="header__burger"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
