import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CheckoutPage from './pages/Checkout';
import OrdersPage from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />

              <Route path="/admin/orders/:id" element={
                <ProtectedRoute adminOnly>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
            </Routes>
          </CartProvider>
          <ChatWidget />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;