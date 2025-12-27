import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const discount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all group overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50">
            <Heart className="h-5 w-5 text-gray-600 hover:text-pink-600" />
          </button>
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-xs text-pink-600 font-semibold">
            {product.category?.name || 'Product'}
          </span>
          <h3 className="text-lg font-bold mt-1 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">(4.5)</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;