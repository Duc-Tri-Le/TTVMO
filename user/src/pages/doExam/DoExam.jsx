import React, { use, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import "./DoExam.css";

const DoExam = () => {
  const location = useLocation();
  const { URL } = useContext(StoreContext);
  const [ifQuestion, setIfQuestion] = useState([]);
  const [userAnswer, setUserAnswer] = useState({});
  const { exam, user_exam_id } = location.state || [];


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
      [index]: {question_id, answer_id}
    }
    setUserAnswer(update);
    localStorage.setItem("userExam", JSON.stringify(update))
  };
  
  const submitExam = () => {
    fetch(`${URL}/api/exercise/submitExam`, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({userAnswer, user_exam_id})
    })
  }
  console.log(userAnswer);
  return (
    <div className="exam-container">
      <p>{exam?.tenBKT}</p>
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
                        checked = {userAnswer[index]?.answer_id === answerIds[i]}
                        onChange={() => handleChooseAnswer(index, question?.cauHoi_id, answerIds[i])}
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
