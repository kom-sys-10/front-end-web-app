// LoginButton component: styled submit button used on the login form.
import '../styling/componments-styling/login-button-style.css';

function LoginButton({ text, onClick }: LoginButtonProps) {
    return (
        <button className="login-button" onClick={onClick}>{text}</button>
    );
}

interface LoginButtonProps {
    text: string;
    onClick: () => void;
}

export default LoginButton;