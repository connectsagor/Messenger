import React from "react";
import { Person, PersonCircle } from "react-bootstrap-icons";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatBox = ({
  chatUser,
  handleGetProfile,
  onlineUsers,
  messages,
  myData,
  setMessage,
  message,
  sendMessage,
}) => {
  return (
    <div className="chat-box shadow-lg p-3 height-full">
      <div className="top-box user-chat-box shadow-sm ">
        {chatUser && (
          <div onClick={handleGetProfile} className="chat-header d-flex gap-3">
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

              {onlineUsers[0]?.includes(chatUser[0]?._id) ? (
                <p>Active Now</p>
              ) : (
                <p>Ofline</p>
              )}
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
                  (message.sender === myData[0]?._id &&
                    message.receiver === chatUser[0]?._id) ||
                  (message.sender === chatUser[0]?._id &&
                    message.receiver === myData[0]?._id)
                ) {
                  return (
                    <div
                      key={index}
                      className={`message ${
                        message.sender === myData[0]?._id ? "sent" : "received"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <div className="d-flex h-100 justify-content-center gap-3 align-items-center">
                <Person className="display-6" />
                <p className="text-center m-0 secondary">
                  Select User to chat..
                </p>
              </div>
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
  );
};

export default ChatBox;
