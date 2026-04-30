// Root component: defines all client-side routes and wraps them in auth guards.
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/login";
import Shopping from "./pages/shoping";
import Orders from "./pages/orders";
import Status from "./pages/status";
import Payment from "./pages/payment";
import { ProtectedRoute, PublicRoute } from '../src/componments/routeGuards';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/shopping" element={<Shopping />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/status/:oid" element={<Status />} />
                    <Route path="/payment" element={<Payment />} />
                </Route>
            </Route>
        </Routes>
    );
}