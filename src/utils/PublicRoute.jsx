import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const Token = localStorage.getItem("accessToken");
    return !Token ? <Outlet/> : <Navigate to={"/"} replace/>
};

export default PublicRoute;