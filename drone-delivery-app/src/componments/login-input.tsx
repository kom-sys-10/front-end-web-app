import '../styling/componments-styling/login-input-style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

function LoginInput({ type, placeholder, icon }: LoginInputProps) {
    return (
        <div className="login-input-container">
            <div className="icon-container">
                <FontAwesomeIcon icon={icon} />
            </div>
            <input type={type} placeholder={placeholder} className="login-input" />
        </div>
    );
}

interface LoginInputProps {
    type: string;
    placeholder: string;
    icon: IconDefinition;
}

export default LoginInput;