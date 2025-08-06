import React from "react";
import "./Home.css";
import Header from "../../component/Header/Header.jsx";
import Banner from "../../component/Banner/Banner.jsx";
import Footer from "../../component/Footer/Footer.jsx";
import CourseList from "../../component/CourseList/CourseList.jsx";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";

const Home = () => {
  return (
    <div className="container-home">
      <div className="header-home">
        <Header />
      </div>
      <div className="banner-sidebar-home">
        <div className="sidebar-home">
          <Sidebar />
        </div>
        <div className="banner-home">
          <Banner />
        </div>
      </div>
      <div className="course-list-home">
        <CourseList />
      </div>
      <div className="footer-home">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
