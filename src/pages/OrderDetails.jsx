import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, Phone, Mail, ArrowLeft, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(id);
        loadOrder();
        alert('Order cancelled successfully');
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order');
      }
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      loadOrder();
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
      PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Processing' },
      SHIPPED: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
      DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
      CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 text-lg mb-4">Order not found</p>
          <button onClick={() => navigate('/orders')} className="btn-primary">
            Back to Orders
          </button>
        </div>
      </>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(isAdmin() ? '/admin/orders' : '/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order #{order.orderNumber}</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
                <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
              </div>
              
              {/* Admin Status Update */}
              {isAdmin() && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-pink-600" />
                Order Items ({order.orderItems?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img
                      src={item.productImage || 'https://via.placeholder.com/100'}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.productName}</h3>
                      <p className="text-gray-600 text-sm mb-2">Quantity: {item.quantity}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-pink-600 font-bold text-lg">₹{item.price}</p>
                          <p className="text-sm text-gray-500">Per item</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-bold text-xl">₹{item.subtotal}</p>
                          <p className="text-sm text-gray-500">Subtotal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Notes</h2>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="h-6 w-6 text-pink-600" />
                Customer Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                {order.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-pink-600" />
                Shipping Address
              </h2>
              <div className="space-y-1 text-gray-700">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingState}</p>
                <p>{order.shippingZipCode}</p>
                <p className="font-medium">{order.shippingCountry}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-pink-600" />
                Payment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Order Total</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-300">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
              </div>
              <div className="border-t border-white/30 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">Total</span>
                  <span className="text-3xl font-bold">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isAdmin() && order.status === 'PENDING' && (
              <button
                onClick={handleCancelOrder}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;