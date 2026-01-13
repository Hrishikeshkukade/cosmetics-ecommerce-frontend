import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
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
        await categoryService.updateCategory(editingCategory.id, formData);
      } else {
        await categoryService.createCategory(formData);
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
        await categoryService.deleteCategory(id);
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
      imageUrl: category.imageUrl || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
    });
  };

  return (
    <div className="p-2 sm:p-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Category Management</h2>
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

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={
                  category.imageUrl ||
                  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
                }
                alt={category.name}
                className="w-full h-40 sm:h-48 object-cover"
              />

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-base sm:text-lg mb-2">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
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
                <label className="block text-sm font-medium mb-2">
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
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary min-h-[42px]">
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary min-h-[42px]"
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

export default CategoryManagement;
