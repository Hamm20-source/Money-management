import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const Token = localStorage.getItem("accessToken")

    return Token ? <Outlet/> : <Navigate to="/guest" replace/>

};

export default ProtectedRoute;