import React, { useEffect, useState } from "react";
import { BellSlashFill, Chat, PersonCircle } from "react-bootstrap-icons";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Profile.css";
import io from "socket.io-client";
let socket;

const Profile = () => {
  const [allUser, setAllUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const loggedInuserNow = JSON.parse(sessionStorage.getItem("user"));
  const currentUserId = loggedInuserNow.uid;

  useEffect(() => {
    socket = io("http://localhost:5000");

    const handleMessage = (data) => {
      if (data.sender !== currentUserId) {
        // Avoid adding the sender's own message
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
      socket.disconnect();
    };
  }, [currentUserId]);

  console.log("messages", messages);

  useEffect(() => {
    fetch("http://localhost:5000/api/get-users?currentUserId=" + currentUserId)
      .then((res) => res.json())
      .then((data) => {
        setAllUser(data.user);
      });
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    const messageData = { text: messageInput, sender: currentUserId };

    socket.emit("message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);

    setMessageInput("");
  };

  const handleGetUser = (id) => {
    fetch(`http://localhost:5000/api/get-user?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChatUser(data.user);
      });
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="row">
          <div className="col-md-2 p-4">
            <div className="sidebar d-flex justify-content-start">
              <Chat className="logo display-6" />
            </div>
          </div>
          <div className="col-md-8 p-4">
            <div className="messages mb-4 d-flex justify-content-center">
              <h2>Messages</h2>
            </div>
          </div>
          <div className="col-md-2 p-4">
            <div className="user-profile d-flex gap-4">
              <BellSlashFill className="display-6" />
              {false ? (
                <img src={""} alt="user" />
              ) : (
                <PersonCircle className="display-6" />
              )}
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-md-3">
            <div className="user-chat">
              <div className="all-chat-user shadow-lg p-3 height-full">
                {allUser &&
                  allUser.map((user) => {
                    return (
                      <div
                        onClick={() => handleGetUser(user.uid)}
                        className="users d-flex gap-3 my-4"
                      >
                        <div className="user-profile">
                          {user.photo ? (
                            <img src={user.photo} alt="user" />
                          ) : (
                            <PersonCircle className="m-0 display-6" />
                          )}
                        </div>
                        <div className="user-info">
                          <h6 className="m-0">{user.name}</h6>
                          <p>Online now</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="chat-box shadow-lg p-3 height-full">
              <div className="top-box user-chat-box shadow-sm ">
                {chatUser && (
                  <div className="chat-header">
                    <div className="user-chat-box-img">
                      {chatUser[0].photo ? (
                        <img src={chatUser[0].photo} alt="user" />
                      ) : (
                        <PersonCircle className="m-0 display-6" />
                      )}
                    </div>
                    <div className="user-chat-info">
                      <h5 className="m-0">{chatUser[0].name}</h5>
                      <p>Online</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="middle-box">
                <div className="message-box shadow-lg p-3">
                  <ScrollToBottom className="messages-container">
                    {messages && messages.length > 0 ? (
                      messages.map((message, index) => {
                        return (
                          <div
                            key={index}
                            className={`message ${
                              message.sender === currentUserId
                                ? "sent"
                                : "received"
                            }`}
                          >
                            <p>{message.text}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p>No messages yet</p>
                    )}
                  </ScrollToBottom>
                </div>
              </div>
              <div className="bottom-box">
                <div className=" px-3 d-flex gap-3">
                  <div className="sms-box">
                    <div className="message"></div>
                  </div>
                  <div className="chat-messages mt-4 ">
                    <input
                      className="py-2 px-3 border-1"
                      type="text"
                      name="message"
                      placeholder="Type a message"
                      onChange={(e) => setMessageInput(e.target.value)}
                      value={messageInput}
                    />
                    <button
                      onClick={sendMessage}
                      className="main-bg py-2 px-3 border-0"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="user-view d-flex justify-content-center shadow-lg p-3 height-full">
              {chatUser && (
                <div className="user-chat-view">
                  <div className="user-profile mb-3">
                    {chatUser[0].photo ? (
                      <img src={chatUser[0].photo} alt="user" />
                    ) : (
                      <PersonCircle className="m-0 display-6" />
                    )}
                  </div>
                  <div className="user-info">
                    <h6 className="m-0">{chatUser[0].name}</h6>
                    <p>{chatUser[0].bio}</p>
                    <p>{chatUser[0].location}</p>
                    <p>{chatUser[0].phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
