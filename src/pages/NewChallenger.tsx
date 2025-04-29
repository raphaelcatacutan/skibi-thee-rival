import React, { useEffect, useState } from 'react';
import { Card } from '../utils/types';
import { jsonToCards } from '../utils/parser';

const CardGallery: React.FC = () => {
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [loading, setLoading] = useState(true);

  const fetchCards = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/images?isSkibidi=false')
      .then(res => res.json())
      .then(data => {
        const parsed = jsonToCards(data);
        setCards(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch card data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCards();

    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Received from backend:', event.data);
      fetchCards(); 
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  if (loading) return <div className="p-4 text-lg">Loading cards...</div>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
      {Object.entries(cards).map(([key, card]) => (
        <div
          key={key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "green",
            padding: "10px"
          }}
        >
          <img
            src={`http://localhost:5000/data/${key}.jpg`}
            alt={card.name}
            style={{
              width: '100px',
              height: '300px',
              objectFit: 'cover',
            }}
          />
          <div style={{ fontSize: '0.875rem', fontWeight: 600, textAlign: 'center', marginTop: '4px' }}>
            {card.name}
          </div>
        </div>
      ))}
    </div>
  );
  
  
};

export default CardGallery;
