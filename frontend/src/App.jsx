import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Orders from './pages/Orders';
import Products from './pages/Products';

import StorefrontLayout from './components/storefront/StorefrontLayout';
import StorefrontHome from './pages/storefront/StorefrontHome';
import ProductCatalog from './pages/storefront/ProductCatalog';
import ProductDetails from './pages/storefront/ProductDetails';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import OrderSuccess from './pages/storefront/OrderSuccess';
import AccountLayout from './components/storefront/AccountLayout';
import OrderHistory from './pages/storefront/OrderHistory';
import AccountSettings from './pages/storefront/AccountSettings';

function App() {
  return (
    <Routes>
      {/* Landing page — first thing everyone sees */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppShell />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
      </Route>

      {/* Customer Storefront — all under /shop */}
      <Route path="/shop" element={<StorefrontLayout />}>
        <Route index element={<StorefrontHome />} />
        <Route path="products" element={<ProductCatalog />} />
        <Route path="catalog" element={<ProductCatalog />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route path="orders" element={<OrderHistory />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
