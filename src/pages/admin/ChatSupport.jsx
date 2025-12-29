import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import api from '../../services/api';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatSupport = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  useEffect(() => {
    loadChatRooms();
    connectWebSocket();
    
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8083/ws');
    const stomp = Stomp.over(socket);
    
    stomp.connect({}, () => {
      setConnected(true);
    });
    
    stompClient.current = stomp;
  };

  const loadChatRooms = async () => {
    try {
      const response = await api.get('/chat/rooms');
      setChatRooms(response.data);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const response = await api.get(`/chat/room/${roomId}/messages`);
      setMessages(response.data);
      
      if (stompClient.current && connected) {
        stompClient.current.subscribe(`/topic/messages/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !stompClient.current || !selectedRoom) return;

    const message = {
      chatRoomId: selectedRoom.id,
      senderId: 1, // Admin ID
      senderName: 'Support Team',
      senderType: 'ADMIN',
      message: newMessage,
    };

    stompClient.current.send('/api/chat/send', {}, JSON.stringify(message));
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Chat Rooms List */}
      <div className="w-80 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
        <div className="bg-pink-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Active Chats ({chatRooms.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full p-4 border-b text-left hover:bg-gray-50 transition-colors ${
                selectedRoom?.id === room.id ? 'bg-pink-50 border-l-4 border-pink-600' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">{room.userName}</p>
                {room.unreadCount > 0 && (
                  <span className="bg-pink-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {room.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(room.lastMessageAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col">
        {selectedRoom ? (
          <>
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-bold">{selectedRoom.userName}</h3>
              <p className="text-sm text-gray-600">User ID: {selectedRoom.userId}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      msg.senderType === 'ADMIN'
                        ? 'bg-pink-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.senderType === 'ADMIN' ? 'text-pink-200' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSupport;