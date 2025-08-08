import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import "./CourseType.css";

const CourseType = ({ onFilter }) => {
  const [levelEducation, setLevelEducation] = useState([]);
  const [program, setProgram] = useState([]);
  const [subject, setSubject] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectSubject, setSelectSubject] = useState("");

  const { URL } = useContext(StoreContext);

  // Lấy danh sách cấp học
  useEffect(() => {
    fetch(`${URL}/api/course/levelEducation`)
      .then((res) => res.json())
      .then((data) => setLevelEducation(data))
      .catch((err) => console.error(err));
  }, [URL]);

  // Lấy chương trình khi chọn cấp học
  useEffect(() => {
    if (!selectedLevel) return;
    fetch(`${URL}/api/course/program?capHoc_id=${selectedLevel}`)
      .then((res) => res.json())
      .then((data) => setProgram(data))
      .catch((err) => console.error(err));
  }, [selectedLevel, URL]);

  // Lấy môn học khi chọn chương trình
  useEffect(() => {
    if (!selectedProgram) return;
    fetch(`${URL}/api/course/subject?CTH_id=${selectedProgram}`)
      .then((res) => res.json())
      .then((data) => setSubject(data))
      .catch((err) => console.error(err));
  }, [selectedProgram, URL]);
  const filterCourse = () => {
    onFilter({
      level: selectedLevel,
      program: selectedProgram,
      subject: selectSubject,
    });
  };
  return (
    <div className="course-type-container">
      <h3>Chọn khóa học</h3>
      {/* Chọn cấp học */}
      <select
        value={selectedLevel}
        onChange={(e) => {
          setSelectedLevel(e.target.value);
          setSelectedProgram("");
          setSubject([]);
        }}
      >
        <option value="">-- Chọn cấp học --</option>
        {levelEducation.map((level) => (
          <option key={level.capHoc_id} value={level.capHoc_id}>
            {level.tenCapHoc}
          </option>
        ))}
      </select>

      {/* Chọn chương trình */}
      <select
        value={selectedProgram}
        onChange={(e) => {
          setSelectedProgram(e.target.value);
        }}
        disabled={!selectedLevel}
      >
        <option value="">-- Chọn chương trình --</option>
        {program.map((prog) => (
          <option key={prog.CTH_id} value={prog.CTH_id}>
            {prog.ten_CTH}
          </option>
        ))}
      </select>

      {/* Chọn môn học */}
      <select
        disabled={!selectedProgram}
        onChange={(e) => {
          setSelectSubject(e.target.value);
        }}
      >
        <option value="">-- Chọn môn học --</option>
        {subject.map((sub) => (
          <option key={sub.LKH_id} value={sub.LKH_id}>
            {sub.tenLKH}
          </option>
        ))}
      </select>

      <button className="course-type-button" onClick={() => filterCourse()}>Lọc</button>
    </div>
  );
};

export default CourseType;
