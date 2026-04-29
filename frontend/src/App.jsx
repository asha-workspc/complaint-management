import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import NewComplaint from './pages/NewComplaint'
import ComplaintDetail from './pages/ComplaintDetail'
import AdminUsers from './pages/AdminUsers'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin()) return <Navigate to="/dashboard" replace />
  return <Layout>{children}</Layout>
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/complaints" element={
        <ProtectedRoute><Complaints /></ProtectedRoute>
      } />

      <Route path="/complaints/new" element={
        <ProtectedRoute><NewComplaint /></ProtectedRoute>
      } />

      <Route path="/complaints/:id" element={
        <ProtectedRoute><ComplaintDetail /></ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
