import { useAuth } from "./context/AuthContext"
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return null; // O tu LoadingScreen

    if (!isAuthenticated) return <Navigate to='/login' replace />

    // Retornamos el Outlet seco. El MainLayout ya tiene el Sidebar.
    return <Outlet />
}