// Route guards: ProtectedRoute redirects to login if not authenticated; PublicRoute redirects to
// shopping if already logged in. Auth state is read from localStorage ("logedIn" key).
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