import React, { useContext, useState } from "react";
import { Chat } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../../App";
import { connectSocket } from "../../socket";
import toast from "react-hot-toast";

const SignUp = () => {
  const UserContextData = useContext(UserContext);

  const { isLoggedIn, setIsLoggedIn } = UserContextData[1];
  const { myData, setMyData } = UserContextData[2];
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    const auth = getAuth();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        fetch("http://localhost:5000/api/create-users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            uid: user.uid,
            bio,
            location,
            phone,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
        setIsLoggedIn(true);
        sessionStorage.setItem("user", JSON.stringify(user));
        toast.success("Account is created.");
        navigate("/");
      })
      .catch((error) => {
        setIsLoggedIn(false);
        toast.error("Something went wrong");
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <div className="login">
      <Chat className=" display-6 logo" />
      <h3 className="my-3">Sign Up</h3>
      <form onSubmit={handleSignUp} className="d-flex flex-column gap-3">
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="py-2 px-3 border-1 input-field"
          type="text"
          placeholder="Name"
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="py-2 px-3 border-1 input-field"
          type="email"
          placeholder="Email"
        />
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          className="py-2 px-3 border-1 input-field"
          type="text"
          placeholder="Phone"
        />
        <input
          onChange={(e) => setBio(e.target.value)}
          value={bio}
          className="py-2 px-3 border-1 input-field"
          type="text"
          placeholder="Bio"
        />
        <input
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          className="py-2 px-3 border-1 input-field"
          type="text"
          placeholder="City"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="py-2 px-3 border-1 input-field"
          type="password"
          placeholder="Password"
        />
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          className="py-2 px-3 border-1 input-field"
          type="password"
          placeholder="Confirm Password"
        />
        <button className="py-2 px-3 border-0 main-bg rounded-1" type="submit">
          Sign Up
        </button>
      </form>
      <Link className="my-3" to="/">
        Already have an account?
      </Link>
    </div>
  );
};

export default SignUp;
