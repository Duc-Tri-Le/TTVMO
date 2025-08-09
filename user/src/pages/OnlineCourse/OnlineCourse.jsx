import React, { useContext, useEffect, useState } from "react";
import "./OnlineCourse.css";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";

const OnlineCourse = () => {
  const location = useLocation();
  const { capHoc_id, LKH_id, CTH_id } = location.state || {};
  const { getCourses, listCourse } = useContext(StoreContext);

  useEffect(() => {
    const loadData = async () => {
      await getCourses(capHoc_id, CTH_id, LKH_id);
    };
    loadData();
  }, [capHoc_id, LKH_id, CTH_id]);
  
  return (
    <div className="online-course-container">
      {listCourse?.map((course) => (
        <div className="online-course-iem" key={course.khoaHoc_id}>
          <div className="course-image">{course.hinhanh}</div>
          <div className="course-name">{course.tenKhoaHoc}</div>
          <div className="course-price">Học phí : {course.price}</div>
          <div className="course-time">
            Thời gian học:{" "}
            {Math.ceil(
              (new Date(course.ngayKetThuc) - new Date(course.ngayBatDau)) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            ngày
          </div>
          <div className="course-instructor">
            Giảng viên : {course.giang_vien}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnlineCourse;
