import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";

const AddExam = () => {
  const location = useLocation();
  const { khoaHoc_id, nguoiTao_id } = location.state || {};
  const {URL} = useContext(StoreContext);
  const [tenBKT, setTenBKT] = useState("");
  const [timeLimit, setTimeLimit] = useState("40");
  const [numberQuestion, setNumberQuestion] = useState(1);
  const token = localStorage.getItem("token");
  const [ifQuestions, setIfQuestions] = useState([
    { tenCauHoi: "", ifAnswers: ["", "", "", ""], correctAnswerIndex:"" },
  ]);

  console.log({ifQuestions, khoaHoc_id, nguoiTao_id});

  // Thêm câu hỏi mới
  const addQuestion = () => {
    setIfQuestions([
      ...ifQuestions,
      { tenCauHoi: "", ifAnswers: ["", "", "", ""], correctAnswerIndex:"" },
    ]);
    setNumberQuestion((prev) => prev + 1);
  };

  // Xử lý thay đổi nội dung câu hỏi
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...ifQuestions];
    newQuestions[index].tenCauHoi = value;
    setIfQuestions(newQuestions);
  };

  // Xử lý thay đổi câu trả lời
  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...ifQuestions];
    newQuestions[qIndex].ifAnswers[aIndex] = value;
    setIfQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tenBKT) {
      alert("Vui lòng nhập tên bài kiểm tra");
      return;
    }

    const ifExercise = {
      tenBKT,
      khoaHoc_id,
      nguoiTao_id,
      time_limit: timeLimit,
      number_question: numberQuestion,
    };

    console.log("Dữ liệu bài kiểm tra gửi lên:", { ifExercise, ifQuestions });

    const response = fetch(`${URL}/api/exercise/addExercise`,{
      method : "POST",
      headers : {
        "Content-Type" : 'application/json',
        "Authorization" : token
      },
      body : JSON.stringify({ifExercise,ifQuestions})
    })

    // Reset form
    setTenBKT("");
    setTimeLimit("40");
    setNumberQuestion(1);
    setIfQuestions([{ tenCauHoi: "", ifAnswers: ["", "", "", ""], correctAnswerIndex }]);
  };

  const handleDeleteQuestion = (index) => {
    setIfQuestions((question) => question.filter((_, i) => i !== index)),
      setNumberQuestion((prev) => prev - 1);
  };
  return (
    <div className="add-exam-container">
      <h2>Tạo bài kiểm tra mới</h2>
      <form onSubmit={handleSubmit} className="add-exam-form">
        <div>
          <label htmlFor="tenBKT">Tên bài kiểm tra *</label>
          <br />
          <input
            type="text"
            id="tenBKT"
            value={tenBKT}
            onChange={(e) => setTenBKT(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <div>
          <label htmlFor="timeLimit">Thời gian làm bài(Phút)</label>
          <br />
          <input
            type="text"
            id="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            maxLength={10}
          />
        </div>

        <hr />

        <h3>Danh sách câu hỏi</h3>
        {ifQuestions.map((q, qIndex) => (
          <div key={qIndex} style={{ marginBottom: "20px" }}>
            <label>Câu hỏi {qIndex + 1} *</label>
            <div
              className="delete-question"
              onClick={() => handleDeleteQuestion(qIndex)}
            >
              X
            </div>
            <br />
            <input
              type="text"
              value={q.tenCauHoi}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
              style={{ width: "80%" }}
            />
            <div style={{ marginLeft: "15px", marginTop: "8px" }}>
              {q.ifAnswers.map((ans, aIndex) => (
                <div key={aIndex}>
                  <label>
                    Câu trả lời {aIndex + 1} *
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      checked={q.correctAnswerIndex === aIndex}
                      onChange={() => {
                        const newQuestions = [...ifQuestions];
                        newQuestions[qIndex].correctAnswerIndex = aIndex;
                        setIfQuestions(newQuestions);
                      }}
                    />
                  </label>
                  <br />
                  <input
                    type="text"
                    value={ans}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    required
                    style={{ width: "70%" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          style={{ marginBottom: "15px" }}
        >
          Thêm câu hỏi mới
        </button>

        <br />
        <button type="submit" style={{ marginTop: "15px" }}>
          Tạo bài kiểm tra
        </button>
      </form>
    </div>
  );
};

export default AddExam;
