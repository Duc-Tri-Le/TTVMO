import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DetailCourse.css";
import { StoreContext } from "../../../context/StoreContext";
import Review from "../../component/Review/Review";
import ManagerCourse from "../../component/ManagerCourse/ManagerCourse";
import StudentCourse from "../../component/StudentCourse/StudentCourse";

const DetailCourse = () => {
  const location = useLocation();
  const { course } = location.state || {};
  const { URL } = useContext(StoreContext);
  const [listLesson, setListLesson] = useState([]);
  const user_id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [listExam, setListExam] = useState([])
  // console.log({user_id, gv: course.gv_id});
  if (!course) {
    return <p>Không tìm thấy thông tin khóa học.</p>;
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `${URL}/api/lesson/getLesson?khoaHoc_id=${course.khoaHoc_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setListLesson(data);

        const getExam =  await fetch(`${URL}/api/exercise/listExercise?khoaHoc_id=${course.khoaHoc_id}`, {
          method : "GET",
          headers : {
            "Content-Type" : "application/json"
          }
        })
        const exam = await getExam.json();
        setListExam(exam.result)
      } catch (error) {
        console.error("Lỗi load bài học:", error);
      }
    };
    loadData();
  }, [course.khoaHoc_id, URL]);

  const registerCourse = async (course) => {
    const response = await fetch(`${URL}/api/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course, user_id }),
    });
    const data = await response.json();
    const { url } = data;
    window.location.href = url;
  };
  
  const handleLink = (mien_phi, danh_sach_hoc_vien, e) => {
    const isFree = mien_phi !== "khong";
    const danhSachHocVienArr = danh_sach_hoc_vien
      ? danh_sach_hoc_vien.split(",")
      : [];
    const isRegistered = danhSachHocVienArr.includes(user_id);

    if (!isFree && !isRegistered) {
      e.preventDefault();
      alert("Vui lòng đăng ký khóa học");
      return false;
    }
    return true;
  };

  return (
    <div className="detail-course-wrapper">
      <div className="detail-course-container">
        <div className="if-detail-course">
          <h1>{course.tenKhoaHoc}</h1>
          {course.hinhanh && course.hinhanh !== "null" && (
            <img
              src={course.hinhanh}
              alt={course.tenKhoaHoc}
              className="course-image"
            />
          )}

          <p>
            <strong>Giảng viên:</strong> {course.giang_vien}
          </p>
          <p>
            <strong>Giá:</strong> {Number(course.giaca).toLocaleString()} VNĐ
          </p>
          <p>
            <strong>Mô tả:</strong> {course.mota}
          </p>
          <p>
            <strong>Số học viên tối đa:</strong> {course.soHVTD}
          </p>
          <p>
            <strong>Số học viên hiện tại:</strong> {course.soSVHT || 0}
          </p>
          <p>
            <strong>Ngày bắt đầu:</strong>{" "}
            {course.ngayBatDau &&
              new Date(course.ngayBatDau).toLocaleDateString()}
          </p>
          <p>
            <strong>Ngày kết thúc:</strong>{" "}
            {course.ngayKetThuc &&
              new Date(course.ngayKetThuc).toLocaleDateString()}
          </p>
          <p>
            <strong>Hạn đăng ký:</strong>{" "}
            {course.hanDangKy &&
              new Date(course.hanDangKy).toLocaleDateString()}
          </p>
          {!course?.danh_sach_hoc_vien?.includes(user_id) && (
            <button
              className="button-register-course"
              onClick={() => registerCourse(course)}
            >
              Đăng ký khoá học
            </button>
          )}
        </div>
        {/* bai giang */}
        {listLesson?.map((lesson) => (
          <div className="lesson-item" key={lesson.BG_id}>
            <a
              className="lesson-link"
              href={lesson.videoURL}
              onClick={(e) =>
                handleLink(lesson.mien_phi, course.danh_sach_hoc_vien, e)
              }
            >
              {lesson.tenBG}
            </a>
            {lesson.mien_phi !== "khong" && (
              <p className="lesson-free">Miễn phí</p>
            )}
          </div>
        ))}
        <Review course_id={course.khoaHoc_id} user_id={user_id} URL={URL} />
      </div>
      <div className="manager-course-statistic">
        {role === "giang_vien" && Number(user_id) === course.gv_id ? (
          <ManagerCourse khoaHoc_id={course.khoaHoc_id} nguoiTao_id={user_id} listExam={listExam} />
        ) : (
          <StudentCourse listExam={listExam} list_student={course.danh_sach_hoc_vien} />
        )}
      </div>
    </div>
  );
};

export default DetailCourse;
