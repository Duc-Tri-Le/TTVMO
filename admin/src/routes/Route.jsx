import Instructor from "../pages/Instructor/Instructor.jsx"
import SignIn from "../pages/SignIn/SignIn.jsx"
import Student from "../pages/Student/Student.jsx"

const configRoutes = {
    SignIn : "/sign-in",
    Instructor : "/instructor",
    Course : "/course",
    Student : "/student"
}

const publicRouter = [
    {
        path : configRoutes.SignIn, element : SignIn
    },
    {
        path : configRoutes.Instructor, element: Instructor
    },
    {
        path : configRoutes.Student, element : Student
    }
    
]

export {publicRouter}