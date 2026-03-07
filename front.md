Структура файлов
text

frontend/
├── index.html
├── vite.config.js
├── .env
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   └── axios.js
    ├── contexts/
    │   └── ToastContext.jsx
    ├── store/
    │   ├── store.js
    │   └── authSlice.js
    ├── components/
    │   ├── Header.jsx / .css
    │   ├── Footer.jsx / .css
    │   ├── AuthModal.jsx / .css
    │   ├── MovieCard.jsx / .css
    │   ├── TrackCard.jsx / .css
    │   ├── CommentSection.jsx / .css
    │   ├── ForumPostCard.jsx / .css
    │   ├── InfoModal.jsx / .css
    │   ├── LoadingSpinner.jsx / .css
    │   ├── HeroSlider.jsx / .css
    │   ├── ProtectedRoute.jsx
    │   └── AdminRoute.jsx
    └── pages/
        ├── Home.jsx / .css
        ├── Catalog.jsx / .css
        ├── MovieDetail.jsx / .css
        ├── TrackDetail.jsx / .css
        ├── Forum.jsx / .css
        ├── ForumPostDetail.jsx / .css
        ├── News.jsx / .css
        ├── Contacts.jsx / .css
        ├── Favorites.jsx / .css
        └── Admin.jsx / .css
Конфигурационные файлы
.env
env

VITE_API_URL=http://localhost:8000
vite.config.js
JavaScript

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
index.html
HTML

<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MusicMovie</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
Точка входа и главный модуль
src/main.jsx
React

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastProvider } from './contexts/ToastContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
src/index.css
CSS

/* ===== CSS Variables ===== */
:root {
  --bg-primary: #121212;
  --bg-secondary: #181818;
  --bg-tertiary: #282828;
  --bg-highlight: #333333;
  --bg-card: #1e1e1e;
  --accent: #1DB954;
  --accent-hover: #1ed760;
  --accent-dark: #178f43;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-muted: #727272;
  --danger: #e74c3c;
  --danger-hover: #c0392b;
  --warning: #f39c12;

  --reddit-orange: #FF4500;
  --reddit-orange-hover: #ff5722;
  --reddit-blue: #7193FF;
  --reddit-blue-hover: #5a7de6;
  --reddit-bg: #030303;
  --reddit-card: #1A1A1B;
  --reddit-border: #343536;
  --reddit-hover: #252526;
  --reddit-text: #D7DADC;

  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-pill: 50px;
  --transition-fast: all 0.15s ease;
  --transition: all 0.25s ease;
  --transition-slow: all 0.4s ease;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.6);
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ===== Reset & Base ===== */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
  border: none;
  outline: none;
}

input, textarea, select {
  font-family: inherit;
  outline: none;
}

ul, ol {
  list-style: none;
}

img {
  max-width: 100%;
  display: block;
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--bg-highlight);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ===== Animations ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
}

.page-enter {
  animation: fadeInUp 0.5s ease forwards;
}
src/App.jsx
React

import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from './store/authSlice'

import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import MovieDetail from './pages/MovieDetail'
import TrackDetail from './pages/TrackDetail'
import Forum from './pages/Forum'
import ForumPostDetail from './pages/ForumPostDetail'
import News from './pages/News'
import Contacts from './pages/Contacts'
import Favorites from './pages/Favorites'
import Admin from './pages/Admin'

export default function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/track/:id" element={<TrackDetail />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumPostDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
API Layer
src/api/axios.js
JavaScript

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
    }
    return Promise.reject(error)
  }
)

export default api
Contexts
src/contexts/ToastContext.jsx
React

import { createContext, useContext, useState, useCallback } from 'react'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'
import './Toast.css'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, exiting: false }])
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
    info: <FiInfo size={20} />,
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type} ${toast.exiting ? 'toast--exit' : ''}`}
          >
            <span className="toast__icon">{icons[toast.type]}</span>
            <span className="toast__message">{toast.message}</span>
            <button className="toast__close" onClick={() => removeToast(toast.id)}>
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
src/contexts/Toast.css
CSS

.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--border-radius);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: var(--shadow);
  animation: toastIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
  backdrop-filter: blur(10px);
}

.toast--exit {
  animation: toastOut 0.3s ease forwards;
}

.toast--success {
  background: linear-gradient(135deg, #1DB954, #178f43);
  border-left: 4px solid #15803d;
}

.toast--error {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-left: 4px solid #a93226;
}

.toast--info {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-left: 4px solid #21618c;
}

.toast__icon {
  display: flex;
  flex-shrink: 0;
}

.toast__message {
  flex: 1;
}

.toast__close {
  display: flex;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.toast__close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}
Redux Store
src/store/store.js
JavaScript

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
src/store/authSlice.js
JavaScript

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return rejectWithValue('No token')
  try {
    const res = await api.get('/auth/me')
    return res.data
  } catch {
    localStorage.removeItem('access_token')
    return rejectWithValue('Invalid token')
  }
})

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const formData = new URLSearchParams()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('access_token', res.data.access_token)
    const userRes = await api.get('/auth/me')
    return userRes.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Ошибка входа')
  }
})

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    await api.post('/auth/register', data)
    const formData = new URLSearchParams()
    formData.append('username', data.email)
    formData.append('password', data.password)
    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('access_token', res.data.access_token)
    const userRes = await api.get('/auth/me')
    return userRes.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Ошибка регистрации')
  }
})

export const fetchFavorites = createAsyncThunk('auth/fetchFavorites', async () => {
  const res = await api.get('/favorites')
  return res.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    favorites: [],
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('access_token')
      state.user = null
      state.isAuthenticated = false
      state.favorites = []
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
    setFavorites(state, action) {
      state.favorites = action.payload
    },
    addFavoriteLocal(state, action) {
      state.favorites.push(action.payload)
    },
    removeFavoriteLocal(state, action) {
      const { item_type, item_id } = action.payload
      state.favorites = state.favorites.filter(
        (f) => !(f.item_type === item_type && f.item_id === item_id)
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload
      })
  },
})

export const { logout, clearError, setFavorites, addFavoriteLocal, removeFavoriteLocal } =
  authSlice.actions
export default authSlice.reducer
Компоненты
src/components/LoadingSpinner.jsx
React

import './LoadingSpinner.css'

export default function LoadingSpinner({ size = 40, text = '' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" style={{ width: size, height: size }}>
        <svg viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="90, 150"
            strokeDashoffset="0"
          />
        </svg>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}
src/components/LoadingSpinner.css
CSS

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  animation: spin 0.9s linear infinite;
}

.spinner svg {
  width: 100%;
  height: 100%;
}

.spinner-text {
  color: var(--text-secondary);
  font-size: 14px;
}
src/components/InfoModal.jsx
React

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
src/components/InfoModal.css
CSS

.info-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(4px);
}

.info-modal {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 560px;
  max-height: 80vh;
  overflow-y: auto;
  animation: scaleIn 0.3s ease;
  border: 1px solid var(--bg-highlight);
}

.info-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--bg-highlight);
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 1;
}

.info-modal__header h2 {
  font-size: 20px;
  font-weight: 700;
}

.info-modal__close {
  background: none;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 50%;
  display: flex;
  transition: var(--transition-fast);
}

.info-modal__close:hover {
  color: var(--text-primary);
  background: var(--bg-highlight);
}

.info-modal__body {
  padding: 24px;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 14px;
}

.info-modal__body p {
  margin-bottom: 12px;
}
src/components/ProtectedRoute.jsx
React

import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((s) => s.auth)

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/" replace />
  return children
}
src/components/AdminRoute.jsx
React

import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth)

  if (loading) return null
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}
src/components/Header.jsx
React

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
src/components/Header.css
CSS

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(18, 18, 18, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  height: 64px;
}

.header__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header__logo-icon {
  color: var(--accent);
}

.header__logo-text {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.header__logo-accent {
  color: var(--accent);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header__nav-link {
  padding: 8px 16px;
  border-radius: var(--border-radius-pill);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition-fast);
  position: relative;
}

.header__nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.header__nav-link--active {
  color: var(--text-primary);
  background: var(--bg-highlight);
}

.header__nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-pill);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.header__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: none;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.header__icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.header__login-btn {
  padding: 10px 28px;
  border-radius: var(--border-radius-pill);
  background: var(--accent);
  color: #000;
  font-weight: 700;
  font-size: 14px;
  transition: var(--transition);
  letter-spacing: 0.3px;
}

.header__login-btn:hover {
  background: var(--accent-hover);
  transform: scale(1.03);
}

.header__burger {
  display: none;
  background: none;
  color: var(--text-primary);
  padding: 4px;
}

@media (max-width: 768px) {
  .header__nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-primary);
    flex-direction: column;
    padding: 24px;
    gap: 4px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .header__nav--open {
    transform: translateX(0);
  }

  .header__nav-link {
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
    border-radius: var(--border-radius);
  }

  .header__burger {
    display: flex;
  }

  .header__user-info {
    display: none;
  }
}
src/components/AuthModal.jsx
React

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register, clearError } from '../store/authSlice'
import { useToast } from '../contexts/ToastContext'
import { FiX, FiMail, FiLock, FiUser, FiMusic } from 'react-icons/fi'
import './AuthModal.css'

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const dispatch = useDispatch()
  const { error, isAuthenticated, loading } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      dispatch(clearError())
    }
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      showToast('Добро пожаловать!', 'success')
      onClose()
    }
  }, [isAuthenticated, onClose, showToast])

  useEffect(() => {
    dispatch(clearError())
    setForm({ username: '', email: '', password: '' })
  }, [tab, dispatch])

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (tab === 'login') {
      dispatch(login({ email: form.email, password: form.password }))
    } else {
      dispatch(
        register({
          username: form.username,
          email: form.email,
          password: form.password,
        })
      )
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose}>
          <FiX size={22} />
        </button>

        <div className="auth-modal__header">
          <FiMusic size={36} className="auth-modal__icon" />
          <h2>MusicMovie</h2>
        </div>

        <div className="auth-modal__tabs">
          <button
            className={`auth-modal__tab ${tab === 'login' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => setTab('login')}
          >
            Вход
          </button>
          <button
            className={`auth-modal__tab ${tab === 'register' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => setTab('register')}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          {tab === 'register' && (
            <div className="auth-modal__field">
              <FiUser size={18} className="auth-modal__field-icon" />
              <input
                type="text"
                name="username"
                placeholder="Имя пользователя"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>
          )}
          <div className="auth-modal__field">
            <FiMail size={18} className="auth-modal__field-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-modal__field">
            <FiLock size={18} className="auth-modal__field-icon" />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="auth-modal__error">
              {typeof error === 'string' ? error : 'Произошла ошибка'}
            </p>
          )}

          <button type="submit" className="auth-modal__submit" disabled={loading}>
            {loading ? 'Загрузка...' : tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>

          <div className="auth-modal__divider">
            <span>или</span>
          </div>

          <button type="button" className="auth-modal__spotify">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span>Войти через Spotify</span>
          </button>
        </form>
      </div>
    </div>
  )
}
src/components/AuthModal.css
CSS

.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(6px);
}

.auth-modal {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  padding: 40px;
  width: 90%;
  max-width: 420px;
  position: relative;
  animation: scaleIn 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.auth-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 50%;
  display: flex;
  transition: var(--transition-fast);
}

.auth-modal__close:hover {
  color: var(--text-primary);
  background: var(--bg-highlight);
}

.auth-modal__header {
  text-align: center;
  margin-bottom: 28px;
}

.auth-modal__icon {
  color: var(--accent);
  margin-bottom: 12px;
}

.auth-modal__header h2 {
  font-size: 26px;
  font-weight: 800;
}

.auth-modal__tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-pill);
  padding: 4px;
  margin-bottom: 28px;
}

.auth-modal__tab {
  flex: 1;
  padding: 10px;
  border-radius: var(--border-radius-pill);
  background: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition-fast);
}

.auth-modal__tab--active {
  background: var(--bg-highlight);
  color: var(--text-primary);
}

.auth-modal__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-modal__field {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-modal__field-icon {
  position: absolute;
  left: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.auth-modal__field input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  background: var(--bg-primary);
  border: 1px solid var(--bg-highlight);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition-fast);
}

.auth-modal__field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.15);
}

.auth-modal__field input::placeholder {
  color: var(--text-muted);
}

.auth-modal__error {
  color: var(--danger);
  font-size: 13px;
  text-align: center;
  padding: 8px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: var(--border-radius);
}

.auth-modal__submit {
  padding: 14px;
  border-radius: var(--border-radius-pill);
  background: var(--accent);
  color: #000;
  font-weight: 700;
  font-size: 15px;
  transition: var(--transition);
  letter-spacing: 0.3px;
}

.auth-modal__submit:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.02);
}

.auth-modal__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-modal__divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.auth-modal__divider::before,
.auth-modal__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--bg-highlight);
}

.auth-modal__spotify {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: var(--border-radius-pill);
  background: transparent;
  border: 1px solid var(--bg-highlight);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
}

.auth-modal__spotify:hover {
  background: var(--bg-tertiary);
  border-color: #1DB954;
}
src/components/HeroSlider.jsx
React

import { useState, useEffect } from 'react'
import './HeroSlider.css'

const slides = [
  {
    gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    title: 'Откройте мир саундтреков',
    subtitle: 'Музыка, которая делает кино незабываемым',
  },
  {
    gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    title: 'Ваши любимые фильмы',
    subtitle: 'Коллекция фильмов с лучшими саундтреками',
  },
  {
    gradient: 'linear-gradient(135deg, #0d1117, #161b22, #1f2937)',
    title: 'Обсуждайте и делитесь',
    subtitle: 'Сообщество ценителей музыки из кино',
  },
  {
    gradient: 'linear-gradient(135deg, #1b1b2f, #162447, #1f4068)',
    title: 'Сохраняйте избранное',
    subtitle: 'Создавайте свою коллекцию лучшего',
  },
]

export default function HeroSlider({ stats }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
          style={{ background: slide.gradient }}
        />
      ))}

      <div className="hero__content">
        <h1 className="hero__title" key={`t-${current}`}>
          {slides[current].title}
        </h1>
        <p className="hero__subtitle" key={`s-${current}`}>
          {slides[current].subtitle}
        </p>

        {stats && (
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">{stats.tracks_count || 0}</span>
              <span className="hero__stat-label">Треков</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">{stats.movies_count || 0}</span>
              <span className="hero__stat-label">Фильмов</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">{stats.users_count || 0}</span>
              <span className="hero__stat-label">Пользователей</span>
            </div>
          </div>
        )}

        <div className="hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
src/components/HeroSlider.css
CSS

.hero {
  position: relative;
  height: 480px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease;
}

.hero__slide--active {
  opacity: 1;
}

.hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
}

.hero__title {
  font-size: 52px;
  font-weight: 900;
  margin-bottom: 14px;
  letter-spacing: -1px;
  animation: fadeInUp 0.7s ease;
  background: linear-gradient(to right, #fff, #b3b3b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 36px;
  animation: fadeInUp 0.7s ease 0.1s both;
}

.hero__stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  padding: 18px 36px;
  border-radius: var(--border-radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: fadeInUp 0.7s ease 0.2s both;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hero__stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
}

.hero__stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero__stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
}

.hero__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.hero__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  transition: var(--transition);
}

.hero__dot--active {
  background: var(--accent);
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .hero {
    height: 400px;
  }
  .hero__title {
    font-size: 32px;
  }
  .hero__subtitle {
    font-size: 16px;
  }
  .hero__stats {
    flex-direction: column;
    gap: 12px;
    padding: 18px 28px;
  }
  .hero__stat-divider {
    width: 80px;
    height: 1px;
  }
}
src/components/MovieCard.jsx
React

import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addFavoriteLocal, removeFavoriteLocal } from '../store/authSlice'
import { useToast } from '../contexts/ToastContext'
import api from '../api/axios'
import { FiHeart, FiPlay, FiExternalLink, FiFilm } from 'react-icons/fi'
import './MovieCard.css'

export default function MovieCard({ movie, onAuthRequired }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, favorites } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  const isFav = favorites.some(
    (f) => f.item_type === 'movie' && f.item_id === movie.id
  )

  const handleCardClick = () => {
    navigate(`/catalog?search=${encodeURIComponent(movie.title)}`)
  }

  const handleTitleClick = (e) => {
    e.stopPropagation()
    navigate(`/movie/${movie.id}`)
  }

  const handleTrailer = (e) => {
    e.stopPropagation()
    const q = movie.trailer_query || `${movie.title} трейлер`
    window.open(
      `https://yandex.ru/video/search?text=${encodeURIComponent(q)}`,
      '_blank'
    )
  }

  const handleWatch = (e) => {
    e.stopPropagation()
    const q = movie.watch_query || `${movie.title} смотреть онлайн`
    window.open(
      `https://yandex.ru/video/search?text=${encodeURIComponent(q)}`,
      '_blank'
    )
  }

  const toggleFav = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }
    try {
      if (isFav) {
        await api.delete(`/favorites/movie/${movie.id}`)
        dispatch(removeFavoriteLocal({ item_type: 'movie', item_id: movie.id }))
        showToast('Удалено из избранного', 'info')
      } else {
        const res = await api.post('/favorites', {
          item_type: 'movie',
          item_id: movie.id,
        })
        dispatch(addFavoriteLocal(res.data))
        showToast('Добавлено в избранное', 'success')
      }
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-card__poster" onClick={handleTitleClick}>
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} loading="lazy" />
        ) : (
          <div className="movie-card__poster-placeholder">
            <FiFilm size={40} />
          </div>
        )}
        <div className="movie-card__poster-overlay">
          <FiPlay size={40} />
        </div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title" onClick={handleTitleClick}>
          {movie.title}
        </h3>
        <p className="movie-card__meta">
          {movie.year} {movie.director && `· ${movie.director}`}
        </p>
        {movie.genres && (
          <p className="movie-card__genres">{movie.genres}</p>
        )}

        <div className="movie-card__actions">
          <button className="movie-card__btn movie-card__btn--trailer" onClick={handleTrailer}>
            <FiPlay size={14} />
            <span>Трейлер</span>
          </button>
          <button className="movie-card__btn movie-card__btn--watch" onClick={handleWatch}>
            <FiExternalLink size={14} />
            <span>Смотреть</span>
          </button>
          <button
            className={`movie-card__fav ${isFav ? 'movie-card__fav--active' : ''}`}
            onClick={toggleFav}
          >
            <FiHeart size={18} fill={isFav ? 'var(--accent)' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}
src/components/MovieCard.css
CSS

.movie-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
}

.movie-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow);
  border-color: rgba(255, 255, 255, 0.06);
}

.movie-card__poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.movie-card__poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.movie-card:hover .movie-card__poster img {
  transform: scale(1.06);
}

.movie-card__poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background: var(--bg-tertiary);
}

.movie-card__poster-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--accent);
}

.movie-card:hover .movie-card__poster-overlay {
  opacity: 1;
}

.movie-card__info {
  padding: 16px;
}

.movie-card__title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.2s;
}

.movie-card__title:hover {
  color: var(--accent);
}

.movie-card__meta {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.movie-card__genres {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.movie-card__btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: var(--border-radius-pill);
  font-size: 12px;
  font-weight: 600;
  transition: var(--transition-fast);
}

.movie-card__btn--trailer {
  background: var(--accent);
  color: #000;
}

.movie-card__btn--trailer:hover {
  background: var(--accent-hover);
}

.movie-card__btn--watch {
  background: var(--bg-highlight);
  color: var(--text-primary);
}

.movie-card__btn--watch:hover {
  background: var(--bg-tertiary);
}

.movie-card__fav {
  margin-left: auto;
  background: none;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 50%;
  display: flex;
  transition: var(--transition-fast);
}

.movie-card__fav:hover {
  color: var(--accent);
  background: rgba(29, 185, 84, 0.1);
}

.movie-card__fav--active {
  color: var(--accent);
}
src/components/TrackCard.jsx
React

import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addFavoriteLocal, removeFavoriteLocal } from '../store/authSlice'
import { useToast } from '../contexts/ToastContext'
import api from '../api/axios'
import { FiHeart, FiMusic, FiExternalLink } from 'react-icons/fi'
import './TrackCard.css'

export default function TrackCard({ track, onAuthRequired }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, favorites } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  const isFav = favorites.some(
    (f) => f.item_type === 'track' && f.item_id === track.id
  )

  const handleCardClick = () => {
    navigate(`/catalog?search=${encodeURIComponent(track.title)}`)
  }

  const handleTitleClick = (e) => {
    e.stopPropagation()
    navigate(`/track/${track.id}`)
  }

  const handleListen = (e) => {
    e.stopPropagation()
    if (track.spotify_url) {
      window.open(track.spotify_url, '_blank')
    }
  }

  const toggleFav = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }
    try {
      if (isFav) {
        await api.delete(`/favorites/track/${track.id}`)
        dispatch(removeFavoriteLocal({ item_type: 'track', item_id: track.id }))
        showToast('Удалено из избранного', 'info')
      } else {
        const res = await api.post('/favorites', {
          item_type: 'track',
          item_id: track.id,
        })
        dispatch(addFavoriteLocal(res.data))
        showToast('Добавлено в избранное', 'success')
      }
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  return (
    <div className="track-card" onClick={handleCardClick}>
      <div className="track-card__cover" onClick={handleTitleClick}>
        {track.cover_url ? (
          <img src={track.cover_url} alt={track.title} loading="lazy" />
        ) : (
          <div className="track-card__cover-placeholder">
            <FiMusic size={36} />
          </div>
        )}
        <div className="track-card__play-overlay">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="var(--accent)">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>

      <div className="track-card__info">
        <h3 className="track-card__title" onClick={handleTitleClick}>
          {track.title}
        </h3>
        <p className="track-card__artist">{track.artist}</p>
        {track.movie_title && (
          <p className="track-card__movie">
            <FiMusic size={11} />
            {track.movie_title}
          </p>
        )}

        <div className="track-card__actions">
          <button className="track-card__btn" onClick={handleListen}>
            <FiExternalLink size={14} />
            <span>Слушать</span>
          </button>
          <button
            className={`track-card__fav ${isFav ? 'track-card__fav--active' : ''}`}
            onClick={toggleFav}
          >
            <FiHeart size={18} fill={isFav ? 'var(--accent)' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}
src/components/TrackCard.css
CSS

.track-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
}

.track-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow);
  border-color: rgba(255, 255, 255, 0.06);
}

.track-card__cover {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.track-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.track-card:hover .track-card__cover img {
  transform: scale(1.06);
}

.track-card__cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
}

.track-card__play-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 48px;
  height: 48px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.track-card__play-overlay svg {
  fill: #000;
  margin-left: 3px;
}

.track-card:hover .track-card__play-overlay {
  opacity: 1;
  transform: translateY(0);
}

.track-card__info {
  padding: 16px;
}

.track-card__title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.2s;
}

.track-card__title:hover {
  color: var(--accent);
}

.track-card__artist {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.track-card__movie {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.track-card__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.track-card__btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: var(--border-radius-pill);
  background: var(--accent);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  transition: var(--transition-fast);
}

.track-card__btn:hover {
  background: var(--accent-hover);
}

.track-card__fav {
  margin-left: auto;
  background: none;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 50%;
  display: flex;
  transition: var(--transition-fast);
}

.track-card__fav:hover {
  color: var(--accent);
  background: rgba(29, 185, 84, 0.1);
}

.track-card__fav--active {
  color: var(--accent);
}
src/components/CommentSection.jsx
React

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import { FiSend, FiTrash2, FiUser, FiClock } from 'react-icons/fi'
import './CommentSection.css'

export default function CommentSection({ itemType, itemId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments?item_type=${itemType}&item_id=${itemId}`)
      setComments(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [itemType, itemId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      const res = await api.post('/comments', {
        item_type: itemType,
        item_id: itemId,
        text: text.trim(),
      })
      setComments((prev) => [...prev, res.data])
      setText('')
      showToast('Комментарий добавлен', 'success')
    } catch {
      showToast('Ошибка при добавлении комментария', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`)
      setComments((prev) => prev.filter((c) => c.id !== id))
      showToast('Комментарий удален', 'info')
    } catch {
      showToast('Ошибка при удалении', 'error')
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="comments">
      <h3 className="comments__title">
        Комментарии
        <span className="comments__count">{comments.length}</span>
      </h3>

      {isAuthenticated ? (
        <form className="comments__form" onSubmit={handleSubmit}>
          <div className="comments__input-wrapper">
            <textarea
              className="comments__input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишите комментарий..."
              rows={3}
            />
            <button
              type="submit"
              className="comments__submit"
              disabled={!text.trim()}
            >
              <FiSend size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div className="comments__login-prompt">
          <FiUser size={18} />
          <span>Войдите, чтобы оставить комментарий</span>
        </div>
      )}

      <div className="comments__list">
        {loading ? (
          <p className="comments__empty">Загрузка...</p>
        ) : comments.length === 0 ? (
          <p className="comments__empty">Пока нет комментариев</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment">
              <div className="comment__header">
                <div className="comment__avatar">
                  <FiUser size={14} />
                </div>
                <span className="comment__author">{c.username || 'Пользователь'}</span>
                <span className="comment__date">
                  <FiClock size={12} />
                  {formatDate(c.created_at)}
                </span>
                {user?.role === 'admin' && (
                  <button
                    className="comment__delete"
                    onClick={() => handleDelete(c.id)}
                    title="Удалить"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
              <p className="comment__text">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
src/components/CommentSection.css
CSS

.comments {
  margin-top: 40px;
}

.comments__title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comments__count {
  background: var(--bg-highlight);
  padding: 2px 10px;
  border-radius: var(--border-radius-pill);
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.comments__form {
  margin-bottom: 24px;
}

.comments__input-wrapper {
  position: relative;
}

.comments__input {
  width: 100%;
  padding: 14px 50px 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--bg-highlight);
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: var(--transition-fast);
}

.comments__input:focus {
  border-color: var(--accent);
}

.comments__input::placeholder {
  color: var(--text-muted);
}

.comments__submit {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: var(--accent);
  color: #000;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  transition: var(--transition-fast);
}

.comments__submit:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.1);
}

.comments__submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.comments__login-prompt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 24px;
}

.comments__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comments__empty {
  color: var(--text-muted);
  font-size: 14px;
  padding: 20px 0;
}

.comment {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
}

.comment:hover {
  background: var(--bg-tertiary);
}

.comment__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.comment__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-highlight);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.comment__author {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.comment__date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  margin-left: auto;
}

.comment__delete {
  background: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  transition: var(--transition-fast);
}

.comment__delete:hover {
  color: var(--danger);
  background: rgba(231, 76, 60, 0.1);
}

.comment__text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 36px;
}
src/components/ForumPostCard.jsx
React

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import { FiArrowUp, FiArrowDown, FiMessageSquare, FiUser, FiClock, FiTrash2 } from 'react-icons/fi'
import './ForumPostCard.css'

export default function ForumPostCard({ post, onVote, onDelete }) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  const handleVote = async (e, voteType) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      showToast('Войдите, чтобы голосовать', 'info')
      return
    }
    try {
      const res = await api.post(`/forum/posts/${post.id}/vote`, {
        vote_type: voteType,
      })
      onVote?.(post.id, res.data.rating)
    } catch {
      showToast('Ошибка при голосовании', 'error')
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    try {
      await api.delete(`/forum/posts/${post.id}`)
      onDelete?.(post.id)
      showToast('Пост удален', 'info')
    } catch {
      showToast('Ошибка при удалении', 'error')
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)
    if (diff < 60) return 'только что'
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`
    if (diff < 604800) return `${Math.floor(diff / 86400)} дн. назад`
    return d.toLocaleDateString('ru-RU')
  }

  return (
    <div
      className="forum-post-card"
      onClick={() => navigate(`/forum/${post.id}`)}
    >
      <div className="forum-post-card__votes">
        <button
          className="forum-post-card__vote-btn forum-post-card__vote-btn--up"
          onClick={(e) => handleVote(e, 'upvote')}
        >
          <FiArrowUp size={20} />
        </button>
        <span className="forum-post-card__rating">{post.rating || 0}</span>
        <button
          className="forum-post-card__vote-btn forum-post-card__vote-btn--down"
          onClick={(e) => handleVote(e, 'downvote')}
        >
          <FiArrowDown size={20} />
        </button>
      </div>

      <div className="forum-post-card__content">
        <div className="forum-post-card__meta">
          <FiUser size={12} />
          <span className="forum-post-card__author">{post.username || 'Аноним'}</span>
          <FiClock size={12} />
          <span>{formatDate(post.created_at)}</span>
        </div>

        <h3 className="forum-post-card__title">{post.title}</h3>

        {post.content && (
          <p className="forum-post-card__preview">
            {post.content.length > 200
              ? post.content.substring(0, 200) + '...'
              : post.content}
          </p>
        )}

        <div className="forum-post-card__footer">
          <span className="forum-post-card__comments">
            <FiMessageSquare size={16} />
            <span>{post.comments_count || 0} комментариев</span>
          </span>
          {user?.role === 'admin' && (
            <button className="forum-post-card__delete" onClick={handleDelete}>
              <FiTrash2 size={14} />
              <span>Удалить</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
src/components/ForumPostCard.css
CSS

.forum-post-card {
  display: flex;
  gap: 0;
  background: var(--reddit-card);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition-fast);
  overflow: hidden;
}

.forum-post-card:hover {
  border-color: var(--text-muted);
}

.forum-post-card__votes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 10px;
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  min-width: 50px;
}

.forum-post-card__vote-btn {
  background: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  transition: var(--transition-fast);
}

.forum-post-card__vote-btn--up:hover {
  color: var(--reddit-orange);
  background: rgba(255, 69, 0, 0.1);
}

.forum-post-card__vote-btn--down:hover {
  color: var(--reddit-blue);
  background: rgba(113, 147, 255, 0.1);
}

.forum-post-card__rating {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.forum-post-card__content {
  flex: 1;
  padding: 12px 16px;
  min-width: 0;
}

.forum-post-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.forum-post-card__author {
  color: var(--reddit-text);
  font-weight: 500;
}

.forum-post-card__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--reddit-text);
  margin-bottom: 6px;
  line-height: 1.3;
}

.forum-post-card__preview {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 10px;
}

.forum-post-card__footer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.forum-post-card__comments {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 6px 10px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.forum-post-card__comments:hover {
  background: var(--reddit-hover);
}

.forum-post-card__delete {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  padding: 6px 10px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.forum-post-card__delete:hover {
  background: rgba(231, 76, 60, 0.15);
  color: var(--danger);
}
src/components/Footer.jsx
React

import { useState } from 'react'
import InfoModal from './InfoModal'
import { FiGithub, FiHeart } from 'react-icons/fi'
import './Footer.css'

const modals = {
  about: {
    title: 'О проекте',
    content: (
      <>
        <p>
          <strong>MusicMovie</strong> — это платформа, объединяющая миры музыки и кино.
          Мы помогаем находить саундтреки к любимым фильмам, открывать новую музыку
          и обсуждать все это с единомышленниками.
        </p>
        <p>
          Проект создан для ценителей кинематографа и музыки, которые верят,
          что великий фильм невозможен без великого саундтрека.
        </p>
        <p>
          Мы постоянно пополняем нашу базу данных, добавляя новые фильмы,
          треки и создавая пространство для обсуждений.
        </p>
      </>
    ),
  },
  policy: {
    title: 'Политика конфиденциальности',
    content: (
      <>
        <p>
          Мы серьезно относимся к защите ваших персональных данных.
          Все данные, предоставленные при регистрации, хранятся в зашифрованном виде
          и не передаются третьим лицам.
        </p>
        <p>
          Мы используем файлы cookie для обеспечения наилучшего опыта
          использования сайта. Продолжая использовать сайт, вы соглашаетесь
          с нашей политикой.
        </p>
        <p>
          Если у вас есть вопросы о конфиденциальности, свяжитесь с нами
          через страницу контактов.
        </p>
      </>
    ),
  },
  help: {
    title: 'Помощь',
    content: (
      <>
        <p>
          <strong>Как искать контент?</strong><br />
          Используйте строку поиска на главной странице или в каталоге.
          Поиск работает по названиям фильмов, треков, именам исполнителей и режиссеров.
        </p>
        <p>
          <strong>Как добавить в избранное?</strong><br />
          Нажмите на иконку сердечка на карточке фильма или трека.
          Требуется авторизация.
        </p>
        <p>
          <strong>Как участвовать в обсуждениях?</strong><br />
          Перейдите в раздел «Форум», создайте новый пост или прокомментируйте
          существующий. Также можно оставлять комментарии на страницах фильмов и треков.
        </p>
      </>
    ),
  },
}

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null)

  return (
    <>
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__links">
            <button onClick={() => setActiveModal('about')}>О проекте</button>
            <button onClick={() => setActiveModal('policy')}>Политика</button>
            <button onClick={() => setActiveModal('help')}>Помощь</button>
          </div>
          <div className="footer__copy">
            <span>MusicMovie 2025</span>
            <span className="footer__heart">
              <FiHeart size={14} />
            </span>
          </div>
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
src/components/Footer.css
CSS

.footer {
  background: var(--bg-secondary);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px 0;
  margin-top: auto;
}

.footer__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer__links {
  display: flex;
  gap: 8px;
}

.footer__links button {
  background: none;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: var(--border-radius-pill);
  transition: var(--transition-fast);
}

.footer__links button:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.footer__copy {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.footer__heart {
  color: var(--accent);
  display: flex;
}
Страницы
src/pages/Home.jsx
React

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites } from '../store/authSlice'
import HeroSlider from '../components/HeroSlider'
import MovieCard from '../components/MovieCard'
import TrackCard from '../components/TrackCard'
import AuthModal from '../components/AuthModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiSearch, FiFilm, FiMusic } from 'react-icons/fi'
import './Home.css'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [movies, setMovies] = useState([])
  const [tracks, setTracks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const { isAuthenticated } = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, moviesRes, tracksRes] = await Promise.all([
          api.get('/stats'),
          api.get('/movies'),
          api.get('/tracks'),
        ])
        setStats(statsRes.data)
        setMovies(moviesRes.data)
        setTracks(tracksRes.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites())
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    if (!searchQuery.trim()) {
      const reload = async () => {
        try {
          const [m, t] = await Promise.all([
            api.get('/movies'),
            api.get('/tracks'),
          ])
          setMovies(m.data)
          setTracks(t.data)
        } catch {
          // silent
        }
      }
      reload()
      return
    }

    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`)
        setMovies(res.data.movies || [])
        setTracks(res.data.tracks || [])
      } catch {
        // silent
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  if (loading) return <LoadingSpinner size={50} text="Загрузка..." />

  return (
    <div className="home page-enter">
      <HeroSlider stats={stats} />

      <div className="home__container">
        <div className="home__search">
          <FiSearch size={20} className="home__search-icon" />
          <input
            type="text"
            placeholder="Поиск фильмов, треков, исполнителей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="home__search-input"
          />
          {searching && <div className="home__search-spinner" />}
        </div>

        <section className="home__section">
          <div className="home__section-header">
            <FiMusic size={22} className="home__section-icon" />
            <h2>Популярные треки</h2>
          </div>
          {tracks.length === 0 ? (
            <p className="home__empty">Треки не найдены</p>
          ) : (
            <div className="home__grid home__grid--tracks">
              {tracks.map((t) => (
                <TrackCard
                  key={t.id}
                  track={t}
                  onAuthRequired={() => setShowAuth(true)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="home__section">
          <div className="home__section-header">
            <FiFilm size={22} className="home__section-icon" />
            <h2>Популярные фильмы</h2>
          </div>
          {movies.length === 0 ? (
            <p className="home__empty">Фильмы не найдены</p>
          ) : (
            <div className="home__grid home__grid--movies">
              {movies.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onAuthRequired={() => setShowAuth(true)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
src/pages/Home.css
CSS

.home {
  padding-top: 64px;
}

.home__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.home__search {
  position: relative;
  max-width: 600px;
  margin: -30px auto 48px;
  z-index: 10;
}

.home__search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.home__search-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  background: var(--bg-secondary);
  border: 1px solid var(--bg-highlight);
  border-radius: var(--border-radius-pill);
  color: var(--text-primary);
  font-size: 15px;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.home__search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(29, 185, 84, 0.12), var(--shadow);
}

.home__search-input::placeholder {
  color: var(--text-muted);
}

.home__search-spinner {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--bg-highlight);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.home__section {
  margin-bottom: 48px;
}

.home__section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.home__section-icon {
  color: var(--accent);
}

.home__section-header h2 {
  font-size: 24px;
  font-weight: 800;
}

.home__grid {
  display: grid;
  gap: 20px;
}

.home__grid--tracks {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.home__grid--movies {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.home__empty {
  color: var(--text-muted);
  font-size: 15px;
  padding: 32px 0;
}

@media (max-width: 768px) {
  .home__grid--tracks {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  .home__grid--movies {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
src/pages/Catalog.jsx
React

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites } from '../store/authSlice'
import MovieCard from '../components/MovieCard'
import TrackCard from '../components/TrackCard'
import AuthModal from '../components/AuthModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiSearch, FiMusic, FiFilm } from 'react-icons/fi'
import './Catalog.css'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [tab, setTab] = useState('tracks')
  const [movies, setMovies] = useState([])
  const [tracks, setTracks] = useState([])
  const [allMovies, setAllMovies] = useState([])
  const [allTracks, setAllTracks] = useState([])
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const { isAuthenticated } = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFavorites())
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, t] = await Promise.all([api.get('/movies'), api.get('/tracks')])
        setAllMovies(m.data)
        setAllTracks(t.data)
        setMovies(m.data)
        setTracks(t.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setMovies(allMovies)
      setTracks(allTracks)
      return
    }
    const q = searchQuery.toLowerCase()
    setMovies(
      allMovies.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.director?.toLowerCase().includes(q) ||
          m.genres?.toLowerCase().includes(q)
      )
    )
    setTracks(
      allTracks.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.artist?.toLowerCase().includes(q) ||
          t.movie_title?.toLowerCase().includes(q)
      )
    )
  }, [searchQuery, allMovies, allTracks])

  if (loading) return <LoadingSpinner size={50} text="Загрузка каталога..." />

  const activeData = tab === 'tracks' ? tracks : movies

  return (
    <div className="catalog page-enter">
      <div className="catalog__container">
        <h1 className="catalog__title">Каталог</h1>

        <div className="catalog__controls">
          <div className="catalog__tabs">
            <button
              className={`catalog__tab ${tab === 'tracks' ? 'catalog__tab--active' : ''}`}
              onClick={() => setTab('tracks')}
            >
              <FiMusic size={16} />
              Треки
              <span className="catalog__tab-count">{tracks.length}</span>
            </button>
            <button
              className={`catalog__tab ${tab === 'movies' ? 'catalog__tab--active' : ''}`}
              onClick={() => setTab('movies')}
            >
              <FiFilm size={16} />
              Фильмы
              <span className="catalog__tab-count">{movies.length}</span>
            </button>
          </div>

          <div className="catalog__search">
            <FiSearch size={18} className="catalog__search-icon" />
            <input
              type="text"
              placeholder={`Поиск ${tab === 'tracks' ? 'треков' : 'фильмов'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog__search-input"
            />
          </div>
        </div>

        {activeData.length === 0 ? (
          <p className="catalog__empty">Ничего не найдено</p>
        ) : (
          <div
            className={`catalog__grid ${
              tab === 'tracks' ? 'catalog__grid--tracks' : 'catalog__grid--movies'
            }`}
          >
            {tab === 'tracks'
              ? tracks.map((t) => (
                  <TrackCard
                    key={t.id}
                    track={t}
                    onAuthRequired={() => setShowAuth(true)}
                  />
                ))
              : movies.map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={m}
                    onAuthRequired={() => setShowAuth(true)}
                  />
                ))}
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
src/pages/Catalog.css
CSS

.catalog {
  padding-top: 96px;
  min-height: 100vh;
}

.catalog__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.catalog__title {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 28px;
}

.catalog__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.catalog__tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--border-radius-pill);
}

.catalog__tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--border-radius-pill);
  background: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition-fast);
}

.catalog__tab--active {
  background: var(--accent);
  color: #000;
}

.catalog__tab-count {
  background: rgba(255, 255, 255, 0.15);
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.catalog__tab--active .catalog__tab-count {
  background: rgba(0, 0, 0, 0.2);
}

.catalog__search {
  position: relative;
  flex: 1;
  max-width: 360px;
}

.catalog__search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.catalog__search-input {
  width: 100%;
  padding: 11px 14px 11px 42px;
  background: var(--bg-secondary);
  border: 1px solid var(--bg-highlight);
  border-radius: var(--border-radius-pill);
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition-fast);
}

.catalog__search-input:focus {
  border-color: var(--accent);
}

.catalog__search-input::placeholder {
  color: var(--text-muted);
}

.catalog__grid {
  display: grid;
  gap: 20px;
}

.catalog__grid--tracks {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.catalog__grid--movies {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.catalog__empty {
  color: var(--text-muted);
  font-size: 15px;
  padding: 60px 0;
  text-align: center;
}
src/pages/MovieDetail.jsx
React

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addFavoriteLocal, removeFavoriteLocal, fetchFavorites } from '../store/authSlice'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import CommentSection from '../components/CommentSection'
import AuthModal from '../components/AuthModal'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  FiHeart,
  FiPlay,
  FiExternalLink,
  FiFilm,
  FiMusic,
  FiUser,
  FiCalendar,
  FiTag,
} from 'react-icons/fi'
import './MovieDetail.css'

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const { user, isAuthenticated, favorites } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const isFav = favorites.some(
    (f) => f.item_type === 'movie' && f.item_id === parseInt(id)
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movieRes, tracksRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/tracks?movie_id=${id}`),
        ])
        setMovie(movieRes.data)
        setTracks(tracksRes.data)
      } catch {
        showToast('Фильм не найден', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
    if (isAuthenticated) dispatch(fetchFavorites())
  }, [id, isAuthenticated, dispatch])

  const toggleFav = async () => {
    if (!isAuthenticated) {
      setShowAuth(true)
      return
    }
    try {
      if (isFav) {
        await api.delete(`/favorites/movie/${parseInt(id)}`)
        dispatch(removeFavoriteLocal({ item_type: 'movie', item_id: parseInt(id) }))
        showToast('Удалено из избранного', 'info')
      } else {
        const res = await api.post('/favorites', {
          item_type: 'movie',
          item_id: parseInt(id),
        })
        dispatch(addFavoriteLocal(res.data))
        showToast('Добавлено в избранное', 'success')
      }
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  if (loading) return <LoadingSpinner size={50} text="Загрузка..." />
  if (!movie) return <div className="detail-error">Фильм не найден</div>

  return (
    <div className="detail page-enter">
      <div className="detail__container">
        <div className="detail__hero">
          <div className="detail__poster">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} />
            ) : (
              <div className="detail__poster-placeholder">
                <FiFilm size={60} />
              </div>
            )}
          </div>

          <div className="detail__info">
            <h1 className="detail__title">{movie.title}</h1>

            <div className="detail__meta-list">
              {movie.year && (
                <div className="detail__meta">
                  <FiCalendar size={16} />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.director && (
                <div className="detail__meta">
                  <FiUser size={16} />
                  <span>{movie.director}</span>
                </div>
              )}
              {movie.genres && (
                <div className="detail__meta">
                  <FiTag size={16} />
                  <span>{movie.genres}</span>
                </div>
              )}
            </div>

            <div className="detail__actions">
              <button
                className="detail__btn detail__btn--primary"
                onClick={() => {
                  const q = movie.trailer_query || `${movie.title} трейлер`
                  window.open(
                    `https://yandex.ru/video/search?text=${encodeURIComponent(q)}`,
                    '_blank'
                  )
                }}
              >
                <FiPlay size={18} />
                Трейлер
              </button>
              <button
                className="detail__btn detail__btn--secondary"
                onClick={() => {
                  const q = movie.watch_query || `${movie.title} смотреть онлайн`
                  window.open(
                    `https://yandex.ru/video/search?text=${encodeURIComponent(q)}`,
                    '_blank'
                  )
                }}
              >
                <FiExternalLink size={18} />
                Смотреть
              </button>
              <button
                className={`detail__btn detail__btn--fav ${isFav ? 'detail__btn--fav-active' : ''}`}
                onClick={toggleFav}
              >
                <FiHeart size={18} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'В избранном' : 'В избранное'}
              </button>
            </div>

            {tracks.length > 0 && (
              <div className="detail__tracks">
                <h3>
                  <FiMusic size={18} />
                  Саундтреки ({tracks.length})
                </h3>
                <div className="detail__tracks-list">
                  {tracks.map((t) => (
                    <Link
                      key={t.id}
                      to={`/track/${t.id}`}
                      className="detail__track-item"
                    >
                      <FiMusic size={14} />
                      <span>{t.title}</span>
                      <span className="detail__track-artist">{t.artist}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <CommentSection itemType="movie" itemId={parseInt(id)} />
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
src/pages/MovieDetail.css
CSS

.detail {
  padding-top: 96px;
  min-height: 100vh;
}

.detail__container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.detail__hero {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.detail__poster {
  flex-shrink: 0;
  width: 300px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.detail__poster img {
  width: 100%;
  display: block;
}

.detail__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.detail__info {
  flex: 1;
  min-width: 0;
}

.detail__title {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 16px;
  line-height: 1.2;
}

.detail__meta-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.detail__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 15px;
}

.detail__meta svg {
  color: var(--accent);
  flex-shrink: 0;
}

.detail__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.detail__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: 14px;
  transition: var(--transition);
}

.detail__btn--primary {
  background: var(--accent);
  color: #000;
}

.detail__btn--primary:hover {
  background: var(--accent-hover);
  transform: scale(1.03);
}

.detail__btn--secondary {
  background: var(--bg-highlight);
  color: var(--text-primary);
}

.detail__btn--secondary:hover {
  background: var(--bg-tertiary);
}

.detail__btn--fav {
  background: transparent;
  border: 1px solid var(--bg-highlight);
  color: var(--text-secondary);
}

.detail__btn--fav:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.detail__btn--fav-active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(29, 185, 84, 0.1);
}

.detail__tracks {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  padding: 20px;
}

.detail__tracks h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--accent);
}

.detail__tracks-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail__track-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition-fast);
}

.detail__track-item:hover {
  background: var(--bg-tertiary);
}

.detail__track-item svg {
  color: var(--text-muted);
}

.detail__track-artist {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 13px;
}

.detail-error {
  padding: 120px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 18px;
}

@media (max-width: 768px) {
  .detail__hero {
    flex-direction: column;
    gap: 24px;
  }
  .detail__poster {
    width: 200px;
    margin: 0 auto;
  }
  .detail__title {
    font-size: 28px;
  }
}
src/pages/TrackDetail.jsx
React

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addFavoriteLocal, removeFavoriteLocal, fetchFavorites } from '../store/authSlice'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import CommentSection from '../components/CommentSection'
import AuthModal from '../components/AuthModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiHeart, FiExternalLink, FiMusic, FiUser, FiFilm } from 'react-icons/fi'
import './TrackDetail.css'

export default function TrackDetail() {
  const { id } = useParams()
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const { isAuthenticated, favorites } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const isFav = favorites.some(
    (f) => f.item_type === 'track' && f.item_id === parseInt(id)
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(`/tracks/${id}`)
        setTrack(res.data)
      } catch {
        showToast('Трек не найден', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
    if (isAuthenticated) dispatch(fetchFavorites())
  }, [id, isAuthenticated, dispatch])

  const toggleFav = async () => {
    if (!isAuthenticated) {
      setShowAuth(true)
      return
    }
    try {
      if (isFav) {
        await api.delete(`/favorites/track/${parseInt(id)}`)
        dispatch(removeFavoriteLocal({ item_type: 'track', item_id: parseInt(id) }))
        showToast('Удалено из избранного', 'info')
      } else {
        const res = await api.post('/favorites', {
          item_type: 'track',
          item_id: parseInt(id),
        })
        dispatch(addFavoriteLocal(res.data))
        showToast('Добавлено в избранное', 'success')
      }
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  if (loading) return <LoadingSpinner size={50} text="Загрузка..." />
  if (!track) return <div className="detail-error">Трек не найден</div>

  return (
    <div className="detail page-enter">
      <div className="detail__container">
        <div className="detail__hero">
          <div className="detail__poster" style={{ width: 280 }}>
            {track.cover_url ? (
              <img src={track.cover_url} alt={track.title} style={{ aspectRatio: '1' }} />
            ) : (
              <div className="detail__poster-placeholder" style={{ aspectRatio: '1' }}>
                <FiMusic size={60} />
              </div>
            )}
          </div>

          <div className="detail__info">
            <p className="track-detail__type">ТРЕК</p>
            <h1 className="detail__title">{track.title}</h1>

            <div className="detail__meta-list">
              {track.artist && (
                <div className="detail__meta">
                  <FiUser size={16} />
                  <span>{track.artist}</span>
                </div>
              )}
              {track.movie_title && (
                <div className="detail__meta">
                  <FiFilm size={16} />
                  <span>
                    Из фильма:{' '}
                    <Link
                      to={`/movie/${track.movie_id}`}
                      className="track-detail__movie-link"
                    >
                      {track.movie_title}
                    </Link>
                  </span>
                </div>
              )}
            </div>

            <div className="detail__actions">
              {track.spotify_url && (
                <a
                  href={track.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail__btn detail__btn--primary"
                >
                  <FiExternalLink size={18} />
                  Слушать на Spotify
                </a>
              )}
              <button
                className={`detail__btn detail__btn--fav ${isFav ? 'detail__btn--fav-active' : ''}`}
                onClick={toggleFav}
              >
                <FiHeart size={18} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'В избранном' : 'В избранное'}
              </button>
            </div>
          </div>
        </div>

        <CommentSection itemType="track" itemId={parseInt(id)} />
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
src/pages/TrackDetail.css
CSS

.track-detail__type {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--accent);
  margin-bottom: 8px;
}

.track-detail__movie-link {
  color: var(--accent);
  transition: var(--transition-fast);
}

.track-detail__movie-link:hover {
  text-decoration: underline;
}
src/pages/Forum.jsx
React

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import ForumPostCard from '../components/ForumPostCard'
import AuthModal from '../components/AuthModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiPlus, FiX, FiMessageSquare, FiTrendingUp } from 'react-icons/fi'
import './Forum.css'

export default function Forum() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  const fetchPosts = async () => {
    try {
      const res = await api.get('/forum/posts')
      setPosts(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post('/forum/posts', newPost)
      setPosts((prev) => [res.data, ...prev])
      setNewPost({ title: '', content: '' })
      setShowCreate(false)
      showToast('Пост создан!', 'success')
    } catch {
      showToast('Ошибка при создании поста', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = (postId, newRating) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, rating: newRating } : p))
    )
  }

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="forum page-enter">
      <div className="forum__container">
        <div className="forum__header">
          <div className="forum__header-left">
            <div className="forum__logo">
              <FiMessageSquare size={28} />
            </div>
            <div>
              <h1 className="forum__title">Форум MusicMovie</h1>
              <p className="forum__subtitle">Обсуждайте фильмы, музыку и саундтреки</p>
            </div>
          </div>

          <button
            className="forum__create-btn"
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuth(true)
                return
              }
              setShowCreate(true)
            }}
          >
            <FiPlus size={18} />
            Создать пост
          </button>
        </div>

        {showCreate && (
          <div className="forum__create-form-wrapper">
            <form className="forum__create-form" onSubmit={handleCreate}>
              <div className="forum__create-form-header">
                <h3>Новый пост</h3>
                <button
                  type="button"
                  className="forum__create-close"
                  onClick={() => setShowCreate(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Заголовок"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                className="forum__create-input"
                required
              />
              <textarea
                placeholder="Текст поста (необязательно)"
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                className="forum__create-textarea"
                rows={5}
              />
              <button
                type="submit"
                className="forum__create-submit"
                disabled={submitting || !newPost.title.trim()}
              >
                {submitting ? 'Публикация...' : 'Опубликовать'}
              </button>
            </form>
          </div>
        )}

        <div className="forum__sort-bar">
          <button className="forum__sort-btn forum__sort-btn--active">
            <FiTrendingUp size={16} />
            Популярное
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Загрузка постов..." />
        ) : posts.length === 0 ? (
          <div className="forum__empty">
            <FiMessageSquare size={48} />
            <p>Пока нет постов. Будьте первым!</p>
          </div>
        ) : (
          <div className="forum__feed">
            {posts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                onVote={handleVote}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
src/pages/Forum.css
CSS

.forum {
  padding-top: 96px;
  min-height: 100vh;
  background: var(--reddit-bg);
}

.forum__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px 60px;
}

.forum__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding: 24px;
  background: var(--reddit-card);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius-lg);
}

.forum__header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.forum__logo {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--reddit-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.forum__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--reddit-text);
}

.forum__subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.forum__create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--border-radius-pill);
  background: var(--reddit-orange);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  transition: var(--transition);
  flex-shrink: 0;
}

.forum__create-btn:hover {
  background: var(--reddit-orange-hover);
  transform: scale(1.03);
}

.forum__create-form-wrapper {
  margin-bottom: 16px;
  animation: fadeInDown 0.3s ease;
}

.forum__create-form {
  background: var(--reddit-card);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.forum__create-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.forum__create-form-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--reddit-text);
}

.forum__create-close {
  background: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  transition: var(--transition-fast);
}

.forum__create-close:hover {
  color: var(--text-primary);
  background: var(--reddit-hover);
}

.forum__create-input {
  padding: 12px 16px;
  background: var(--reddit-bg);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  color: var(--reddit-text);
  font-size: 14px;
  transition: var(--transition-fast);
}

.forum__create-input:focus {
  border-color: var(--reddit-orange);
}

.forum__create-textarea {
  padding: 12px 16px;
  background: var(--reddit-bg);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  color: var(--reddit-text);
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  transition: var(--transition-fast);
}

.forum__create-textarea:focus {
  border-color: var(--reddit-orange);
}

.forum__create-submit {
  align-self: flex-end;
  padding: 10px 24px;
  border-radius: var(--border-radius-pill);
  background: var(--reddit-orange);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  transition: var(--transition);
}

.forum__create-submit:hover:not(:disabled) {
  background: var(--reddit-orange-hover);
}

.forum__create-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.forum__sort-bar {
  display: flex;
  gap: 4px;
  padding: 10px 16px;
  background: var(--reddit-card);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  margin-bottom: 16px;
}

.forum__sort-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--border-radius-pill);
  background: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  transition: var(--transition-fast);
}

.forum__sort-btn--active {
  background: var(--reddit-hover);
  color: var(--reddit-text);
}

.forum__feed {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.forum__empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.forum__empty svg {
  margin-bottom: 16px;
  opacity: 0.3;
}

.forum__empty p {
  font-size: 16px;
}

@media (max-width: 768px) {
  .forum__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
src/pages/ForumPostDetail.jsx
React

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import AuthModal from '../components/AuthModal'
import {
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiUser,
  FiClock,
  FiSend,
  FiTrash2,
  FiMessageSquare,
} from 'react-icons/fi'
import './ForumPostDetail.css'

export default function ForumPostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const { showToast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/forum/posts/${id}`),
          api.get(`/forum/posts/${id}/comments`),
        ])
        setPost(postRes.data)
        setComments(commentsRes.data)
      } catch {
        showToast('Пост не найден', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      setShowAuth(true)
      return
    }
    try {
      const res = await api.post(`/forum/posts/${id}/vote`, { vote_type: voteType })
      setPost((p) => ({ ...p, rating: res.data.rating }))
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      const res = await api.post(`/forum/posts/${id}/comments`, {
        text: commentText.trim(),
      })
      setComments((prev) => [...prev, res.data])
      setCommentText('')
      showToast('Комментарий добавлен', 'success')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/forum/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      showToast('Комментарий удален', 'info')
    } catch {
      showToast('Ошибка', 'error')
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <LoadingSpinner text="Загрузка поста..." />
  if (!post) return <div className="detail-error">Пост не найден</div>

  return (
    <div className="forum-detail page-enter">
      <div className="forum-detail__container">
        <button
          className="forum-detail__back"
          onClick={() => navigate('/forum')}
        >
          <FiArrowLeft size={18} />
          Назад к форуму
        </button>

        <div className="forum-detail__post">
          <div className="forum-detail__votes">
            <button
              className="forum-detail__vote-btn forum-detail__vote-btn--up"
              onClick={() => handleVote('upvote')}
            >
              <FiArrowUp size={22} />
            </button>
            <span className="forum-detail__rating">{post.rating || 0}</span>
            <button
              className="forum-detail__vote-btn forum-detail__vote-btn--down"
              onClick={() => handleVote('downvote')}
            >
              <FiArrowDown size={22} />
            </button>
          </div>

          <div className="forum-detail__content">
            <div className="forum-detail__meta">
              <FiUser size={12} />
              <span className="forum-detail__author">{post.username || 'Аноним'}</span>
              <FiClock size={12} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <h1 className="forum-detail__title">{post.title}</h1>
            {post.content && (
              <div className="forum-detail__text">{post.content}</div>
            )}
          </div>
        </div>

        <div className="forum-detail__comments-section">
          <h3 className="forum-detail__comments-title">
            <FiMessageSquare size={18} />
            Комментарии ({comments.length})
          </h3>

          {isAuthenticated ? (
            <form className="forum-detail__comment-form" onSubmit={handleComment}>
              <textarea
                placeholder="Написать комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="forum-detail__comment-input"
              />
              <button
                type="submit"
                className="forum-detail__comment-submit"
                disabled={!commentText.trim()}
              >
                <FiSend size={16} />
                Отправить
              </button>
            </form>
          ) : (
            <div className="forum-detail__login-prompt">
              <FiUser size={16} />
              Войдите, чтобы комментировать
            </div>
          )}

          <div className="forum-detail__comments-list">
            {comments.length === 0 ? (
              <p className="forum-detail__empty">Пока нет комментариев</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="forum-detail__comment">
                  <div className="forum-detail__comment-header">
                    <div className="forum-detail__comment-avatar">
                      <FiUser size={12} />
                    </div>
                    <span className="forum-detail__comment-author">
                      {c.username || 'Пользователь'}
                    </span>
                    <span className="forum-detail__comment-date">
                      {formatDate(c.created_at)}
                    </span>
                    {user?.role === 'admin' && (
                      <button
                        className="forum-detail__comment-delete"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="forum-detail__comment-text">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
src/pages/ForumPostDetail.css
CSS

.forum-detail {
  padding-top: 96px;
  min-height: 100vh;
  background: var(--reddit-bg);
}

.forum-detail__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px 60px;
}

.forum-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  color: var(--reddit-blue);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: var(--transition-fast);
}

.forum-detail__back:hover {
  color: var(--text-primary);
}

.forum-detail__post {
  display: flex;
  gap: 0;
  background: var(--reddit-card);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 20px;
}

.forum-detail__votes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 14px;
  background: rgba(0, 0, 0, 0.2);
}

.forum-detail__vote-btn {
  background: none;
  color: var(--text-muted);
  padding: 6px;
  border-radius: 4px;
  display: flex;
  transition: var(--transition-fast);
}

.forum-detail__vote-btn--up:hover {
  color: var(--reddit-orange);
  background: rgba(255, 69, 0, 0.1);
}

.forum-detail__vote-btn--down:hover {
  color: var(--reddit-blue);
  background: rgba(113, 147, 255, 0.1);
}

.forum-detail__rating {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
}

.forum-detail__content {
  flex: 1;
  padding: 16px 20px;
}

.forum-detail__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.forum-detail__author {
  color: var(--reddit-text);
  font-weight: 500;
}

.forum-detail__title {
  font-size: 24px;
  font-weight: 800;
  color: var(--reddit-text);
  margin-bottom: 14px;
  line-height: 1.3;
}

.forum-detail__text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
}

.forum-detail__comments-section {
  background: var(--reddit-card);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  padding: 20px;
}

.forum-detail__comments-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--reddit-text);
  margin-bottom: 16px;
}

.forum-detail__comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--reddit-border);
}

.forum-detail__comment-input {
  padding: 12px 16px;
  background: var(--reddit-bg);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  color: var(--reddit-text);
  font-size: 14px;
  resize: vertical;
  transition: var(--transition-fast);
}

.forum-detail__comment-input:focus {
  border-color: var(--reddit-orange);
}

.forum-detail__comment-submit {
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--border-radius-pill);
  background: var(--reddit-orange);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  transition: var(--transition);
}

.forum-detail__comment-submit:hover:not(:disabled) {
  background: var(--reddit-orange-hover);
}

.forum-detail__comment-submit:disabled {
  opacity: 0.5;
}

.forum-detail__login-prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: var(--reddit-bg);
  border: 1px solid var(--reddit-border);
  border-radius: var(--border-radius);
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 20px;
}

.forum-detail__comments-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.forum-detail__empty {
  color: var(--text-muted);
  font-size: 14px;
  padding: 16px 0;
}

.forum-detail__comment {
  padding: 12px;
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
}

.forum-detail__comment:hover {
  background: var(--reddit-hover);
}

.forum-detail__comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.forum-detail__comment-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--reddit-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.forum-detail__comment-author {
  font-size: 12px;
  font-weight: 600;
  color: var(--reddit-text);
}

.forum-detail__comment-date {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: auto;
}

.forum-detail__comment-delete {
  background: none;
  color: var(--text-muted);
  padding: 3px;
  border-radius: 3px;
  display: flex;
  transition: var(--transition-fast);
}

.forum-detail__comment-delete:hover {
  color: var(--danger);
  background: rgba(231, 76, 60, 0.1);
}

.forum-detail__comment-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  padding-left: 32px;
}
src/pages/News.jsx
React

import { useState, useEffect } from 'react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiExternalLink, FiCalendar, FiRss } from 'react-icons/fi'
import './News.css'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news')
        setNews(res.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) return <LoadingSpinner text="Загрузка новостей..." />

  return (
    <div className="news page-enter">
      <div className="news__container">
        <div className="news__header">
          <FiRss size={28} className="news__header-icon" />
          <h1>Новости</h1>
        </div>

        {news.length === 0 ? (
          <div className="news__empty">
            <FiRss size={48} />
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
                <div className="news-card__content">
                  <h3 className="news-card__title">{item.title}</h3>
                  {item.description && (
                    <p className="news-card__description">{item.description}</p>
                  )}
                  <div className="news-card__footer">
                    <span className="news-card__date">
                      <FiCalendar size={14} />
                      {formatDate(item.date || item.created_at)}
                    </span>
                    <span className="news-card__link">
                      <FiExternalLink size={14} />
                      Читать
                    </span>
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
src/pages/News.css
CSS

.news {
  padding-top: 96px;
  min-height: 100vh;
}

.news__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.news__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
}

.news__header-icon {
  color: var(--accent);
}

.news__header h1 {
  font-size: 36px;
  font-weight: 900;
}

.news__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.news-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  border: 1px solid transparent;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: var(--shadow);
}

.news-card__content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-card__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
  color: var(--text-primary);
}

.news-card__description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--bg-highlight);
}

.news-card__date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.news-card__link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
  transition: var(--transition-fast);
}

.news-card:hover .news-card__link {
  color: var(--accent-hover);
}

.news__empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.news__empty svg {
  margin-bottom: 16px;
  opacity: 0.3;
}

@media (max-width: 768px) {
  .news__grid {
    grid-template-columns: 1fr;
  }
}
src/pages/Contacts.jsx
React

import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import { FiSend, FiMail, FiPhone, FiMapPin, FiUser, FiMessageSquare } from 'react-icons/fi'
import './Contacts.css'

export default function Contacts() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const { showToast } = useToast()

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Заполните все поля', 'error')
      return
    }
    setSending(true)
    setTimeout(() => {
      showToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success')
      setForm({ name: '', email: '', message: '' })
      setSending(false)
    }, 1000)
  }

  return (
    <div className="contacts page-enter">
      <div className="contacts__container">
        <h1 className="contacts__title">Контакты</h1>
        <p 