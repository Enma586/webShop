import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { CategoryProvider } from './context/CategoryContext' 
import { ProductProvider } from './context/ProductContext'   
import { TooltipProvider } from "@/components/ui/tooltip" 
import { SidebarProvider } from "@/components/ui/sidebar" 

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/admin/ProductPage'

import MainLayout from './layouts/MainLayout'
import { LoadingScreen } from './components/ui/LoadingScreen'
import {ProtectedRoute} from './ProtectedRoute'
import CategoryPage from './pages/admin/CategoryPage'

function AppRoutes() {
  const { loading } = useAuth(); 

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        
        
        <Route element={<ProtectedRoute />}>
        <Route path="/admin/products" element={<ProductPage />} />
        <Route path="/admin/categories" element={<CategoryPage />} />
          {/* Solo necesitamos la ruta del Inventario. 
              El formulario ahora vive DENTRO de ProductPage como un Modal */}
          
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <TooltipProvider delayDuration={0}>
              <BrowserRouter>

                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}