import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
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
    { to: "/instructor", imgSrc: "", text: "Giảng viên" },
    { to: "/student", imgSrc: "", text: "Học viên" },
    { to: "/course", imgSrc: "", text: "Khoá học" },
    { to : "/statistic", imgSrc : "", text: "Thống kê"}
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

export default Sidebar;
