import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerCourse.css";
import { StoreContext } from "../../../context/StoreContext";

const ManagerCourse = ({ khoaHoc_id, nguoiTao_id, listExam }) => {
  // console.log(listExam);
  const navigate = useNavigate();
  const {startExam} = useContext(StoreContext);
  const user_id = localStorage.getItem("userId");
  
  const handleAddExam = () => {
    navigate(`/add/exam`, {
      state: {
        khoaHoc_id,
        nguoiTao_id,

      },
    });
  };

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
  return (
    <div className="manager-course-container">
      <div className="add-exam" onClick={handleAddExam}>
        Thêm bài kiểm tra
      </div>
      {listExam?.length > 0 &&
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
  );
};

export default ManagerCourse;
