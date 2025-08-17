import React, { useContext, useEffect, useState } from "react";
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

const StudentStatistic = ({ userId }) => {
  const { URL, getUSerCourse, listCourse } = useContext(StoreContext);
  const [statistic, setStatistic] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      await getUSerCourse(userId);
    };
    loadData();
  }, [userId]);

  const handleSelectCourse = async (course) => {
    const response = await fetch(
      `${URL}/api/statistic/student?course_id=${course.khoaHoc_id}&user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await response.json();
    setStatistic(data);
    setSelectedCourse(course);
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
          {listCourse?.map((course) => (
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
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Chưa có thống kê bài kiểm tra cho khóa học này</p>
            )}
          </div>
        ) : (
          <p>Vui lòng chọn một khóa học để xem thống kê</p>
        )}
      </div>
    </div>
  );
};

export default StudentStatistic;
