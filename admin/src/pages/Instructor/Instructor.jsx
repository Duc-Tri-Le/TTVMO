import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import "./Instructor.css";

const Instructor = () => {
  const { URL, token, listInstructor, deleteUser, lockUser } =
    useContext(StoreContext);
  const [statusFilter, setStatusFilter] = useState("all");

  const instructorFilter = listInstructor?.filter((user) => {
    if (statusFilter === "all") {
      return user.status !== "waiting for" && user.status !== "locked";
    }
    return user.status === statusFilter;
  });

  const acceptInstructor = async (taiKhoan_id, action) => {
    const response = await fetch(`${URL}/api/user/acceptInstructor`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ taiKhoan_id, action }),
    });
    const data = await response.json();
    alert(data.result.message);
    window.location.reload();
  };

  // console.log({statusFilter, instructorFilter});
  return (
    <div className="instructor-container">
      <div className="instructor-select">
        {[
          { label: "All", value: "all" },
          { label: "Waiting for", value: "waiting for" },
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
      <div className="instructor-table" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Create at</th>
              <th>Role</th>
              {statusFilter !== "waiting for" && <th>Delete </th>}
              {statusFilter === "waiting for" && (
                <>
                  <th>Accept</th>
                  <th>Refuse</th>
                </>
              )}
              <th>Cancel</th>
              {statusFilter === "locked" ? <th>Unlock</th> : <th>Lock</th>}
            </tr>
          </thead>
          <tbody>
            {instructorFilter?.map((user) => (
              <tr key={user.taiKhoan_id}>
                <td>{user.tenDangNhap}</td>
                <td>{user.email}</td>
                <td>{user.SDT}</td>
                <td>{new Date(user.ngayTao).toLocaleDateString()}</td>
                <td>{user.vaiTro_id === 3 ? "Instructor" : "Student"}</td>
                {statusFilter !== "waiting for" && (
                  <td onClick={() => deleteUser(user.taiKhoan_id)}>X</td>
                )}
                {statusFilter === "waiting for" && (
                  <>
                    <td
                      onClick={() =>
                        acceptInstructor(user.taiKhoan_id, "accept")
                      }
                    >
                      Accept
                    </td>
                    <td
                      onClick={() =>
                        acceptInstructor(user.taiKhoan_id, "refuse")
                      }
                    >
                      Refuse
                    </td>
                  </>
                )}
                <td
                  onClick={() => acceptInstructor(user.taiKhoan_id, "refuse")}
                >
                  Cancel
                </td>
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

export default Instructor;
