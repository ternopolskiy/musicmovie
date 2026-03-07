import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth)

  if (loading) return null
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}
