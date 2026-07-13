import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '@/components/layout/Layout';
// Public pages
import HomePage from '@/pages/customer/HomePage';
import ProductListPage from '@/pages/customer/ProductListPage';
import ProductDetailPage from '@/pages/customer/ProductDetailPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
// Customer pages
import CartPage from '@/pages/customer/CartPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import OrderHistoryPage from '@/pages/customer/OrderHistoryPage';
import OrderDetailPage from '@/pages/customer/OrderDetailPage';
import EsewaCallbackPage from '@/pages/customer/EsewaCallbackPage';
import EsewaFailurePage from '@/pages/customer/EsewaFailurePage';
// Vendor pages
import VendorDashboardPage from '@/pages/vendor/VendorDashboardPage';
import VendorProductsPage from '@/pages/vendor/VendorProductsPage';
import VendorOrdersPage from '@/pages/vendor/VendorOrdersPage';
import VendorApplyPage from '@/pages/vendor/VendorApplyPage';
// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminVendorsPage from '@/pages/admin/AdminVendorsPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment/esewa/callback" element={<EsewaCallbackPage />} />
        <Route path="/payment/esewa/failure" element={<EsewaFailurePage />} />

        {/* Any authenticated user (customer or vendor-to-be) */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']} />}>
          <Route path="/vendor/apply" element={<VendorApplyPage />} />
        </Route>

        {/* Customer protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Vendor protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
          <Route path="/vendor/products" element={<VendorProductsPage />} />
          <Route path="/vendor/orders" element={<VendorOrdersPage />} />
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/vendors" element={<AdminVendorsPage />} />
        </Route>

        <Route
          path="/unauthorized"
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
              <p className="mt-2 text-gray-600">
                You don't have permission to view this page.
              </p>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}