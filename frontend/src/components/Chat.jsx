import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        // Add the user's message to the chat first
        setChat((prevChat) => [
          ...prevChat,
          { user: 'You', text: message }
        ]);

        // Send the user's message to the backend API
        const response = await axios.post('http://localhost:5000/api/chat', { message });

        // Add the AI's response after the user's message
        const aiReply = response.data.reply || 'Sorry, no response from AI.';
        setChat((prevChat) => [
          ...prevChat,
          { user: 'AI', text: aiReply }
        ]);

        setMessage(''); // Clear the input field
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat Header */}
      <div className="p-4 bg-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold">Chit Chat</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.user === 'You' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.user === 'You'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <strong>{msg.user}: </strong>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;