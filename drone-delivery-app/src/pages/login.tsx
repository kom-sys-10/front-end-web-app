import LoginInput from "../componments/login-input.tsx";
import LoginButton from "../componments/login-button.tsx";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import '../styling/page-styling/login-style.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.ts';
import User from '../models/user.ts' 
import { useCart } from '../models/cart';

import {useState } from 'react';

function LoginPage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userPassowrd, setUserPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const {clearCart} = useCart();


    const handleLogin = async () => {

    if (!userName || !userPassowrd) return;
    const user = new User(0, userName, userPassowrd).toJson();
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(user),
            });

            if(response.status == 200) {
                const result = await response.json();
                const loggedInUser = User.fromJSON(result);
                clearCart();
                localStorage.setItem("uid", String(loggedInUser.getUid()));
                localStorage.setItem("userName", loggedInUser.getName());
                localStorage.setItem("logedIn", "true");
                setLoginFailed(false);
                goToShoping();
            }
            else {
                setLoginFailed(true);
            }
        }
        catch (e) {
            console.error(e);
        }
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

                <LoginInput 
                    type="text" 
                    placeholder="Username" 
                    onChange= {
                        (value) => {
                            setUserName(value);
                            setLoginFailed(false);
                        }
                    } 
                    icon={faUser} />
                <LoginInput 
                    type="password" 
                    placeholder="Password" 
                    onChange={
                        (value) => {
                            setUserPassword(value);
                            setLoginFailed(false);
                        }
                    } 
                    icon={faLock} />
                <LoginButton text="Login" onClick={handleLogin} />
                {loginFailed && (
                    <p style={{ color: "red" }}>
                        Login failed. Wrong username or password.
                    </p>
                )}
            </div>
        </div>
    );
}

export default LoginPage;