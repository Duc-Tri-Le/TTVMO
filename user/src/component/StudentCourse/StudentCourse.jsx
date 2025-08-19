import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";

const StudentCourse = ({ listExam, list_student }) => {
  const navigate = useNavigate();
  const {startExam} = useContext(StoreContext)
  const user_id = localStorage.getItem("userId");

  const handleDoExam = async (exam) => {
    const userExam = {
      user_id: user_id,
      exam_id: exam.BKT_id,
    };
    const user_exam_id = await startExam(userExam);
    navigate(`/do/exam/${exam.tenBKT}`, {
      state: { exam: exam, user_exam_id : user_exam_id },
    });
  };
  const list_students = list_student?.split(",")

  return (
    <div className='student-course-container'>
      {listExam?.length > 0 && list_students.includes(user_id)  &&
        listExam.map((exam) => (
          <div className="list-exam" key={exam.id} onClick={() => handleDoExam(exam)}>
            <p className="a-exam">
              <span>Tên bài kiểm tra:</span> {exam.tenBKT}
            </p>
            <p className="a-exam">
              <span>Số câu hỏi:</span> {exam.soCauHoi}
            </p>
            <p className="a-exam">
              <span>Ngày tạo:</span>{" "}
              {new Date(exam.ngayTao).toLocaleDateString("vi-VN")}
            </p>
          </div>
      ))}
    </div>
  )
}

export default StudentCourse
