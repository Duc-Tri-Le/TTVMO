import React, { useContext, useEffect, useState } from "react";
import "./OnlineCourse.css";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import CourseList from "../../component/CourseList/CourseList";
import DefaultLayout from "../../DefaultLayout/DefaultLayout";

const OnlineCourse = () => {
  const location = useLocation();
  const { capHoc_id, LKH_id, CTH_id } = location.state || {};
  const { getCourses } = useContext(StoreContext);

  useEffect(() => {
    getCourses(capHoc_id, CTH_id, LKH_id)
  }, [capHoc_id, LKH_id, CTH_id]);

  return <CourseList/>;
};

export default OnlineCourse;
