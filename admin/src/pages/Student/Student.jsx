import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import "./Student.css";

const Student = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { listStudent, deleteUser,lockUser } = useContext(StoreContext);

  const studentFilter = listStudent?.filter((user) => {
    if (statusFilter === "all") {
      return user.status !== "locked";
    }
    return user.status === statusFilter 
  });

  console.log({listStudent,studentFilter});

  return (
    <div className="student-container">
      <div className="student-select">
        {[
          { label: "All", value: "all" },
          { label: "Locked", value: "locked" },
        ].map((state) => (
          <span
            key={state.value}
            className={statusFilter === state.value ? "active" : ""}
            onClick={() => setStatusFilter(state.value)}
          >
            {state.label}
          </span>
        ))}
      </div>
      <div className="student-table" >
        <table>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Create at</th>
              <th>Role</th>
              <th>Delete </th>
              {statusFilter === "locked" ? <th>Unlock</th> : <th>Lock</th>}
            </tr>
          </thead>
          <tbody>
            {studentFilter?.map((user) => (
              <tr key={user.taiKhoan_id}>
                <td>{user.tenDangNhap}</td>
                <td>{user.email}</td>
                <td>{user.SDT}</td>
                <td>{new Date(user.ngayTao).toLocaleDateString()}</td>
                <td>Student</td>
                <td onClick={() => deleteUser(user.taiKhoan_id)}>X</td>
                {statusFilter === "locked" ? (
                  <td onClick={() => lockUser(user.taiKhoan_id, "unlock")}>
                    Unlock
                  </td>
                ) : (
                  <td onClick={() => lockUser(user.taiKhoan_id, "lock")}>
                    Lock
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Student;
