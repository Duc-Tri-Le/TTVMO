import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/sign-in-up" replace />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/home" replace />;
    }
    return children;
};

export default PrivateRoute;
