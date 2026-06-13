import { useState, useEffect } from 'react';

export const useLiveRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // WebSocket / API call placeholder
    setRooms([{ id: 'room1', name: 'AI Study Group' }]);
  }, []);

  return { rooms };
};
