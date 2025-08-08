import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const URL = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [listCourse, setListCourse] = useState([]);
  const [ifUser, setIfUser] = useState([]);
  const [userCourse, setUserCourse] = useState([]);
  const pathRoute = window.location.pathname;

  const getCourses = async () => {
    try {
      const courses = await fetch(`${URL}/api/course/getCourse`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const course = await courses.json();
      console.log(course);
      setListCourse(course);
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailUser = async (userId) => {
    try {
        const detailUser = await fetch(`${URL}/api/user/detail-user?taiKhoan_id=${userId}`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })

        const data = await detailUser.json();
        setIfUser(data)
    } catch (error) {
        console.log(error);
    }
  }

  const getUSerCourse = async (userId) => {
    try {
        const userCourse = await fetch(`${URL}/api/course/userCourse?user_id=${userId}`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await userCourse.json();
        setUserCourse(data)
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const tokenFromStorage = localStorage.getItem("token");
      const userIdFromStorage = localStorage.getItem("userId");
      setToken(tokenFromStorage);
      setUserId(userIdFromStorage)
      if (pathRoute === "/home") {
        await getCourses();
      }else if(pathRoute === "/account/profile"){
        await getDetailUser(userIdFromStorage)
      }else if(pathRoute === "/user-course"){
        await getUSerCourse(userIdFromStorage);
      }
    };
    loadData();
  }, [pathRoute]);

  const ContextValues = {
    URL,
    listCourse,
    token,
    userId,
    ifUser,
    userCourse
  };

  return (
    <StoreContext.Provider value={ContextValues}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
