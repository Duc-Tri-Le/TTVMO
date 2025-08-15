import Course from "../pages/Course/Course.jsx"
import Instructor from "../pages/Instructor/Instructor.jsx"
import SignIn from "../pages/SignIn/SignIn.jsx"
import Student from "../pages/Student/Student.jsx"
import Statistic from "../pages/Statistic/Statistic.jsx"

const configRoutes = {
    SignIn : "/sign-in",
    Instructor : "/instructor",
    Course : "/course",
    Student : "/student",
    Statistic : "/statistic"
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
    },
    {
        path : configRoutes.Course, element : Course
    },
    {
        path : configRoutes.Statistic,element : Statistic
    }
]

export {publicRouter}