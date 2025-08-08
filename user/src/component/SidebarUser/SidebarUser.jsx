import React from "react";
import "./SidebarUser.css";

const SidebarUser = () => {
  const currentPath = window.location.pathname;

  const SidebarOption = ({ to, imgSrc, text, isActive }) => {
    return (
      <a href={to} className={`sidebar-option ${isActive ? "active" : ""}`}>
        <img src={imgSrc} />
        <p>{text}</p>
      </a>
    );
  };

  const SidebarLink = [
    { to: "/account/profile", imgSrc: "", text: "Thông tin người dùng" },
    { to: "/user-course", imgSrc: "", text: "Khoá học đã tham gia" },
    { to: "/course", imgSrc: "", text: "Course" },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-options">
        {SidebarLink.map((link, index) => (
          <SidebarOption
            key={index}
            to={link.to}
            imgSrc={link.imgSrc}
            text={link.text}
            isActive={currentPath === link.to}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarUser;
