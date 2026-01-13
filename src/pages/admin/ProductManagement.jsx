import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    brandId: '',
    size: '',
    weight: '',
    ingredients: '',
    isFeatured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getActiveCategories(),
        brandService.getActiveBrands(),
      ]);
      setProducts(productsData.content || []);
      setCategories(categoriesData || []);
      setBrands(brandsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
      size: product.size || '',
      weight: product.weight || '',
      ingredients: product.ingredients || '',
      isFeatured: product.isFeatured || false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      stockQuantity: '',
      imageUrl: '',
      categoryId: '',
      brandId: '',
      size: '',
      weight: '',
      ingredients: '',
      isFeatured: false,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          {/*  Mobile Cards View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow p-4 flex gap-4"
              >
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/100'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.brand?.name}
                  </p>

                  <p className="font-bold mt-1">
                    ₹{product.discountPrice || product.price}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.stockQuantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      Stock: {product.stockQuantity}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*  Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <img
                        src={
                          product.imageUrl ||
                          'https://via.placeholder.com/100'
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.brand?.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {product.category?.name}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">
                        ₹{product.discountPrice || product.price}
                      </p>
                      {product.discountPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.price}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.stockQuantity > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/*  Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price*
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock Quantity*
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category*
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brand*
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandId: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imageUrl: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ingredients
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ingredients: e.target.value,
                    })
                  }
                  className="input-field"
                  rows="2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                <label className="text-sm font-medium">
                  Featured Product
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
