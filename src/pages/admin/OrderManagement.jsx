import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedStatus === 'ALL') {
        data = await orderService.getAllOrders();
      } else {
        data = await orderService.getOrderStatus(selectedStatus);
      }
      setOrders(data.content || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const statuses = [
    'ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === status
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer: {order.customerName} ({order.customerPhone})
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Shipping Address:</p>
                <p className="font-medium">
                  {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-pink-600">₹{order.totalAmount}</p>
                  <p className="text-sm text-gray-600">{order.orderItems?.length || 0} items</p>
                </div>
                   <Link
                  to={`/admin/orders/${order.id}`}
                  className="btn-secondary text-center 
           w-full sm:w-auto
           text-xs sm:text-sm
           py-2 sm:py-2.5
           px-3 sm:px-4"

                >
                  View Full Details
                </Link>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                
              </div>
           
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;