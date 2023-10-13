import { Navigate, Outlet } from "react-router-dom"

const useAuth = () => {
    return sessionStorage.getItem("rol");
};

const AdminRoutes = () => {
    const isAuth = useAuth();
    return isAuth === "Administrador" ? <Outlet/> : <Navigate to ="/" />;
}

export default AdminRoutes;