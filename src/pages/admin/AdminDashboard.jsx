import { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  TrendingUp, DollarSign, AlertCircle, Plus, 
  BarChart3, LogOut, Menu, X, MessageCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import BrandManagement from './BrandManagement';
import OrderManagement from './OrderManagement';
import Analytics from './Analytics';
import ChatSupport from './ChatSupport';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await orderService.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/categories', icon: BarChart3, label: 'Categories' },
    { path: '/admin/brands', icon: TrendingUp, label: 'Brands' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/chat', icon: MessageCircle, label: 'Chat Support' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-2xl font-bold text-pink-600">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                View Store
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
          <div className="p-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 font-medium">Total Revenue</h3>
                          <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-green-600 mt-2">All time</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 font-medium">Total Orders</h3>
                          <ShoppingBag className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
                        <p className="text-sm text-gray-600 mt-2">All orders</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 font-medium">Pending Orders</h3>
                          <AlertCircle className="h-8 w-8 text-yellow-600" />
                        </div>
                        <p className="text-3xl font-bold">{stats?.pendingOrders || 0}</p>
                        <p className="text-sm text-yellow-600 mt-2">Need attention</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 font-medium">Delivered</h3>
                          <Package className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold">{stats?.deliveredOrders || 0}</p>
                        <p className="text-sm text-green-600 mt-2">Completed</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => navigate('/admin/products')}
                          className="flex items-center gap-3 p-4 border-2 border-pink-200 rounded-lg hover:border-pink-600 hover:bg-pink-50 transition-all"
                        >
                          <Plus className="h-6 w-6 text-pink-600" />
                          <div className="text-left">
                            <p className="font-semibold">Add Product</p>
                            <p className="text-sm text-gray-600">Create new product</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => navigate('/admin/categories')}
                          className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Plus className="h-6 w-6 text-blue-600" />
                          <div className="text-left">
                            <p className="font-semibold">Add Category</p>
                            <p className="text-sm text-gray-600">Create new category</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => navigate('/admin/orders')}
                          className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all"
                        >
                          <ShoppingBag className="h-6 w-6 text-green-600" />
                          <div className="text-left">
                            <p className="font-semibold">View Orders</p>
                            <p className="text-sm text-gray-600">Manage orders</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            } />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/brands" element={<BrandManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chat" element={<ChatSupport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;