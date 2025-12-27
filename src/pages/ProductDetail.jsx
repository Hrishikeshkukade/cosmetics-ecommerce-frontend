import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
        </div>
      </>
    );
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <CartDrawer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full rounded-2xl shadow-lg"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-pink-600 text-white px-4 py-2 rounded-full font-bold">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-pink-600 font-semibold">{product.category?.name}</span>
            <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-gray-600">(4.5) · 156 reviews</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <p className="text-green-600 mt-2">In Stock ({product.stockQuantity} available)</p>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Specifications */}
            <div className="mb-6 space-y-2">
              {product.brand && (
                <p className="text-gray-700">
                  <span className="font-semibold">Brand:</span> {product.brand.name}
                </p>
              )}
              {product.size && (
                <p className="text-gray-700">
                  <span className="font-semibold">Size:</span> {product.size}
                </p>
              )}
              {product.weight && (
                <p className="text-gray-700">
                  <span className="font-semibold">Weight:</span> {product.weight}
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-lg hover:bg-gray-100"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="p-2 border rounded-lg hover:bg-gray-100"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button className="p-3 border-2 border-pink-600 rounded-lg hover:bg-pink-50">
                <Heart className="h-6 w-6 text-pink-600" />
              </button>
            </div>

            {/* Additional Info */}
            {product.ingredients && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Ingredients:</h3>
                <p className="text-gray-700 text-sm">{product.ingredients}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;