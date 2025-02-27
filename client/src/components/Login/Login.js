import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login">
      <h3 className="my-3">Login</h3>
      <form className="d-flex flex-column gap-3">
        <input
          className="py-2 px-3 border-1 input-field"
          type="email"
          placeholder="Email"
        />
        <input
          className="py-2 px-3 border-1 input-field"
          type="password"
          placeholder="Password"
        />
        <button className="py-2 px-3 border-0 main-bg rounded-1" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
