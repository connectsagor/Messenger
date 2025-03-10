import React, { useContext, useEffect, useState } from "react";
import { Chat } from "react-bootstrap-icons";
import toast from "react-hot-toast";
import "./Login.css";
import { Link, useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../../App";

const Login = () => {
  const UserContextData = useContext(UserContext);

  const { isLoggedIn, setIsLoggedIn } = UserContextData[1];
  const { myData, setMyData } = UserContextData[2];

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        toast.success("Successfully logged in");
        navigate("/");
      })
      .catch((error) => {
        setIsLoggedIn(false);
        toast.error("Email or Password is not correct!");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  useEffect(() => {}, []);
  return (
    <div className="login">
      <Chat className=" display-6 logo" />
      <h3 className="my-3">Login</h3>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="py-2 px-3 border-1 input-field"
          type="email"
          placeholder="Email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="py-2 px-3 border-1 input-field"
          type="password"
          placeholder="Password"
        />
        <button className="py-2 px-3 border-0 main-bg rounded-1" type="submit">
          Login
        </button>
      </form>

      <Link className="my-3" to="/sign-up">
        Create an account?
      </Link>
    </div>
  );
};

export default Login;
