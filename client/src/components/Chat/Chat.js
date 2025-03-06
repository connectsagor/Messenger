// import { useEffect, useState } from "react";
// import socket from "../../socket";

// const Chat = ({ chatId }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     socket.emit("joinChat", chatId);

//     socket.on("receiveMessage", (newMessage) => {
//       setMessages((prev) => [...prev, newMessage]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [chatId]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     const newMessage = { content: message, chat: chatId };
//     socket.emit("sendMessage", newMessage);
//     setMessages((prev) => [...prev, newMessage]);
//     setMessage("");
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((msg, idx) => (
//           <p key={idx}>{msg.content}</p>
//         ))}
//       </div>
//       <input value={message} onChange={(e) => setMessage(e.target.value)} />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default Chat;
