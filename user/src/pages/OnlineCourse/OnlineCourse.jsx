import React, { useContext, useEffect, useState } from "react";
import "./OnlineCourse.css";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import CourseList from "../../component/CourseList/CourseList";

const OnlineCourse = () => {
  const location = useLocation();
  const { capHoc_id, LKH_id, CTH_id } = location.state || {};
  const { getCourses } = useContext(StoreContext);

  useEffect(() => {
    const loadData = async () => {
      await getCourses(capHoc_id, CTH_id, LKH_id);
    };
    loadData();
  }, [capHoc_id, LKH_id, CTH_id]);
  
  return (
    <CourseList/>
  );
};

export default OnlineCourse;
