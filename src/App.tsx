import './App.css'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Container } from 'react-bootstrap';
import Post from './Components/Create-Post';


const socket = io("http://127.0.0.1:5000");

function App() {
  const [isConnected, setIsConnected] =useState(socket.connected);

  useEffect(() => {
    console.log("connecting to server...");
    socket.on("connect", () => {
      console.log("connected to server");
      setIsConnected(true)
    });

    socket.on("disconneted", () => {
      console.log("Disconnected from server");
      setIsConnected(false)
    });
  }, [isConnected]);

  return (
    <div>
      <h1>Welcome to The Public Post Form</h1>
      <p>Connection Status:
        {isConnected ? "connected" : "Not connected"}
      </p>
      <Container>
        <h2>Create A Post</h2>
        <Post socket={socket} /> 
      </Container>

    </div>
  );
}

export default App;