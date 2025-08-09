import React, { useContext, useState, useEffect, useRef } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [levelEducation, setLevelEducation] = useState([]);
  const [program, setProgram] = useState([]);
  const [subject, setSubject] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  const { URL } = useContext(StoreContext);
  const sidebarRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseLeave = () => {
      setSelectedLevel("");
      setSelectedProgram("");
    };

    const sidebarEl = sidebarRef.current;
    if (sidebarEl) {
      sidebarEl.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebarEl) {
        sidebarEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

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

  return (
    <>
      {(selectedLevel || selectedProgram) && (
        <div
          className="sidebar-overlay"
          onClick={() => {
            setSelectedLevel("");
            setSelectedProgram("");
          }}
        />
      )}
      <div className="sidebar-container" ref={sidebarRef}>
        {/* Cột cấp học */}
        <div className="sidebar-column">
          {levelEducation?.map((level) => (
            <div
              className="sidebar-level-education"
              key={level.capHoc_id}
              onMouseEnter={() => setSelectedLevel(level.capHoc_id)}
              onClick={() =>
                navigate(
                  `/online/course/${level.tenCapHoc.replace(/\s+/g, "")}`,
                  {
                    state: { capHoc_id: level.capHoc_id },
                  }
                )
              }
            >
              {level?.tenCapHoc}
            </div>
          ))}
        </div>

        {/* Cột chương trình */}
        {selectedLevel && (
          <div className="sidebar-column">
            {program?.map((p) => (
              <div
                className="sidebar-program"
                key={p.CTH_id}
                onMouseEnter={() => setSelectedProgram(p.CTH_id)}
                onClick={() =>
                  navigate(
                    `/online/course/${p.ten_CTH.replace(/\s+/g, "")}
                    `,
                    { state: { CTH_id: p.CTH_id } }
                  )
                }
              >
                {p.ten_CTH}
              </div>
            ))}
          </div>
        )}

        {/* Cột môn học */}
        {selectedProgram && (
          <div className="sidebar-column">
            {subject?.map((s) => (
              <div
                className="sidebar-subject"
                key={s.LKH_id}
                onClick={() =>
                  navigate(
                    `/online/course/${s.tenLKH.replace(/\s+/g, "")}
                    `,
                    { state: { LKH_id: s.LKH_id } }
                  )
                }
              >
                {s.tenLKH}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
