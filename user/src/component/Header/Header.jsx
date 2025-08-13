import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId")
    window.location.href = "/sign-in-up";
  };

  const [menuItems] = useState([
    { id: 1, label: "Thông tin cá nhân", to: "/account/profile" },
    { id: 3, label: "Đăng xuất", action: handleLogout },
  ]);

  useEffect(() => {
    // Kiểm tra token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);


  return (
    <header className="header-container">
      <div className="header-logo">TTVMO</div>

      <nav className="header-nav">
        <a href="/home">Trang chủ</a>
        <a href="/khoa-hoc">tài liệu</a>
        <a href="/lien-he">Liên hệ</a>
      </nav>

      <div className="header-auth-buttons">
        {isLoggedIn ? (
          <div
            className="header-welcome-menu"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <span className="header-welcome">Xin chào!</span>
            {showMenu && (
              <div className="dropdown-menu">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => {
                      if (item.action) item.action();
                    }}
                  >
                    {item.to ? <a href={item.to}>{item.label}</a> : item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <a href="/sign-in-up" className="header-btn login">
              Đăng nhập
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
