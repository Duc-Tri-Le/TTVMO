import React, { useContext, useState, useEffect } from "react";
import ManagerUser from "../ManagerUser/ManagerUser";
import { StoreContext } from "../../../context/StoreContext";
import "./HistoryExam.css";
import { useNavigate } from "react-router-dom";
const HistoryExam = () => {
  const { listHistoryExam } = useContext(StoreContext);

  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(""); // Khóa học được chọn để lọc
  const [sortKey, setSortKey] = useState(""); // Key để sắp xếp

  // Lọc theo khóa học
  const filteredExams = selectedCourse
    ? listHistoryExam.filter((exam) => exam.tenKhoaHoc === selectedCourse)
    : listHistoryExam;

  // Sắp xếp theo key
  const sortedExams = [...filteredExams].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortKey === "score") return b.score - a.score;
    if (sortKey === "duration") return a.duration.localeCompare(b.duration);
    if (sortKey === "tenBKT") return a.tenBKT.localeCompare(b.tenBKT);
    return 0;
  });

  // Lấy danh sách khóa học duy nhất để chọn lọc
  const courses = [...new Set(listHistoryExam.map((exam) => exam.tenKhoaHoc))];
  const handleExam = (user_exam_id, exam_id, tenBKT) => {
    try {
       
      navigate(`/complete/exam/${tenBKT}`, {
        state: {
          is_complete: true,
          exam_id,
          user_exam_id,
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bài kiểm tra:", error);
    }
  };

  return (
    <ManagerUser>
      <div className="history-exam">
        <h2>Lịch sử bài kiểm tra</h2>

        {/* Lọc khóa học */}
        <label>
          Lọc theo khóa học:
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Tất cả</option>
            {courses.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>

        {/* Sắp xếp */}
        <label>
          Sắp xếp theo:
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="">Không</option>
            <option value="tenBKT">Tên bài kiểm tra</option>
            <option value="duration">Thời gian làm</option>
            <option value="score">Điểm số</option>
          </select>
        </label>

        {/* Bảng hiển thị */}
        <table>
          <thead>
            <tr>
              <th>Khóa học</th>
              <th>Bài kiểm tra</th>
              <th>Thời gian làm</th>
              <th>Điểm số</th>
            </tr>
          </thead>
          <tbody>
            {sortedExams.map((exam, index) => (
              <tr
                key={index}
                onClick={() =>
                  handleExam(exam.user_exam_id, exam.BKT_id, exam.tenBKT)
                }
              >
                <td>{exam.tenKhoaHoc}</td>
                <td>{exam.tenBKT}</td>
                <td>{exam.duration}</td>
                <td>{exam.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerUser>
  );
};

export default HistoryExam;
