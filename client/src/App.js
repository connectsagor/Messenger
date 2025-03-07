import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import { initializeApp } from "firebase/app";
import { createContext, useEffect, useState } from "react";
import Profile from "./components/Profile/Profile";

import { onlineUsers } from "./socket";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? user : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem("isLoggedIn") === "true");
  }, []);

  return (
    <UserContext.Provider
      value={[
        { user, setUser },
        { isLoggedIn, setIsLoggedIn },
        { myData, setMyData },
        { onlineUsers },
      ]}
    >
      <BrowserRouter>
        <Routes>
          {isLoggedIn ? (
            <Route exact path="/" element={<Profile />}></Route>
          ) : (
            <Route exact path="/" element={<Login />}></Route>
          )}
          <Route exact path="/sign-up" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
