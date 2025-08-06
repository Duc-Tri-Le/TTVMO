import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const URL = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [listCourse, setListCourse] = useState([])
  
        const getCourses = async () => {
            try {
                const courses = await fetch(`${URL}/api/course/getCourse`,{
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                    }
                })
                const course = await courses.json();
                console.log(course);
                setListCourse(course);
            } catch (error) {
                console.log(error);
            }
        }

    useEffect(() => {
        const loadData = async () =>{
            try {
                await getCourses();
                const storeToken = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                if(storeToken){
                    setToken(storeToken);
                    setUserId(userId);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        }
        loadData();
    }, [])

    const ContextValues = {
        URL,
        listCourse,
        token,
        userId
    }

    return (
        <StoreContext.Provider value={ContextValues}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;