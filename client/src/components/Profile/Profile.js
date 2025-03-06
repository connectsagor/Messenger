import React, { useContext, useEffect, useState } from "react";
import { BellSlashFill, Chat, PersonCircle } from "react-bootstrap-icons";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Profile.css";

import { useFetcher, useNavigate } from "react-router";
import ProfileInfo from "./ProfileInfo";
import axios from "axios";
import { UserContext } from "../../App";
import { connectSocket } from "../../socket";

const Profile = () => {
  const UserContextData = useContext(UserContext);

  const { myData, setMyData } = UserContextData[2];

  const [allUser, setAllUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const loggedInuserNow = JSON.parse(sessionStorage.getItem("user"));
  const currentUserId = loggedInuserNow?.uid;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleShowProfile = () => {
    if (modalIsOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  // useEffect(() => {
  //   socket = io("http://localhost:5000");
  //   // Register user when component loads
  //   socket.emit("registerUser", currentUserId);

  //   // Listen for incoming messages
  //   socket.on("receiveMessage", (data) => {
  //     setMessages((prev) => [...prev, data]);
  //   });

  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, [currentUserId]);

  const handleGetUser = (id) => {
    fetch(`http://localhost:5000/api/get-user?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChatUser(data.user);
      });
  };

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.emit("joinChat", chatId); // Join chat room when component loads

  //   socket.on("receiveMessage", (newMessage) => {
  //     console.log("New message received:", newMessage);
  //     setMessages((prev) => [...prev, newMessage]);
  //   });

  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, [chatId]);

  // useEffect(() => {
  //   const chatId = chatUser?.map((chatU) => chatU.uid);
  //   socket.emit("joinChat", chatId);

  //   socket.on("receiveMessage", (newMessage) => {
  //     setMessages((prev) => [...prev, newMessage]);
  //   });

  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, [chatUser]);

  // const sendMessage = (id) => {
  //   if (messageInput.trim() === "") return;

  //   socket.emit("sendMessage", {
  //     senderId: currentUserId,
  //     receiverId: id,
  //     text: messageInput,
  //   });
  //   setMessageInput("");
  // };

  useEffect(() => {
    fetch("http://localhost:5000/api/get-users?currentUserId=" + currentUserId)
      .then((res) => res.json())
      .then((data) => {
        setAllUser(data.user);
      });
  }, []);

  useEffect(() => {
    fetch(
      "http://localhost:5000/api/get-my-data?currentUserId=" + currentUserId
    )
      .then((res) => res.json())
      .then((data) => {
        setMyData(data.user);
        connectSocket(data.user[0]?._id);
      });
  }, []);

  // useEffect(() => {
  //   // Join chat when chatId changes
  //   socket.emit("joinChat", 1);

  //   socket.on("receiveMessage", (newMessage) => {
  //     setMessages((prev) => [...prev, newMessage]);
  //   });

  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, [chatId]);
  useEffect(() => {
    fetch("http://localhost:5000/api/get-messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: myData[0]._id,
      receiver: chatUser[0]._id,
      text: message,
    };
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/message",
        newMessage
      );
      // socket.emit("sendMessage", data); // Emit message after it's successfully saved
      setMessages((prev) => [...prev, data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  console.log(messages);

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
            <div className="messages mb-4 d-flex justify-content-between">
              <h2>Messages</h2>

              {myData &&
                myData.map((data, index) => {
                  return <h4 key={index}>Welcome {data.name}!</h4>;
                })}
            </div>
          </div>
          <div className="col-md-2 p-4">
            <div className="user-profile d-flex gap-4">
              <BellSlashFill className="display-6" />
              {myData ? (
                <img
                  onClick={handleShowProfile}
                  className="display-pic"
                  src={`http://localhost:5000/uploads/${myData[0]?.photo}`}
                  alt="user"
                />
              ) : (
                <PersonCircle
                  onClick={handleShowProfile}
                  className="display-6"
                />
              )}
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-md-3">
            <div className="user-chat">
              <div className="all-chat-user shadow-lg p-3 height-full">
                {allUser &&
                  allUser.map((user, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => handleGetUser(user._id)}
                        className="users d-flex gap-3 my-4"
                      >
                        <div className="user-profile">
                          {user.photo ? (
                            <img
                              className="display-pic"
                              src={`http://localhost:5000/uploads/${user.photo}`}
                              alt="user"
                            />
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
                  <div className="chat-header d-flex gap-3">
                    <div className="user-chat-box-img">
                      {chatUser[0]?.photo ? (
                        <img
                          className="display-pic"
                          src={`http://localhost:5000/uploads/${chatUser[0]?.photo}`}
                          alt="user"
                        />
                      ) : (
                        <PersonCircle className="m-0 display-6" />
                      )}
                    </div>
                    <div className="user-chat-info">
                      <h5 className="m-0">{chatUser[0]?.name}</h5>
                      <p>Online</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="middle-box">
                <div className="message-box shadow-lg p-3">
                  <ScrollToBottom className="messages-container">
                    {messages &&
                    messages.length > 0 &&
                    myData?.[0]?._id &&
                    chatUser?.[0]?._id ? (
                      messages.map((message, index) => {
                        if (
                          (message.sender === myData[0]._id &&
                            message.receiver === chatUser[0]._id) ||
                          (message.sender === chatUser[0]._id &&
                            message.receiver === myData[0]._id)
                        ) {
                          return (
                            <div
                              key={index}
                              className={`message ${
                                message.sender === myData[0]?._id
                                  ? "sent"
                                  : "received"
                              }`}
                            >
                              <p>{message.text}</p>
                            </div>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <p className="text-center">No messages yet</p>
                    )}
                  </ScrollToBottom>
                </div>
              </div>
              <div className="bottom-box">
                {chatUser && (
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
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                      />
                      <button
                        onClick={sendMessage}
                        className="main-bg py-2 px-3 border-0"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="user-view d-flex justify-content-center shadow-lg p-3 height-full">
              {modalIsOpen ? (
                <ProfileInfo
                  openModal={openModal}
                  closeModal={closeModal}
                  modalIsOpen={modalIsOpen}
                  myData={myData}
                />
              ) : (
                chatUser && (
                  <div className="user-chat-view">
                    <div className="user-profile mb-3">
                      {chatUser[0]?.photo ? (
                        <img
                          className="display-pic"
                          src={`http://localhost:5000/uploads/${chatUser[0]?.photo}`}
                          alt="user"
                        />
                      ) : (
                        <PersonCircle className="m-0 display-6" />
                      )}
                    </div>
                    <div className="user-info">
                      <h6 className="m-0">{chatUser[0]?.name}</h6>
                      <p>{chatUser[0]?.bio}</p>
                      <p>{chatUser[0]?.location}</p>
                      <p>{chatUser[0]?.phone}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
