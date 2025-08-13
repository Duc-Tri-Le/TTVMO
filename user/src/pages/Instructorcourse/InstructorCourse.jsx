import React, { useState } from "react";
import "./InstructorCourse.css";
import ManagerUser from "../ManagerUser/ManagerUser";
import { useContext } from "react";
import { StoreContext } from "../../../context/StoreContext";

const InstructorCourse = () => {
  const {instructorCourse } = useContext(StoreContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const courseFilter = instructorCourse?.filter((course) => {
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
    return true;
  });
  return (
    <ManagerUser>
      <div className="instructor-course-container">
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
              </tr>
            </thead>
            <tbody>
              {courseFilter?.map((course, index) => (
                <tr key={course.khoaHoc_id}>
                  <td>{index + 1}</td>
                  <td>{course?.tenKhoaHoc}</td>
                  <td>{new Date(course.hanDangKy).toLocaleString("vi-VN")}</td>
                  <td>{new Date(course.ngayBatDau).toLocaleString("vi-VN")}</td>
                  <td>
                    {new Date(course.ngayKetThuc).toLocaleString("vi-VN")}
                  </td>
                  <td>{course?.mota}</td>
                  <td>{course?.soHVTD || "_"}</td>
                  <td>{course.HVHT}</td>
                  <td>{new Date(course.ngayTao).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerUser>
  );
};

export default InstructorCourse;
