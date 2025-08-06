import Home from "../pages/Home/home.jsx"
import SignInUp from "../pages/SignInUp/SignInUp.jsx"

const configRoutes =  {
    SignInUp : "/sign-in-up",
    home : "/home"
}

const privateRouter = [
]

const publicRouter = [
    {
        path : configRoutes.SignInUp, element : SignInUp
    },
    {
        path :configRoutes.home, element : Home
    }
]

export {configRoutes, publicRouter}