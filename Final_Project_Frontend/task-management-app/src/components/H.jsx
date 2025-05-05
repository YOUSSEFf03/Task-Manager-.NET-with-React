import React from 'react';
import '../styles/h.css';

const H = ({ level, children }) => {
    const Tag = `h${level}`;
    const className = `h${level}-style`;
    return <Tag className={className}>{children}</Tag>;
};

export default H;