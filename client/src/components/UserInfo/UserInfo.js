import React, { useContext, useState } from "react";
import { XCircle, PersonCircle } from "react-bootstrap-icons";

import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const UserInfo = ({ openUser, closeUser, isUserOpen, chatUser }) => {
  return (
    <div className="profile-info modal-container">
      <Modal
        isOpen={isUserOpen}
        onRequestClose={closeUser}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h6>Welcome to, {chatUser[0]?.name}'s Profile</h6>
        <XCircle className="cancel-button" onClick={closeUser} />
        <div className="profile-user-info d-flex gap-3 flex-column text-start  p-5">
          <div className="user-info">
            <p>
              <strong>Email:</strong> {chatUser[0]?.email}
            </p>
          </div>
          <div className="user-info">
            <p>
              <strong>Bio:</strong> {chatUser[0]?.bio}
            </p>
          </div>
          <div className="user-info">
            <p>
              <strong>Location:</strong> {chatUser[0]?.location}
            </p>
          </div>
          <div className="user-info">
            <p>
              <strong>Phone:</strong> {chatUser[0]?.phone}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserInfo;
