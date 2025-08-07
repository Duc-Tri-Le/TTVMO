import React from "react";
import Header from "../src/component/Header/Header";
import Sidebar from "../src/component/Sidebar/Sidebar";
import "./DefaultLayout.css"

const DefaultLayout = ({children}) => {

  return (
    <>
      <div className="wrapper">
        <div className="header">
          <Header/>
        </div>
        <div className="container">
          <div className="sidebar">
            <Sidebar/>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
