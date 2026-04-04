import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CombinedProvider } from './context/CombinedProvider';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/admin/ProductPage';
import CategoryPage from './pages/admin/CategoryPage';
import UserPage from './pages/admin/UserPage';
import OrderPage from './pages/admin/OrderPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AuditPage from './pages/admin/AuditPage';

import CheckoutPage from './pages/shop/CheckoutPage';
import CategoryPageCustomer from './pages/shop/CategoryPageCustomer';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import AddressPage from './pages/customer/AddressPage';
import MyOrdersPage from './pages/customer/OrdersPage';

import MainLayout from './layouts/MainLayout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { SideCart } from './components/Shared/Cart/SideCart';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <SideCart />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPageCustomer />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          <Route element={<ProtectedRoute allowedRoles={['admin', 'customer']} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/customer/addresses" element={<AddressPage />} />
            <Route path="/customer/orders" element={<MyOrdersPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductPage />} />
            <Route path="/admin/categories" element={<CategoryPage />} />
            <Route path="/admin/users" element={<UserPage />} />
            <Route path="/admin/orders" element={<OrderPage />} />
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
    <CombinedProvider>
      <AppRoutes />
    </CombinedProvider>
  );
}