import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="header-container">
      <div className="header-logo">TTVMO</div>

      <nav className="header-nav">
        <a href="/">Trang chủ</a>
        <a href="/khoa-hoc">Khóa học</a>
        <a href="/lien-he">Liên hệ</a>
      </nav>

      <div className="header-auth-buttons">
        {isLoggedIn ? (
          <>
            <span className="header-welcome">Xin chào!</span>
            <button onClick={handleLogout} className="header-btn logout">
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <a href="/sign-in-up" className="header-btn login">
              Đăng nhập
            </a>
            <a href="/sign-in-up" className="header-btn register">
              Đăng ký
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
