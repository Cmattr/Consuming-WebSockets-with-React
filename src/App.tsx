import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RealTimeChart from './Components/RealTimeChart';

const socket = io("http://127.0.0.1:5000");

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    console.log("Connecting to server...");
    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleSetTimer = () => {
    console.log("Setting timer:", timer);
    socket.emit('set_timer', { time: timer });
  };

  return (
    <div>
      <h1>Real-Time Timer</h1>
      <div>
        <input
          type="number"
          value={timer}
          onChange={(e) => setTimer(Number(e.target.value))}
          placeholder="Set Timer (seconds)"
        />
        <button onClick={handleSetTimer}>Start Timer</button>
      </div>
      <RealTimeChart socket={socket} />
    </div>
  );
};

export default App;
