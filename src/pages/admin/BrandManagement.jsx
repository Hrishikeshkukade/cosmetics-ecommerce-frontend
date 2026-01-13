import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { brandService } from '../../services/brandService';

const BrandManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await brandService.getAllBrands();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await brandService.updateBrand(editingCategory.id, formData);
      } else {
        await brandService.createBrand(formData);
      }
      setShowModal(false);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await brandService.deleteBrand(id);
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      logoUrl: category.logoUrl || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      logoUrl: '',
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Brand Management</h2>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                <div className="w-full h-40 sm:h-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      category.logoUrl ||
                      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
                    }
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-base sm:text-lg mb-1 truncate">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description || 'No description'}
                  </p>

                  <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No brands available.
            </p>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl w-full max-w-md p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg sm:text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name*
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
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingCategory ? 'Update' : 'Add'} Category
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

export default BrandManagement;
