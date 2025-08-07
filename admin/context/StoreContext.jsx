import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const URL = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const location = useLocation();
  const routePath = location.pathname;
  const [listInstructor, setListInstructor] = useState([]);
  const [listStudent, setListStudent] = useState([]);

  useEffect(() => {
    const loadData = () => {
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
    };
    loadData();
  }, []);

  async function getListInstructor(token) {
    try {
      const response = await fetch(`${URL}/api/user/getInstructor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();
      if (data.length > 0) {
        setListInstructor(data);
      }
    } catch (error) {
      console.log("error instructor : ", error);
    }
  }

  const getStudent = async (token) => {
    try {
      const response = await fetch(`${URL}/api/user/get-student`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setListStudent(data.listStudent);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const tokenFromStorage = localStorage.getItem("token");
      if (routePath === "/instructor" && tokenFromStorage) {
        await getListInstructor(tokenFromStorage);
      } else if (routePath === "/student" && tokenFromStorage) {
        await getStudent(tokenFromStorage);
      }
    };
    getData();
  }, []);

  const deleteUser = async (taiKhoan_id) => {
    const response = await fetch(`${URL}/api/user/deleteUser`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ taiKhoan_id }),
    });
    const data = await response.json();
    alert(data.message);
    setListStudent(prev => prev.filter(user => user.taiKhoan_id !== taiKhoan_id));
    setListInstructor(prev => prev.filter(user => user.taiKhoan_id !== taiKhoan_id));
  };

  const lockUser = async (taiKhoan_id, action) => {
    const response = await fetch(`${URL}/api/user/lockUser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ taiKhoan_id, action }),
    });
    const data = await response.json();
    console.log(data);
    alert(data.message);

    setListStudent((prev) =>
      prev.map((user) =>
        user.taiKhoan_id === taiKhoan_id
          ? { ...user, status: action === "lock" ? "locked" : "" }
          : user
      )
    );
    setListInstructor((prev) =>
      prev.map((user) =>
        user.taiKhoan_id === taiKhoan_id
          ? { ...user, status: action === "lock" ? "locked" : "" }
          : user
      )
    );
  };

  const ContextValue = {
    URL,
    token,
    userId,
    listInstructor,
    deleteUser,
    lockUser,
    getStudent,
    listStudent,
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
