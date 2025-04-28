import React, { useState, useEffect } from 'react';

const TestPage = () => {
  const [message, setMessage] = useState('');

  // Set up WebSocket connection on component mount
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000'); // Connect to WebSocket server

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Received from backend:', event.data);
      setMessage(event.data); 
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>File Upload Status</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestPage;
