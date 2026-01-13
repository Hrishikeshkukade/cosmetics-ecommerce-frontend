import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { useWishlist } from '../context/WishlistContext';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products as user types
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const data = await productService.searchProducts({
            keyword: searchQuery,
            page: 0,
            size: 5
          });
          setSearchResults(data.content || []);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const debounce = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setShowSearchResults(false);
      setIsMenuOpen(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">G</span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              GlowBeauty
            </span>
          </Link>

          {/* Desktop Search with Suggestions */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 md:max-h-96 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  >
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-xs md:text-sm line-clamp-1">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-pink-600 font-bold text-xs md:text-sm">₹{product.discountPrice || product.price}</span>
                        {product.discountPrice && (
                          <span className="text-[10px] md:text-xs text-gray-500 line-through">₹{product.price}</span>
                        )}
                      </div>
                    </div>
                    <span className="hidden lg:block text-xs text-gray-500">{product.category?.name}</span>
                  </button>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full p-2 md:p-3 text-center text-pink-600 hover:bg-pink-50 font-medium text-sm"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>

       
          <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium text-sm lg:text-base">
              Products
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-600"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] md:text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-primary-600"
            >
              <Heart className="h-5 w-5 md:h-6 md:w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] md:text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>


           
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-primary-600 text-sm lg:text-base"
                >
                  <User className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="font-medium truncate max-w-[90px] lg:max-w-[140px]">{user.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t px-1 sm:px-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
            </form>

            <div className="space-y-2 text-sm">
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary-600"
              >
                Products
              </Link>
             <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600 flex items-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Wishlist ({wishlistCount})
            </Link>
               <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-600"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-600"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-600"
                  >
                    My Orders
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-700 hover:text-primary-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-primary-600 font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
