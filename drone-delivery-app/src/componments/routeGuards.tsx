import { Navigate, Outlet } from "react-router-dom";

function isLoggedIn() {
    return localStorage.getItem("logedIn") === "true";
}

export function ProtectedRoute() {
    return isLoggedIn() ? <Outlet /> : <Navigate to="/" replace />;
}

export function PublicRoute() {
    return isLoggedIn() ? <Navigate to="/shopping" replace /> : <Outlet />;
}