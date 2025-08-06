import Home from "../pages/Home/Home.jsx"
import SignIn from "../pages/SignIn/SignIn.jsx"

const configRoutes = {
    SignIn : "/sign-in",
    Home : "/home"
}

const publicRouter = [
    {
        path : configRoutes.SignIn, element : SignIn
    },
    {
        path : configRoutes.Home, element : Home
    }
]

export {publicRouter}