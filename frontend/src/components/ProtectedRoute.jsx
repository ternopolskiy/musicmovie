import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((s) => s.auth)

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/" replace />
  return children
}
