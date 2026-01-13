import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || 'India',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      setEditing(false);
      alert('Profile updated successfully!');
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Lock className="h-5 w-5" />
                Change Password
              </button>
              <button
                onClick={() => setEditing(!editing)}
                className="btn-primary flex items-center gap-2"
              >
                {editing ? (
                  <>
                    <Save className="h-5 w-5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-5 w-5" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold truncate">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 flex items-center gap-2 mt-1 truncate">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              <p className="text-gray-600 flex items-center gap-2 mt-1 truncate">
                <User className="h-4 w-4" />
                @{user?.username}
              </p>
              <span className="inline-block mt-3 px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold truncate">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Personal Information */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-pink-600" />
                  Personal Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field w-full"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field w-full"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="input-field pl-10 w-full"
                    disabled={!editing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (Cannot be changed)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email}
                    className="input-field pl-10 bg-gray-100 w-full"
                    disabled
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="sm:col-span-2 mt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-pink-600" />
                  Address Information
                </h3>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter your street address"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter city"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter state"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter ZIP code"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter country"
                  disabled={!editing}
                />
              </div>
            </div>

            {editing && (
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button type="submit" disabled={loading} className="flex-1 btn-primary w-full sm:w-auto">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  className="flex-1 btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-field w-full"
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field w-full"
                  required
                  minLength="6"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field w-full"
                  required
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 btn-primary w-full sm:w-auto">
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
