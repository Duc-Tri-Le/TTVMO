import {Navigate} from "react-router-dom";

export default function PrivateRouteWrapper({children}) {
    
    const token = localStorage.getItem("token");

    if(!token) <Navigate to = "/home"/>
    return children
}
