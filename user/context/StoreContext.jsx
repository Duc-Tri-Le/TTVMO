import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const URL = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [listCourse, setListCourse] = useState([]);
  const [ifUser, setIfUser] = useState([]);
  const [userCourse, setUserCourse] = useState([]);
  const [instructorCourse, setInstructorCourse] = useState([]);
  const [role, setRole] = useState("");
  const [listHistoryExam, setListHistoryExam] = useState([]);

  const pathRoute = window.location.pathname;

  const searchParams = new URLSearchParams(location.search);
  const capHoc_id = searchParams.get("capHoc_id");
  const CTH_id = searchParams.get("CTH_id");
  const LKH_id = searchParams.get("LKH_id");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserId(localStorage.getItem("userId"));
    setRole(localStorage.getItem("role"));
  }, [])

  const getCourses = async (capHoc_id, CTH_id, LKH_id) => {
    try {
      const params = new URLSearchParams();
      if (capHoc_id) params.append("capHoc_id", capHoc_id);
      if (CTH_id) params.append("CTH_id", CTH_id);
      if (LKH_id) params.append("LKH_id", LKH_id);

      const courses = await fetch(
        `${URL}/api/course/getCourse?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const course = await courses.json();
  
      setListCourse(course.course);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };
    
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);  

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload()
    };
    window.addEventListener('popstate', handlePopState);
  
    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, []);  

  const getDetailUser = async (userId) => {
    try {
      const detailUser = await fetch(
        `${URL}/api/user/detail-user?taiKhoan_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await detailUser.json();
      setIfUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUSerCourse = async (userId) => {
    try {
      const userCourse = await fetch(
        `${URL}/api/course/userCourse?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await userCourse.json();
      setListCourse(data);
    } catch (error) {
      console.log(error);
    }
  };

  const InstructorCourse = async (userId, tokenFromStorage) => {
    try {

      const instructorCourse = await fetch(
        `${URL}/api/course/getInstructorCourse?gv_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenFromStorage,
          },
        }
      );
      const data = await instructorCourse.json();
      setInstructorCourse(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListHistoryExam = async (userId) => {
    const response = await fetch(`${URL}/api/exercise/history/exam?user_id=${userId}`, {
      method : "GET",
      headers :{
        "Content-Type" : "application/json"
      }
    })
    const data = await response.json();
    setListHistoryExam(data);
  }

  useEffect(() => {
    const loadData = async () => {
      const tokenFromStorage = localStorage.getItem("token");
      const userIdFromStorage = localStorage.getItem("userId");
      if (pathRoute === "/home") {
        await getCourses(capHoc_id, CTH_id, LKH_id);
      } else if (pathRoute === "/account/profile") {
        await getDetailUser(userIdFromStorage);
      } else if (pathRoute === "/user/course") {
        await getUSerCourse(userIdFromStorage);
      } else if (pathRoute === "/instructor/course") {
        await InstructorCourse(userIdFromStorage, tokenFromStorage);
      } else if(pathRoute === "/history/exam"){
        await getListHistoryExam(userIdFromStorage)
      }
    };
    loadData();
  }, [pathRoute]);

  const startExam = async (userExam) => {
    const response = await fetch(`${URL}/api/exercise/startExam`,{
      method : "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(userExam)
    })
    const data = await response.json();;
    return data.user_exam_id
  }

  const ContextValues = {
    URL,
    token,
    userId,
    ifUser,
    role,
    userCourse,
    instructorCourse,
    InstructorCourse,
    getCourses,
    getUSerCourse,
    listCourse,
    startExam,
    getListHistoryExam,
    listHistoryExam
  };

  return (
    <StoreContext.Provider value={ContextValues}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
