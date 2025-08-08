import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import CourseType from "../../component/CourseType/CourseType";
import "./Course.css";

const Course = () => {
  const { listCourse, URL, token, setListCourse } = useContext(StoreContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterCourse, setFilterCourse] = useState({
    level: "",
    program: "",
    subject: "",
  });
  const [isAccept, setIsAccept] = useState(false);
  const courseFilter = listCourse?.filter((course) => {
    // 1. Lọc theo trạng thái
    if (statusFilter === "all") {
      if (course.trangThai === "chua_chap_nhan") {
        return false;
      }
    } else {
      if (course.trangThai !== statusFilter) {
        return false;
      }
    }

    // 2. Lọc theo level / program / subject nếu có chọn
    if (filterCourse.level && course.capHoc_id !== Number(filterCourse.level))
      return false;
    if (filterCourse.program && course.CTH_id !== Number(filterCourse.program))
      return false;
    if (filterCourse.subject && course.LKH_id !== Number(filterCourse.subject))
      return false;

    return true;
  });

  const acceptCourse = async (khoaHoc_id) => {
    const response = await fetch(
      `${URL}/api/course/acceptCourse?khoaHoc_id=${khoaHoc_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await response.json();
    const updatedList = listCourse.map((course) => {
      if (course.khoaHoc_id === khoaHoc_id) {
        return { ...course, trangThai: "chap_nhan" };
      }
      return course;
    });
    setListCourse(updatedList);
    setStatusFilter("all")
    alert(data);
  };
  console.log(listCourse);
  return (
    <div className="course-container">
      <div className="course-select">
        {[
          { label: "All", value: "all" },
          { label: "Pending ", value: "chua_chap_nhan" },
        ].map((state) => (
          <span
            key={state.value}
            className={statusFilter === state.value ? "active" : ""}
            onClick={() => setStatusFilter(state.value)}
          >
            {state.label}
          </span>
        ))}
      </div>
      <div className="course-type">
        <CourseType onFilter={(filter) => setFilterCourse(filter)} />
      </div>
      <div className="table-wrapper">
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên khoá học</th>
              <th>Hạn đăng ký </th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Mô tả</th>
              <th>Số SV tối đa</th>
              <th>Số SV hiện tại</th>
              <th>Ngày tạo</th>
              <th>Giảng viên</th>
              {statusFilter === "chua_chap_nhan" && <th>Trạng thái</th>}
            </tr>
          </thead>
          <tbody>
            {courseFilter?.map((course, index) => (
              <tr key={course.khoaHoc_id}>
                <td>{index + 1}</td>
                <td>{course?.tenKhoaHoc}</td>
                <td>{new Date(course.hanDangKy).toLocaleString("vi-VN")}</td>
                <td>{new Date(course.ngayBatDau).toLocaleString("vi-VN")}</td>
                <td>{new Date(course.ngayKetThuc).toLocaleString("vi-VN")}</td>
                <td>{course?.mota}</td>
                <td>{course?.soHVTD || "_"}</td>
                <td>{course.soSVHT}</td>
                <td>{new Date(course.ngayTao).toLocaleString("vi-VN")}</td>
                <td>{course.giang_vien}</td>
                {course.trangThai ===
                  "chua_chap_nhan" && (
                    <td onClick={() => acceptCourse(course.khoaHoc_id)}>
                      Chấp nhận
                    </td>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Course;
