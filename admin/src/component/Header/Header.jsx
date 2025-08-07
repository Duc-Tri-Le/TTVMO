import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/sign-in");
    window.location.reload();
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  return (
    <div className="header-container">
      <div className="header-logo">TRI DUC</div>
      <div className="header-middle"></div>
      <div className="header-right">
        {token && userId ? (
          <>
            <span className="header-welcome">Xin chào!</span>
            <div className="header-avatar">AVATAR</div>
            <button onClick={handleLogout} className="header-btn logout">
              Log Out
            </button>
          </>
        ) : (
          <>
            <a href="/sign-in" className="header-btn login">
              Sign In
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
