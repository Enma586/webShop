import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { CategoryProvider } from './context/CategoryContext' 
import { ProductProvider } from './context/ProductContext'   
import { TooltipProvider } from "@/components/ui/tooltip" 
import { SidebarProvider } from "@/components/ui/sidebar" 
import { CartProvider } from './context/CartContext' 
import { SideCart } from './components/Shared/Cart/SideCart'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/admin/ProductPage'
import CheckoutPage from './pages/shop/CheckoutPage'

import MainLayout from './layouts/MainLayout'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ProtectedRoute } from './ProtectedRoute'
import CategoryPage from './pages/admin/CategoryPage'
import CategoryPageCustomer from './pages/shop/CategoryPageCustomer'
import { UserProvider } from './context/UserContext'
import UserPage from './pages/admin/UserPage'
import { OrderProvider } from './context/OrderContext'
import OrderPage from './pages/admin/OrderPage'
import { InvoiceProvider } from './context/InvoiceContext'
import AdminDashboard from './pages/admin/AdminDashboard'
import { ThemeProvider } from './context/ThemeContext'
import { AdminProvider } from './context/AdminContext'
import AuditPage from './pages/admin/AuditPage'
import AddressPage from './pages/customer/AddressPage'
import { AddressProvider } from './context/AddressContext'
import MyOrdersPage from './pages/customer/OrdersPage'

function AppRoutes() {
  const { loading } = useAuth(); 

  if (loading) return <LoadingScreen />;

  return (
    <>
      <SideCart /> 
      <Routes>
        <Route element={<MainLayout />}>
          {/* RUTAS PÚBLICAS */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPageCustomer />} />
          
          {/* RUTAS PARA CLIENTES Y ADMINS (LOGUEADOS) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'customer']} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/customer/addresses" element={<AddressPage />} />
            <Route path="/customer/orders" element={<MyOrdersPage />} />
          </Route>

          {/* RUTAS EXCLUSIVAS PARA ADMINS */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/products" element={<ProductPage />} />
            <Route path="/admin/categories" element={<CategoryPage />} />
            <Route path="/admin/users" element={<UserPage />} />
            <Route path="/admin/orders" element={<OrderPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/logs" element={<AuditPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <UserProvider>
              <CategoryProvider>
                <ProductProvider>
                  <BrowserRouter> 
                  <AddressProvider>
                    <CartProvider>
                      <InvoiceProvider>
                        <OrderProvider>
                          <TooltipProvider delayDuration={0}>
                            <AppRoutes />
                          </TooltipProvider>
                        </OrderProvider>
                      </InvoiceProvider>
                    </CartProvider>
                    </AddressProvider>
                  </BrowserRouter>
                </ProductProvider>
              </CategoryProvider>
            </UserProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  )
}