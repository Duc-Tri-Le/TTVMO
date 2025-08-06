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
    }
]

export {configRoutes, publicRouter}