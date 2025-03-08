import React, { useContext, useEffect, useState } from "react";
import {
  BellSlashFill,
  Chat,
  Dot,
  Person,
  PersonCircle,
} from "react-bootstrap-icons";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Profile.css";
import { socket } from "../../socket";
import ProfileInfo from "./ProfileInfo";
import axios from "axios";
import { UserContext } from "../../App";
import { connectSocket } from "../../socket";
import UserInfo from "../UserInfo/UserInfo";
import AllUserChat from "../AllUserChat/AllUserChat";
import ChatBox from "../ChatBox/ChatBox";
import ChatUserProfile from "../ChatUserProfile/ChatUserProfile";

const Profile = () => {
  const UserContextData = useContext(UserContext);
  const { myData, setMyData } = UserContextData[2];
  const { onlineUsers } = UserContextData[3];
  const [allUser, setAllUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const loggedInuserNow = JSON.parse(sessionStorage.getItem("user"));
  const currentUserId = loggedInuserNow?.uid;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openUser() {
    setUserOpen(true);
  }

  function closeUser() {
    setUserOpen(false);
  }
  const handleShowProfile = () => {
    if (modalIsOpen) {
      closeModal();
    } else {
      openModal();
    }
  };
  const handleGetProfile = () => {
    if (isUserOpen) {
      closeUser();
    } else {
      openUser();
    }
  };

  const handleGetUser = (id) => {
    fetch(`http://localhost:5000/api/get-user?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChatUser(data.user);
      });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // console.log("New message received:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [chatUser, myData, messages, onlineUsers]);

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

      setMessages((prev) => [...prev, data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
                  className="display-pic my-profile"
                  src={`http://localhost:5000/uploads/${myData[0]?.photo}`}
                  alt="user"
                />
              ) : (
                <PersonCircle
                  onClick={handleShowProfile}
                  className="display-6 my-profile"
                />
              )}
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-md-3">
            {allUser && (
              <AllUserChat
                allUser={allUser}
                handleGetUser={handleGetUser}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
          <div className="col-md-6">
            {chatUser && (
              <ChatBox
                chatUser={chatUser}
                handleGetProfile={handleGetProfile}
                onlineUsers={onlineUsers}
                messages={messages}
                myData={myData}
                setMessage={setMessage}
                message={message}
                sendMessage={sendMessage}
              />
            )}
          </div>
          <div className="col-md-3">
            {chatUser && <ChatUserProfile chatUser={chatUser} />}
            {modalIsOpen ? (
              <ProfileInfo
                openModal={openModal}
                closeModal={closeModal}
                modalIsOpen={modalIsOpen}
                myData={myData}
              />
            ) : (
              ""
            )}
            {isUserOpen ? (
              <UserInfo
                openUser={openUser}
                closeUser={closeUser}
                isUserOpen={isUserOpen}
                chatUser={chatUser}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
