import React from "react";
import { Dot, PersonCircle } from "react-bootstrap-icons";

const AllUserChat = ({ allUser, handleGetUser, onlineUsers }) => {
  return (
    <div className="user-chat">
      <div className="all-chat-user shadow-lg p-3 height-full">
        {allUser &&
          allUser.map((user, index) => {
            return (
              <div
                key={index}
                onClick={() => handleGetUser(user._id)}
                className="users d-flex gap-3 my-4 shadow-lg p-2 rounded-2 "
              >
                <div className="user-profile">
                  {user.photo ? (
                    <div className="d-flex position-relative active-parent">
                      <img
                        className="display-pic shadow-lg"
                        src={`http://localhost:5000/uploads/${user.photo}`}
                        alt="user"
                      />

                      {onlineUsers[0]?.includes(user._id) ? (
                        <p className="">
                          {" "}
                          <Dot className="text-success position-absolute active-child" />{" "}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    <PersonCircle className="m-0 display-6" />
                  )}
                </div>
                <div className="user-info">
                  <h6 className="m-0">{user.name}</h6>
                  {onlineUsers[0]?.includes(user._id) ? (
                    <p className="">Online</p>
                  ) : (
                    <p>Ofline</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AllUserChat;
