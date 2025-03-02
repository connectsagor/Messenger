import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

function Chat({ userId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(""); // ID of the person you want to send message to

  useEffect(() => {
    // Register user when component loads
    socket.emit("registerUser", userId);

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const sendMessage = () => {
    if (message.trim() && receiverId) {
      socket.emit("sendMessage", { senderId: userId, receiverId, message });
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId}: </strong> {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
