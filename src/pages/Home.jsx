import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, TrendingUp, Sparkles, Heart, ChevronRight } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API calls
    setFeaturedProducts([
      {
        id: 1,
        name: 'Moisturizing Face Cream',
        price: 499,
        discountPrice: 399,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        rating: 4.5,
        category: 'Skincare'
      },
      {
        id: 2,
        name: 'Matte Lipstick',
        price: 399,
        discountPrice: 299,
        imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
        rating: 4.8,
        category: 'Makeup'
      },
      {
        id: 3,
        name: 'Hair Serum',
        price: 599,
        discountPrice: 449,
        imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
        rating: 4.6,
        category: 'Haircare'
      },
      {
        id: 4,
        name: 'Body Mist',
        price: 499,
        discountPrice: 399,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        rating: 4.7,
        category: 'Fragrance'
      }
    ]);

    setCategories([
      { id: 1, name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', count: 45 },
      { id: 2, name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300', count: 67 },
      { id: 3, name: 'Haircare', image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=300', count: 34 },
      { id: 4, name: 'Fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300', count: 23 }
    ]);

    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Sparkles className="h-12 w-12 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your Natural Beauty
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100">
              Premium cosmetics for every skin type
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-50 transition-all transform hover:scale-105 shadow-lg">
                Shop Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all">
                Explore Categories
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Top brands and authentic products</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Shopping</h3>
            <p className="text-gray-600">Simple and secure checkout</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick shipping across India</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <button className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2">
            View All <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.count} Products</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <button className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2">
              View All <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all group overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-pink-600" />
                  </button>
                  {product.discountPrice && (
                    <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-pink-600 font-semibold">{product.category}</span>
                  <h3 className="text-lg font-bold mt-1 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{product.discountPrice}</span>
                      {product.price !== product.discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Get Beauty Tips & Special Offers</h2>
          <p className="text-pink-100 mb-8">Subscribe to our newsletter for exclusive deals</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-pink-300"
            />
            <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                GlowBeauty
              </h3>
              <p className="text-gray-400">Your trusted cosmetics destination</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Skincare</li>
                <li className="hover:text-white cursor-pointer">Makeup</li>
                <li className="hover:text-white cursor-pointer">Haircare</li>
                <li className="hover:text-white cursor-pointer">Fragrance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Shipping</li>
                <li className="hover:text-white cursor-pointer">Returns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GlowBeauty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;