/* require modules */
import React from 'react'

/* create and export text field function component */
export const TextField = React.memo((props) => {
    return (
        <div className='input-field'>
            <i className='material-icons-round prefix'>
                {props.icon}
            </i>
            <input
                id={props.name}
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                disabled={props.disabled}
                min={props.min}
                max={props.max}
                onChange={props.onChange}
                onBlur={props.onBlur}
                autoComplete="off"
                type={props.type}

            />
            <label htmlFor={props.name}>
                {props.label}
            </label>
            <span className='helper-text red-text'>
                {props.error}
            </span>
        </div>
    )
})