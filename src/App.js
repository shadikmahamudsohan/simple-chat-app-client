import './App.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');
function App() {
  // const []
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  // for auto scroll
  const contentRef = useRef(null);

  // setting the user id in local storage
  const id = localStorage.getItem('userId');
  useEffect(() => {
    if (!id || id === "undefined") {
      console.log("you");
      localStorage.setItem('userId', socket.id);
    }
  }, [socket.id]);
  // console.log(id);

  // sending messages to server
  const sendMessage = () => {
    socket.emit("send_message", { message, room, id });
  };

  // sending room to join
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  //  receiving the message from server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages(data);
    });
    socket.on("all_messages", data => {
      setMessages(data);
    });
  }, [socket]);

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="App">
      <div className='container' ref={contentRef}>
        {messages[0]?.messages?.map(data => (
          <div className='message-container'>
            <h1 key={data.id} className={`message ${data.id === id ? "right" : "left"} `}>{data.message}</h1>
          </div>
        ))}
        <div>
          <div className='input-container'>
            <input onChange={(e) => setMessage(e.target.value)} type="text" placeholder='Message...' />
            <button onClick={sendMessage}>Send</button><br />
          </div>
          <div className='input-container'>
            <input onChange={(e) => setRoom(e.target.value)} type="text" placeholder='Room...' />
            <button onClick={joinRoom}>Join</button><br />
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
