import React, { use, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import "./DoExam.css";

const DoExam = () => {
  const location = useLocation();
  const { URL } = useContext(StoreContext);
  const [ifQuestion, setIfQuestion] = useState([]);
  const [userAnswer, setUserAnswer] = useState(() => {
    const saved = localStorage.getItem("userExam");
    return saved ? JSON.parse(saved) : {};
  });
  const savedExamInfo = JSON.parse(localStorage.getItem("examInfo")) || {};
  const { exam, user_exam_id } = location.state || savedExamInfo;

  // nếu có exam, lưu lại vào localStorage (để reload không mất)
  useEffect(() => {
    if (exam && user_exam_id) {
      localStorage.setItem("examInfo", JSON.stringify({ exam, user_exam_id }));
    }
  }, [exam, user_exam_id]);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(Number(exam.time_limit) * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${URL}/api/exercise/detailExercise?BKT_id=${exam.BKT_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setIfQuestion(data);
    };
    fetchData();
  }, [exam.BKT_id]);

  const handleChooseAnswer = (index, question_id, answer_id) => {
    const update = {
      ...userAnswer,
      [index]: { question_id, answer_id },
    };
    setUserAnswer(update);
    localStorage.setItem("userExam", JSON.stringify(update));
  };

  const submitExam = async () => {
    await fetch(`${URL}/api/exercise/submitExam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAnswer,
        user_exam_id,
        BKT_id: exam.BKT_id,
        number_question: exam.soCauHoi,
      }),
    });
    localStorage.removeItem("userExam");
    localStorage.removeItem("examInfo");
    navigate(`/complete/exam/${exam.tenBKT}`, {
      state: {
        is_complete: true,
        exam_id: exam.BKT_id,
        user_exam_id,
      },
    });
  };

  const deleteExam = async () => {
    fetch(`${URL}/api/exercise/delete/exam?user_exam_id=${user_exam_id}`, {
      method: "DELETE",
      headers: {
        Content_Type: "application/json",
      },
    });
    localStorage.removeItem("userExam");
    localStorage.removeItem("examInfo");
  };

  // console.log({userAnswer, user_exam_id, BKT_id : exam.BKT_id, number_question : exam.number_question});
  return (
    <div className="exam-container">
      <p>{exam?.tenBKT}</p>
      <div className="timer">⏳ {formatTime(timeLeft)}</div>
      <div className="exam-ifQuestion">
        <div className="exam-ifQuestion">
          {ifQuestion?.map((question, index) => {
            const answerIds = question.answer_id.split(",");
            const answerContents = question.answer_content.split(",");

            return (
              <div key={question.cauHoi_id} className="question-block">
                <p>
                  <b>Câu {index + 1}:</b> {question.tenCauHoi}
                </p>
                <div className="answers">
                  {answerContents.map((content, i) => (
                    <label key={answerIds[i]}>
                      <input
                        type="radio"
                        name={`question-${question.cauHoi_id}`}
                        value={answerIds[i]}
                        checked={userAnswer[index]?.answer_id === answerIds[i]}
                        onChange={() =>
                          handleChooseAnswer(
                            index,
                            question?.cauHoi_id,
                            answerIds[i]
                          )
                        }
                      />
                      {content}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="submit-exam" onClick={() => submitExam()}>
        Nộp bài
      </div>
    </div>
  );
};

export default DoExam;
