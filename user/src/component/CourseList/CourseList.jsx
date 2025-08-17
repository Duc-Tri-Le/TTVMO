import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
import "./courseList.css";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const navigate = useNavigate();
  const { listCourse } = useContext(StoreContext);

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số khóa học mỗi trang

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = listCourse?.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const totalPages = Math.ceil((listCourse?.length || 0) / itemsPerPage);

  const handleCourse = (course) => {
    navigate(`/detail/course/${course.tenKhoaHoc}`, {
      state: { course: course },
    });
  };

  return (
    <div className="course-list-wrapper">
      <div className="course-list-container">
        {currentCourses?.map((course) => (
          <div
            className="course-list-item"
            key={course.khoaHoc_id}
            onClick={() => handleCourse(course)}
          >
            <div className="course-list-image">{course.hinhanh}</div>
            <div className="course-list-name">{course.tenKhoaHoc}</div>
            <div className="course-list-price">Học phí: {course.giaca}</div>
            <div className="course-list-time">
              Thời gian học:{" "}
              {Math.ceil(
                (new Date(course.ngayKetThuc) - new Date(course.ngayBatDau)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              ngày
            </div>
            <div className="course-list-instructor">
              Giảng viên: {course.giang_vien}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Tiếp ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseList;
