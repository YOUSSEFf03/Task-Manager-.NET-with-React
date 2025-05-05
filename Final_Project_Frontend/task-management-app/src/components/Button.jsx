import React from 'react';
import '../styles/button.css';

const Button = ({ iconLeft, text, iconRight, color = 'primary', onClick }) => {
    return (
        <button className={`button ${color} header`} onClick={onClick} >
            {iconLeft && <span className="button-icon button-icon-left">{iconLeft}</span>}
            {text && <span className="button-text">{text}</span>}
            {iconRight && <span className="button-icon button-icon-right">{iconRight}</span>}
        </button>
    );
};

export default Button;