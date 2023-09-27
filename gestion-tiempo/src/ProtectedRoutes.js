import { Navigate, Outlet } from "react-router-dom"

const useAuth = () => {
    return sessionStorage.getItem("user");
};

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to ="/" />;
}

export default ProtectedRoutes;