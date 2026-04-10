import LoginInput from "../componments/login-input.tsx";
import LoginButton from "../componments/login-button.tsx";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import '../styling/page-styling/login-style.css';
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        goToShoping();
    }

    const goToShoping = () => {
        navigate('/shopping');
    }
    return (
        <div className="login-page">
            <div className="brand-header">
                <h1>Bamazone</h1>
                <p>Your premium shopping experience</p>
            </div>

            <div className="login-form">
                <h2>Sign in with email</h2>
                <p>Sign in to start shopping at Bamazone</p>

                <LoginInput type="text" placeholder="Username" icon={faUser} />
                <LoginInput type="password" placeholder="Password" icon={faLock} />
                <LoginButton text="Login" onClick={handleLogin} />
            </div>
        </div>
    );
}

export default LoginPage;