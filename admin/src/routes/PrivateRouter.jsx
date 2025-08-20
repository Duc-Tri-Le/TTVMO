import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    if (role !== "nguoi_quan_ly") {
        return <Navigate to="/home" replace />;
    }
    return children;
};

export default PrivateRoute;
