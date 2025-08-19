import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import "./CompleteExam.css";

const CompleteExam = () => {
  const location = useLocation();
  const { is_complete, exam_id, user_exam_id } = location.state || {};
  const { URL } = useContext(StoreContext);
  const [ifExam, setIfExam] = useState([]);
  const [isCorrect, setIsCorrect] = useState([]);
  const [ifQuestion, setIfQuestion] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response1 = await fetch(
        `${URL}/api/exercise/detailExercise?BKT_id=${exam_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response1.json();
      setIfQuestion(result);

      const response = await fetch(
        `${URL}/api/exercise/complete/exam?user_exam_id=${user_exam_id}&BKT_id=${exam_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setIfExam(data.result);
      setIsCorrect(data.answer_id_correct);
    };
    loadData();
  }, []);

  // console.log({ifExam, isCorrect});
  const mergedData = ifQuestion?.map((question) => {
    const userResult = ifExam.find(
      (res) => res.cauHoi_id === question.cauHoi_id
    );

    const correctAns = isCorrect.find(
      (c) => c.cauHoi_id === question.cauHoi_id
    )?.answer_id_correct;

    const answers = question.answer_content.split(",");
    const answerIds = question.answer_id.split(",");

    return {
      ...question,
      answers: answers.map((ans, idx) => ({
        id: answerIds[idx],
        content: ans.trim(),
      })),
      userAnswerId: userResult?.answer_id || null,
      isCorrect: userResult?.is_correct === "1",
      correctAnswerId: correctAns || null,
    };
  });

  return (
    <div className="complete-exam-container">
      {mergedData?.map((q, index) => (
        <div
          key={index}
          className={`question-card ${q.isCorrect ? "correct" : "incorrect"}`}
        >
          <h4 className="question-title">Câu {q.tenCauHoi}</h4>
          <ul className="answer-list">
            {q.answers.map((ans) => {
              const isUserChoice = ans.id === q.userAnswerId;
              const isCorrectAnswer = ans.id == q.correctAnswerId;

              return (
                <li
                  key={ans.id}
                  className={`answer-item
          ${isUserChoice ? "user-choice" : ""}
          ${isUserChoice && q.isCorrect ? "correct" : ""}
          ${isUserChoice && !q.isCorrect ? "incorrect" : ""}
          ${
            !isUserChoice && !q.isCorrect && isCorrectAnswer
              ? "correct-answer"
              : ""
          }
        `}
                >
                  {ans.content}
                  {isUserChoice && " ← Bạn chọn"}
                  {!isUserChoice &&
                    !q.isCorrect &&
                    isCorrectAnswer &&
                    " ← Đáp án đúng"}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CompleteExam;
