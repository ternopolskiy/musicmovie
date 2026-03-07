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
    const res = await api.post('/auth/login', credentials)
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
    const res = await api.post('/auth/login', { email: data.email, password: data.password })
    localStorage.setItem('access_token', res.data.access_token)
    const userRes = await api.get('/auth/me')
    return userRes.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Ошибка регистрации')
  }
})

export const fetchFavorites = createAsyncThunk('auth/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/favorites')
    return res.data
  } catch {
    return rejectWithValue('Failed to fetch favorites')
  }
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
        state.favorites = action.payload.items || action.payload
      })
  },
})

export const { logout, clearError, setFavorites, addFavoriteLocal, removeFavoriteLocal } =
  authSlice.actions
export default authSlice.reducer
