import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Search, Filter, Eye } from 'lucide-react';
import { userApprovalService } from '../../services/UserApprovalService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filter, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        userApprovalService.getAllUsers(),
        userApprovalService.getUserStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(user => 
        user.accountStatus.toLowerCase() === filter.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user?')) return;

    try {
      await userApprovalService.approveUser(userId);
      alert('User approved successfully! Email notification sent.');
      loadData();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const openRejectModal = (user) => {
    setSelectedUser(user);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await userApprovalService.rejectUser(selectedUser.id, rejectionReason);
      alert('User rejected successfully! Email notification sent.');
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
      loadData();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
    };
    const config = badges[status] || badges.PENDING;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">User Management</h2>
        <p className="text-gray-600">Manage user registrations and approvals</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Total Users</h3>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Pending</h3>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">{stats.pending}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Approved</h3>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{stats.approved}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Rejected</h3>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.accountStatus)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetailsModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {user.accountStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openRejectModal(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Reject User Registration</h3>
            <p className="text-gray-600 mb-4">
              You are about to reject <strong>{selectedUser.username}</strong>'s registration.
              Please provide a reason:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Reject User
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <p className="text-gray-900">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedUser.accountStatus)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <p className="text-gray-900">{selectedUser.firstName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  <p className="text-gray-900">{selectedUser.lastName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-gray-900">{selectedUser.phoneNumber || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Registered Date</label>
                <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>

              {selectedUser.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Approved Date</label>
                  <p className="text-gray-900">{new Date(selectedUser.approvedAt).toLocaleString()}</p>
                </div>
              )}

              {selectedUser.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
                  <p className="text-gray-900 bg-red-50 p-3 rounded-lg">{selectedUser.rejectionReason}</p>
                </div>
              )}

              {selectedUser.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{selectedUser.address}</p>
                  <p className="text-gray-600 text-sm">
                    {selectedUser.city}, {selectedUser.state} {selectedUser.zipCode}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              {selectedUser.accountStatus === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApprove(selectedUser.id);
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Approve User
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openRejectModal(selectedUser);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-5 w-5" />
                    Reject User
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;