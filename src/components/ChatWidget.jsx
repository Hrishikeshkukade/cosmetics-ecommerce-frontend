import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Package, CreditCard, Truck, HelpCircle, RotateCcw, ShoppingBag, LogIn, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ChatbotWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [waitingFor, setWaitingFor] = useState(null);
  const messagesEndRef = useRef(null);

  const quickOptions = [
    { id: 'track', icon: Truck, label: 'Track Order', color: 'from-blue-500 to-blue-600' },
    { id: 'myorders', icon: Package, label: 'My Orders', color: 'from-purple-500 to-purple-600' },
    { id: 'products', icon: ShoppingBag, label: 'Browse Products', color: 'from-pink-500 to-rose-600' },
    { id: 'offers', icon: Package, label: 'Current Offers', color: 'from-orange-500 to-orange-600' },
    { id: 'returns', icon: RotateCcw, label: 'Returns & Refunds', color: 'from-purple-500 to-purple-600' },
    { id: 'support', icon: HelpCircle, label: 'Customer Support', color: 'from-indigo-500 to-indigo-600' }
  ];

  useEffect(() => {
    if (isAuthenticated && isOpen && messages.length === 0) {
      addBotMessage(`Hi ${user?.username || 'there'}! 👋 Welcome back! How can I help you today?`);
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const extractOrderIdentifier = (input) => {
    if (!input) return null;
    const cleaned = input.trim().replace(/^#/, '');
    if (cleaned.toUpperCase().startsWith('ORD')) {
      return cleaned;
    }
    const digits = cleaned.match(/\d+/);
    return digits ? digits[0] : null;
  };

  const addBotMessage = (text, type = 'text', data = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        messageType: type,
        text: text,
        data: data,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    }]);
  };

  const fetchMyOrders = async () => {
    try {
      const response = await api.get(`/orders/my-orders?page=0&size=10`);
      if (response.data && response.data.content && response.data.content.length > 0) {
        addBotMessage("Here are your recent orders:", 'orders', response.data.content.slice(0, 5));
      } else {
        addBotMessage("You don't have any orders yet. Would you like to browse our products?");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      addBotMessage("Sorry, I couldn't fetch your orders. Please try again later.");
    }
  };

  const trackOrder = async (orderIdentifier) => {
    try {
      const isOrderNumber = orderIdentifier.toString().includes('ORD') || isNaN(orderIdentifier);
      const endpoint = isOrderNumber
        ? `/orders/order-number/${orderIdentifier}`
        : `/orders/${orderIdentifier}`;
      const response = await api.get(endpoint);
      if (response.data) {
        addBotMessage("Here's your order status:", 'order-detail', response.data);
      } else {
        addBotMessage(`Sorry, I couldn't find order ${orderIdentifier}. Please check the order number.`);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      if (error.response?.status === 404) {
        addBotMessage(`Order ${orderIdentifier} not found. Please verify your order number.`);
      } else if (error.response?.status === 403) {
        addBotMessage("You don't have permission to view this order.");
      } else {
        addBotMessage("Sorry, I couldn't fetch order details. Please try again.");
      }
    }
  };

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      if (response.data && response.data.length > 0) {
        addBotMessage(`Here are some ${category} products:`, 'products', response.data.slice(0, 6));
      } else {
        addBotMessage(`No products found in ${category} category.`);
      }
    } catch (error) {
      addBotMessage("Sorry, I couldn't fetch products. Please try again.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data && response.data.length > 0) {
        addBotMessage("Choose a category to explore:", 'categories', response.data);
      }
    } catch (error) {
      addBotMessage("Sorry, I couldn't fetch categories.");
    }
  };

  const handleOptionClick = (option) => {
    addUserMessage(option.label);
    setShowOptions(false);
    switch (option.id) {
      case 'track':
        setWaitingFor('order');
        addBotMessage("Please enter your order number (e.g., ORD1767010881241 or just the ID like 1, 2, 3...)");
        break;
      case 'myorders':
        fetchMyOrders();
        setTimeout(() => setShowOptions(true), 1500);
        break;
      case 'products':
        fetchCategories();
        setTimeout(() => setShowOptions(true), 1500);
        break;
      case 'offers':
        addBotMessage("🎉 Today's Special Offers:\n\n• 50% OFF on Skincare\n• Buy 2 Get 1 Free on Lipsticks\n• Free Shipping on orders above ₹999\n• Extra 10% on first order\n\nUse code: BEAUTY50");
        setTimeout(() => setShowOptions(true), 1000);
        break;
      case 'returns':
        addBotMessage("Our return policy:\n\n✓ 30-day return window\n✓ Free return shipping\n✓ Full refund\n\nTo initiate a return, provide your order number.");
        setWaitingFor('return-order');
        break;
      case 'support':
        addBotMessage("Need human assistance?\n\n📧 support@cosmetics.com\n📞 +91-1234567890\n⏰ 9 AM - 9 PM\n\nOr continue chatting!");
        setTimeout(() => setShowOptions(true), 1000);
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userInput = inputMessage.trim();
    addUserMessage(userInput);
    setInputMessage('');
    setShowOptions(false);

    if (waitingFor === 'order') {
      const orderIdentifier = extractOrderIdentifier(userInput);
      if (orderIdentifier) {
        setWaitingFor(null);
        await trackOrder(orderIdentifier);
        setTimeout(() => setShowOptions(true), 1500);
      } else {
        addBotMessage("Please enter a valid order number (e.g. ORD1767010881241 or 1, 2, 3)");
      }
      return;
    }

    if (waitingFor === 'return-order') {
      const orderId = parseInt(userInput);
      if (!isNaN(orderId)) {
        setWaitingFor(null);
        addBotMessage(`Return request initiated for order #${orderId}. Our team will contact you within 24 hours.`);
        setTimeout(() => setShowOptions(true), 1000);
      } else {
        addBotMessage("Please enter a valid order number.");
      }
      return;
    }
  };

  const getOrderStatusBadge = (status) => {
    const config = {
      PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      PROCESSING: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      SHIPPED: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      DELIVERED: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
      CANCELLED: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    const s = config[status] || config.PENDING;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s.color}`}>
        <Icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  const renderMessage = (msg) => {

    if (msg.messageType === 'orders' && msg.data) {
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium mb-3">{msg.text}</p>
          {msg.data.map(order => (
            <div key={order.id} className="bg-gray-50 p-3 rounded-lg border max-w-full">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">{order.orderNumber || `Order #${order.id}`}</span>
                {getOrderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-gray-600">₹{order.totalAmount}</p>
              <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
              <button
                onClick={() => {
                  const orderNum = order.orderNumber || order.id;
                  trackOrder(orderNum);
                }}
                className="text-xs text-pink-600 font-medium mt-2 hover:underline"
              >
                Track Order →
              </button>
            </div>
          ))}
        </div>
      );
    }


    if (msg.messageType === 'order-detail' && msg.data) {
      const order = msg.data;
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium mb-2">{msg.text}</p>
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200 max-w-full">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-base">Order {order.orderNumber || `#${order.id}`}</h4>
                <p className="text-xs text-gray-600">{new Date(order.orderDate).toLocaleString()}</p>
              </div>
              {getOrderStatusBadge(order.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">₹{order.totalAmount}</span>
              </div>
              {order.shippingAddress && (
                <div>
                  <p className="text-gray-600 text-xs mt-2">Shipping to:</p>
                  <p className="text-xs">{order.shippingAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (msg.messageType === 'categories' && msg.data) {
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium mb-3">{msg.text}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {msg.data.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  addUserMessage(category.name);
                  setShowOptions(false);
                  fetchProductsByCategory(category.name);
                  setTimeout(() => setShowOptions(true), 1500);
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (msg.messageType === 'products' && msg.data) {
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium mb-3">{msg.text}</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {msg.data.map(product => (
              <div key={product.id} className="bg-white p-3 rounded-lg border hover:border-pink-300 transition-colors max-w-full">
                <div className="flex gap-3">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-pink-600">₹{product.price}</span>
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-xs text-pink-600 font-medium hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-line leading-relaxed break-words">{msg.text}</p>;
  };

  // Mobile-safe open button
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50">
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
      </button>
    );
  }

  // Main chatbot container, responsive for small screens
  return (
    <div className={`fixed bottom-6 right-3 w-[calc(100%-1rem)] sm:w-[420px] max-w-[100vw] bg-white rounded-2xl shadow-2xl z-50 flex flex-col ${isMinimized ? 'h-16' : 'h-[80vh] sm:h-[600px]'}`}>

      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">Beauty Assistant</h3>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Online - Here to help!</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setMessages([]); setShowOptions(true); setWaitingFor(null); addBotMessage(`Chat reset! How can I help, ${user?.username}?`); }} className="hover:bg-white/20 p-2 rounded-lg">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-2 rounded-lg">
            <Minimize2 className="h-4 w-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-full sm:max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {renderMessage(msg)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-[50%] px-4 py-3 rounded-2xl shadow-sm">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {showOptions && (
            <div className="p-3 border-t border-gray-200 flex flex-wrap gap-2 justify-center sm:justify-start overflow-x-auto">
              {quickOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white bg-gradient-to-r ${option.color} hover:scale-105 transition-all text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" /> {option.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex p-3 border-t border-gray-200 gap-2">
            <input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} className="p-2 rounded-full bg-pink-500 hover:bg-rose-500 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotWidget;
