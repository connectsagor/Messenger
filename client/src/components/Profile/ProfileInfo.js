import React, { useContext, useState } from "react";
import { X, XCircle, PersonCircle } from "react-bootstrap-icons";

import ReactDOM from "react-dom";
import Modal from "react-modal";
import { UserContext } from "../../App";

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

const ProfileInfo = ({ openModal, closeModal, modalIsOpen, myData }) => {
  //   const UserContextData = useContext(UserContext);

  //   const { myData, setMyData } = UserContextData[2];

  const [imageDP, setImageDP] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImageDP(file);
    }
  };

  const handleUpdateInfo = async (id) => {
    console.log(id);
    const profilePic = new FormData();
    profilePic.append("file", imageDP);

    fetch("http://localhost:5000/api/upload-dp?userId=" + id, {
      method: "PATCH",
      body: profilePic,
      headers: {
        contentType: "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <div className="profile-info modal-container">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h4>Hello, {myData[0].name}</h4>
        <XCircle className="cancel-button" onClick={closeModal} />
        <div className="profile-user-info d-flex gap-3 flex-column text-start  p-5">
          <div className="user-info">
            <label className="upload-img d-flex justify-content-center">
              <input
                name="file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              />
              {myData[0].photo ? (
                <img
                  src={`http://localhost:5000/uploads/${myData[0].photo}`}
                  alt="profile"
                  className="display-pic rounded-full "
                />
              ) : imageDP ? (
                <img
                  src={imagePreview}
                  alt="profile"
                  className="profile-pic rounded-full "
                />
              ) : (
                <PersonCircle className="display-6" />
              )}
            </label>
            <p className="text-sm text-center text-gray-500 mt-2">
              Click to change avatar
            </p>
          </div>

          <div className="user-info">
            <p>
              <strong>Email:</strong> {myData[0].email}
            </p>
          </div>
          <div className="user-info">
            <p>
              <strong>Bio:</strong> {myData[0].bio}
            </p>
          </div>
          <div className="user-info">
            <p>
              <strong>Location:</strong> {myData[0].location}
            </p>
          </div>
          <div className="user-info">
            <p>
              <strong>Phone:</strong> {myData[0].phone}
            </p>
          </div>
          <button
            className="main-bg py-2 px-3 border-0 rounded-1"
            onClick={() => handleUpdateInfo(myData[0].uid)}
          >
            Update Info
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileInfo;
