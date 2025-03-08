import React from "react";
import { PersonCircle } from "react-bootstrap-icons";

const ChatUserProfile = ({ chatUser }) => {
  return (
    <div className="user-view d-flex justify-content-center text-center shadow-lg p-3 height-full">
      {chatUser && (
        <div className="user-chat-view d-flex flex-column gap-4 ">
          <div className="user-profile mb-3 mt-3">
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
            <h4 className="m-0 my-2 font-monospace">{chatUser[0]?.name}</h4>
            <p className=" my-2 font-monospace">{chatUser[0]?.bio}</p>
            <p className=" my-2 font-monospace">{chatUser[0]?.location}</p>
            <p className=" my-2 font-monospace">{chatUser[0]?.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUserProfile;
