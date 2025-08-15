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
  const [listCourse, setListCourse] = useState([]);
  const [statistic, setStatistic] = useState([]);

  useEffect(() => {
    const loadData = () => {
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
    };
    loadData();
  }, []);

  const formatDateLocal = (date) => {
    const d = new Date(date);
  
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // tháng 0-11
    const day = String(d.getDate()).padStart(2, '0');
  
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  async function getListInstructor(tokenFromStorage) {
    try {
      console.log(tokenFromStorage);
      const response = await fetch(`${URL}/api/user/getInstructor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenFromStorage,
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

  const getStudent = async (tokenFromStorage) => {
    try {
      const response = await fetch(`${URL}/api/user/get-student`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenFromStorage,
        },
      });
      const data = await response.json();
      setListStudent(data.listStudent);
    } catch (error) {
      alert(error);
    }
  };

  const getCourse = async () => {
    try {
      const response = await fetch(`${URL}/api/course/getCourse`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setListCourse(data.course);
    } catch (error) {
      alert(error);
    }
  };

  const getStatistic = async (tokenFromStorage,group_by, start_date, end_date) => {
    try {
      const response = await fetch(
        `${URL}/api/statistic/admin?start_date=${start_date}&end_date=${end_date}&group_by=${group_by}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenFromStorage,
          },
        }
      );
      const data = await response.json();
      setStatistic(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const tokenFromStorage = localStorage.getItem("token");
      if (routePath === "/instructor" && tokenFromStorage) {
        await getListInstructor(tokenFromStorage);
      } else if (routePath === "/student" && tokenFromStorage) {
        await getStudent(tokenFromStorage);
      } else if (routePath === "/course" && tokenFromStorage) {
        await getCourse();
      } else if (routePath === "/statistic" && tokenFromStorage) {
        const currentYear = new Date().getFullYear();
        const start_date = new Date(currentYear, 0, 1);
        const end_date = new Date();
        const group_by = 'year'
        await getStatistic(tokenFromStorage,group_by, formatDateLocal(start_date), formatDateLocal(end_date));
      }
    };
    getData();
  }, [routePath]);

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
    setListStudent((prev) =>
      prev.filter((user) => user.taiKhoan_id !== taiKhoan_id)
    );
    setListInstructor((prev) =>
      prev.filter((user) => user.taiKhoan_id !== taiKhoan_id)
    );
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
    formatDateLocal,
    listCourse,
    setListCourse,
    statistic,
    getStatistic
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
