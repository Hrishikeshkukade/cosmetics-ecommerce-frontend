import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, TrendingUp, Sparkles, Heart, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      try {
        const productsData = await productService.getFeaturedProducts();
        setFeaturedProducts(productsData || []);
      } catch (error) {
        console.log('Featured products not available');
      }

      try {
        const categoriesData = await categoryService.getActiveCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.log('Categories not available');
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white overflow-x-hidden">
      {/* NAVBAR ADDED */}
      <Navbar />
      <CartDrawer />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Discover Your Natural Beauty
            </h1>

            <p className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 text-pink-100">
              Premium cosmetics for every skin type
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-pink-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </button>

              <button
                onClick={() => navigate('/products')}
                className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-pink-600 transition-all"
              >
                Explore Categories
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-pink-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Premium Quality</h3>
            <p className="text-sm sm:text-base text-gray-600">Top brands and authentic products</p>
          </div>

          <div className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-pink-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Easy Shopping</h3>
            <p className="text-sm sm:text-base text-gray-600">Simple and secure checkout</p>
          </div>

          <div className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-pink-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Fast Delivery</h3>
            <p className="text-sm sm:text-base text-gray-600">Quick shipping across India</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>

            <button
              onClick={() => navigate('/products')}
              className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
            >
              View All <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
                  <img
                    src={category.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'}
                    alt={category.name}
                    className="w-full h-40 sm:h-52 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-200">
                      {category.description || 'Shop now'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Products
            </h2>

            <button
              onClick={() => navigate('/products')}
              className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
            >
              View All <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-600"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-gray-500 mb-4">
                No products available yet. Please add products as admin.
              </p>

              <button
                onClick={() => navigate('/products')}
                className="btn-primary"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" />

          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Get Beauty Tips & Special Offers
          </h2>

          <p className="text-pink-100 mb-6 sm:mb-8 text-sm sm:text-base">
            Subscribe to our newsletter for exclusive deals
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 sm:px-6 py-3 sm:py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-pink-300"
            />

            <button className="bg-white text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                GlowBeauty
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Your trusted cosmetics destination
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/products')}>All Products</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/products')}>New Arrivals</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/products')}>Best Sellers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Shipping</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2025 GlowBeauty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
