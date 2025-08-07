import Instructor from "../pages/Instructor/Instructor.jsx"
import SignIn from "../pages/SignIn/SignIn.jsx"

const configRoutes = {
    SignIn : "/sign-in",
    Instructor : "/instructor",
    Course : "/course"
}

const publicRouter = [
    {
        path : configRoutes.SignIn, element : SignIn
    },
    {
        path : configRoutes.Instructor, element: Instructor
    }
    
]

export {publicRouter}