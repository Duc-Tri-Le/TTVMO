import React, { useContext } from 'react'
import { StoreContext } from '../../../context/StoreContext.jsx'
import "./courseList.css"
import { useNavigate } from 'react-router-dom'

const CourseList = () => {

  const navigate = useNavigate();
  const {listCourse} = useContext(StoreContext);

  const handleCourse = (course) => {
    navigate(`/detail/course/${course.tenKhoaHoc}`, {
      state : {course : course}
    })
  }
  
  return (
    <div className='course-list-container'>
       {listCourse?.map((course) => (
        <div className="course-list-iem" key={course.khoaHoc_id} onClick={() => handleCourse(course)}>
          <div className="course-list-image">{course.hinhanh}</div>
          <div className="course-list-name">{course.tenKhoaHoc}</div>
          <div className="course-list-price">Học phí : {course.giaca}</div>
          <div className="course-list-time">
            Thời gian học:{" "}
            {Math.ceil(
              (new Date(course.ngayKetThuc) - new Date(course.ngayBatDau)) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            ngày
          </div>
          <div className="course-list-instructor">
            Giảng viên : {course.giang_vien}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseList
