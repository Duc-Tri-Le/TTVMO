import Home from "../pages/Home/home.jsx"
import IfUser from "../pages/IfUser/IfUser.jsx"
import InstructorCourse from "../pages/Instructorcourse/InstructorCourse.jsx"
import SignInUp from "../pages/SignInUp/SignInUp.jsx"
import StatisticsCourse from "../pages/StatisticsCourse/StatisticsCourse.jsx"
import UserCourse from "../pages/UserCourse/UserCourse.jsx"
import OnlineCourse from "../pages/onlineCourse/onlineCourse.jsx"
const configRoutes =  {
    home : "/home",
    SignInUp : "/sign-in-up",
    IfUser : "/account/profile",
    UserCourse : "/user/course",
    InstructorCourse : "/instructor/course",
    StatisticsCourse : "/statistics/course",
    OnlineCourse : "/online/course/:id"
}

const privateRouter = [
]

const publicRouter = [
    {
        path : configRoutes.SignInUp, element : SignInUp
    },
    {
        path :configRoutes.home, element : Home
    },
    {
        path :configRoutes.IfUser, element : IfUser
    },
    {
        path : configRoutes.UserCourse, element : UserCourse
    },
    {
        path : configRoutes.InstructorCourse, element : InstructorCourse
    },
    {
        path :configRoutes.StatisticsCourse, element : StatisticsCourse
    },
    {
        path :configRoutes.OnlineCourse, element : OnlineCourse
    }
]

export {configRoutes, publicRouter, privateRouter}