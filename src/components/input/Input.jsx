import React from 'react';

import "./Input.scss"

function Input(props) {
    return (
        <div className="input__wrap">
            <input
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange ? (e) => props.onChange(e) : null}
                onClick={props.onClick ? (e) => props.onClick(e) : null}
            />
            <i className="bx bx-search"></i>
        </div>
    );
}

export default Input;