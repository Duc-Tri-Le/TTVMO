import React, { useContext } from "react";
import "./Home.css";
import Banner from "../../component/Banner/Banner.jsx";
import CourseList from "../../component/CourseList/CourseList.jsx";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";


const Home = () => {
  return (
      <div className="container-home">
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
      </div>
  );
};

export default Home;
