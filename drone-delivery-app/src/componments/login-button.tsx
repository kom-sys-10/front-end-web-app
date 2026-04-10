import '../styling/componments-styling/login-button-style.css';

function LoginButton({ text, onClick }: LoginButtonProps) {
    return (
        <button className="login-button" onClick={onClick}>{text} onClick</button>
    );
}

interface LoginButtonProps {
    text: string;
    onClick: () => void;
}

export default LoginButton;