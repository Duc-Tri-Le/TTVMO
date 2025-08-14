import React, { useContext, useEffect, useState } from "react";
import "./InstructorStatistic.css";
import { StoreContext } from "../../../context/StoreContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InstructorStatistic = ({ userId }) => {
  const { URL, InstructorCourse, instructorCourse } = useContext(StoreContext);
  const [statistic, setStatistic] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const token = localStorage.getItem("token");
  const [listStudent, setListStudent] = useState([]);
  const [listStudentCourse, setListStudentCourse] = useState([]);
  const [courseId, setCourseId] = useState();

  useEffect(() => {
    const loadData = async () => {
      await InstructorCourse(userId, token);
    };
    loadData();
  }, [userId]);

  const handleSelectCourse = async (course) => {
    const response = await fetch(
      `${URL}/api/statistic/instructor?course_id=${course.khoaHoc_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await response.json();
    setStatistic(data.result);
    setListStudent(data.rows);
    setSelectedCourse(course);
    setCourseId(course.khoaHoc_id);
  };

  const handleStatisticStudent = async (course_id, user_id) => {
    const response = await fetch(
      `${URL}/api/statistic/student?course_id=${course_id}&user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await response.json();
    setListStudentCourse(data);
  };

  return (
    <div
      className="instructor-statistic-course-container"
      style={{ display: "flex", gap: "20px" }}
    >
      {/* Danh sách khóa học bên trái */}
      <div className="course-list" style={{ flex: 1 }}>
        <h3>Danh sách khóa học</h3>
        <ul>
          {instructorCourse?.map((course) => (
            <li
              key={course.khoaHoc_id}
              onClick={() => handleSelectCourse(course)}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor:
                  selectedCourse?.khoaHoc_id === course.khoaHoc_id
                    ? "#d3f2ff"
                    : "#f5f5f5",
                marginBottom: "5px",
                borderRadius: "5px",
              }}
            >
              {course.tenKhoaHoc}
            </li>
          ))}
        </ul>
      </div>

      {/* Biểu đồ thống kê bên phải */}
      <div className="course-statistic" style={{ flex: 2 }}>
        <h3>Thông tin thống kê</h3>
        {selectedCourse ? (
          <div>
            <p>
              <strong>Doanh thu:</strong>{" "}
              {(
                Number(selectedCourse.giaca) * selectedCourse.HVHT
              ).toLocaleString()}
              * VND
            </p>
            <p>
              <strong>Học viên hiện tại:</strong> {selectedCourse.HVHT}/
              {selectedCourse.soHVTD}
            </p>

            <h4>Bài kiểm tra</h4>
            {statistic.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statistic}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tenBKT" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="avg_score"
                    fill="#8884d8"
                    name="Điểm trung bình"
                  />
                  <Bar
                    dataKey="total_correct_answers"
                    fill="#82ca9d"
                    name="Số câu đúng"
                  />
                  <Bar
                    dataKey="total_user_exam"
                    fill="#ffc658"
                    name="Số người làm"
                  />
                  <Bar dataKey="total_exam" fill="#ff8042" name="Số bài làm" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Chưa có thống kê bài kiểm tra cho khóa học này</p>
            )}
            {listStudent.length > 0 ? (
              listStudent.map((student) => (
                <div
                  key={student.taiKhoan_id}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    borderBottom: "1px solid #ddd",
                  }}
                  onClick={() =>
                    handleStatisticStudent(courseId, student.taiKhoan_id)
                  }
                >
                  {student.tenDangNhap}
                </div>
              ))
            ) : (
              <p>Không có học viên nào</p>
            )}

            {/* Biểu đồ học viên */}
            {listStudentCourse.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Thống kê của học viên</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={listStudentCourse}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tenBKT" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="avg_score"
                      fill="#8884d8"
                      name="Điểm trung bình"
                    />
                    <Bar
                      dataKey="total_correct_answers"
                      fill="#82ca9d"
                      name="Số câu đúng"
                    />
                    <Bar
                      dataKey="total_exam"
                      fill="#ffc658"
                      name="Số bài làm"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <p>Vui lòng chọn một khóa học để xem thống kê</p>
        )}
      </div>
    </div>
  );
};

export default InstructorStatistic;
