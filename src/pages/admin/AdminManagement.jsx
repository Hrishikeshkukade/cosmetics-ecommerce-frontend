import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Shield, Eye, EyeOff } from 'lucide-react';
import { adminManagementService } from '../../services/adminManagementService';
import { useAuth } from '../../context/AuthContext';

const AdminManagement = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminManagementService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await adminManagementService.updateAdmin(editingAdmin.id, formData);
        alert('Admin updated successfully!');
      } else {
        await adminManagementService.createAdmin(formData);
        alert('Admin created successfully! Login credentials sent via email.');
      }
      setShowModal(false);
      resetForm();
      loadAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      alert(error.response?.data?.message || 'Failed to save admin');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        await adminManagementService.deleteAdmin(id);
        alert('Admin deleted successfully');
        loadAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert(error.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      firstName: admin.firstName,
      lastName: admin.lastName,
      phoneNumber: admin.phoneNumber || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingAdmin(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    });
    setShowPassword(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Admin Management</h2>
          <p className="text-gray-600">Manage administrator accounts</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Admin
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 mb-1">Total Administrators</p>
            <p className="text-4xl font-bold">{admins.length}</p>
          </div>
          <Shield className="h-16 w-16 text-purple-200" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{admin.username}</p>
                      <p className="text-sm text-gray-500">
                        {admin.firstName} {admin.lastName}
                      </p>
                      {admin.id === user.id && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">You</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{admin.email}</p>
                  <p className="text-sm text-gray-500">{admin.phoneNumber || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(admin)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      disabled={admin.id === user.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title={admin.id === user.id ? "Can't delete yourself" : "Delete"}
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

      {/* Mobile Card Layout */}
      <div className="md:hidden flex flex-col gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{admin.username}</p>
                  <p className="text-sm text-gray-500">{admin.firstName} {admin.lastName}</p>
                  {admin.id === user.id && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <p className="text-sm">{admin.email}</p>
            <p className="text-sm text-gray-500">{admin.phoneNumber || 'N/A'}</p>
            <p className="text-sm text-gray-600">Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(admin)}
                className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded flex justify-center"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(admin.id)}
                disabled={admin.id === user.id}
                className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingAdmin ? 'Edit Admin' : 'Create New Admin'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
             
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username*</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field"
                    required
                    disabled={editingAdmin !== null}
                  />
                  {editingAdmin && <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email*</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name*</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name*</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="input-field"
                  placeholder="+91-1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password* {editingAdmin && '(Leave empty to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pr-10"
                    required={!editingAdmin}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {editingAdmin ? 'Only fill if you want to change the password' : 'Minimum 6 characters required'}
                </p>
              </div>

              <div className="flex gap-4 pt-4 flex-col sm:flex-row">
                <button type="submit" className="flex-1 btn-primary">
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
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

export default AdminManagement;
