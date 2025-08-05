import signIn_up from "../pages/signIn_Up/signIn_up.jsx"

const configRoutes =  {
    signIn_Up : "/",
    home : "/home"
}

const privateRouter = [
    {
        path : configRoutes.signIn_Up, element : signIn_up
    }
]

export {configRoutes, privateRouter}