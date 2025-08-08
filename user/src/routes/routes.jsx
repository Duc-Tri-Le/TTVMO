import Home from "../pages/Home/home.jsx"
import IfUser from "../pages/IfUser/IfUser.jsx"
import SignInUp from "../pages/SignInUp/SignInUp.jsx"
import UserCourse from "../pages/UserCourse/UserCourse.jsx"
const configRoutes =  {
    home : "/home",
    SignInUp : "/sign-in-up",
    IfUser : "/account/profile",
    UserCourse : "/user-course"
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
    }
]

export {configRoutes, publicRouter}