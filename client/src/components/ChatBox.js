import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Your server URL

const ChatBox = ({ userType, chatWith }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');

  useEffect(() => {
    let roomName = '';

    // Hardcoded room logic for consistent room names
    if (
      (userType === 'customer' && chatWith === 'driver') ||
      (userType === 'driver' && chatWith === 'customer')
    ) {
      roomName = 'customer-driver';
    } else if (
      (userType === 'customer' && chatWith === 'business') ||
      (userType === 'business' && chatWith === 'customer')
    ) {
      roomName = 'customer-business';
    } else if (
      (userType === 'customer' && chatWith === 'admin') ||
      (userType === 'admin' && chatWith === 'customer')
    ) {
      roomName = 'customer-admin';
    } else if (
      (userType === 'driver' && chatWith === 'business') ||
      (userType === 'business' && chatWith === 'driver')
    ) {
      roomName = 'driver-business';
    } else if (
      (userType === 'driver' && chatWith === 'admin') ||
      (userType === 'admin' && chatWith === 'driver')
    ) {
      roomName = 'driver-admin';
    } else if (
      (userType === 'business' && chatWith === 'admin') ||
      (userType === 'admin' && chatWith === 'business')
    ) {
      roomName = 'business-admin';
    }

    setRoom(roomName);
    socket.emit('joinRoom', roomName);

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userType, chatWith]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData = { room, message, sender: userType };
      socket.emit('sendMessage', messageData);
      setMessage('');
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Chat with {chatWith.charAt(0).toUpperCase() + chatWith.slice(1)}
      </Typography>
      <Box
        sx={{
          height: 200,
          overflowY: 'auto',
          mb: 2,
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px',
        }}
      >
        {messages.map((msg, index) => (
          <Typography
            key={index}
            sx={{ textAlign: msg.sender === userType ? 'right' : 'left', mb: 1 }}
          >
            <strong>{msg.sender}:</strong> {msg.message}
          </Typography>
        ))}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSendMessage} fullWidth>
        Send
      </Button>
    </Box>
  );
};

export default ChatBox;
