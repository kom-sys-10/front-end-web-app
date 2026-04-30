// Header component: global navigation bar shown on every page; handles logout by clearing localStorage.
import "../styling/componments-styling/header-style.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("uid");
        localStorage.removeItem("userName");
        localStorage.setItem("logedIn", "false");
        navigate("/");
    };

    return (
        <header className="app-header">
            <div className="app-header-inner">
                <div className="app-logo">Bamazone</div>

                <nav className="app-nav">
                    <Link to="/shopping">Shopping</Link>
                    <Link to="/orders">Orders</Link>
                    <Link to="/payment">Payment</Link>
                    <span className="logout" onClick={onLogout}>
                        Logout
                    </span>
                </nav>
            </div>
        </header>
    );
}

export default Header;