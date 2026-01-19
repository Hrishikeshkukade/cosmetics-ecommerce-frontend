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
      // Use my-orders endpoint with pagination
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

    const extracted = extractOrderIdentifier(userInput);

    if (extracted) {
      await trackOrder(extracted);
      setTimeout(() => setShowOptions(true), 1500);
    } else if (lowerMsg.includes('track') || lowerMsg.includes('status')) {
      setWaitingFor('order');
      addBotMessage("Please enter your order number.");
    } else if (lowerMsg.includes('my order')) {
      fetchMyOrders();
      setTimeout(() => setShowOptions(true), 1500);
    } else if (lowerMsg.includes('product') || lowerMsg.includes('buy') || lowerMsg.includes('shop')) {
      fetchCategories();
      setTimeout(() => setShowOptions(true), 1500);
    } else if (lowerMsg.includes('offer') || lowerMsg.includes('discount')) {
      addBotMessage("🎉 Use code BEAUTY50 for 50% OFF! Check current offers for more deals.");
      setTimeout(() => setShowOptions(true), 1000);
    } else if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      addBotMessage("I can help with returns. Please provide your order number.");
      setWaitingFor('return-order');
    } else {
      addBotMessage("I can help you:\n• Track orders\n• View orders\n• Browse products\n• Check offers\n• Process returns");
      setTimeout(() => setShowOptions(true), 1000);
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
            <div key={order.id} className="bg-gray-50 p-3 rounded-lg border">
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
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
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
          <div className="grid grid-cols-2 gap-2">
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
              <div key={product.id} className="bg-white p-3 rounded-lg border hover:border-pink-300 transition-colors">
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

    return <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>;
  };

  if (!isAuthenticated) {
    if (!isOpen) {
      return (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50">
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
        </button>
      );
    }
    return (
      <div className="fixed bottom-6 left-3 right-3 sm:right-6 sm:left-auto w-full max-w-[420px] bg-white rounded-2xl shadow-2xl z-50 h-[400px] flex flex-col">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">Beauty Assistant</h3>
              <p className="text-xs">Login Required</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6">
            <LogIn className="h-10 w-10 text-pink-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Login Required</h3>
          <p className="text-gray-600 mb-6">Please login to access our AI assistant!</p>
          <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Login Now
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? <button onClick={() => navigate('/register')} className="text-pink-600 font-semibold hover:underline">Sign up</button>
          </p>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50">
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 left-3 right-3 sm:right-6 sm:left-auto w-full max-w-[420px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col ${isMinimized ? 'h-16' : 'h-[70vh] sm:h-[600px]'}`}>
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
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
                  {renderMessage(msg)}
                  <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-pink-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl border">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            {showOptions && !isTyping && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 text-center">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button key={option.id} onClick={() => handleOptionClick(option)} className={`bg-gradient-to-r ${option.color} text-white p-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 group`}>
                        <Icon className="h-5 w-5 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 border-t rounded-b-2xl">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder={waitingFor ? "Type your answer..." : "Type your message..."}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Powered by AI • Real-time data</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotWidget; 