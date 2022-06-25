/* require modules */
import React from 'react'
import M from 'materialize-css'

/* create and export text field function component */
export const TextField = React.memo((props) => {
    React.useEffect(() => {
        new M.updateTextFields()
        return () => {
            // new M.updateTextFields()
        }
        // eslint-disable-next-line
    }, [props])

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
                pattern={props.pattern}
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

export const Select = React.memo(({ name, value, onChange, icon, label, error, children }) => {
    React.useEffect(() => {
        new M.AutoInit()
        // eslint-disable-next-line
    }, [children])
    return (
        <div className="input-field">
            <i className='material-icons-round prefix'>
                {icon}
            </i>
            <select name={name} value={value} onChange={onChange}>
                {children}
            </select>
            <label>{label}</label>
            <span className='helper-text red-text'>
                {error}
            </span>
        </div>
    )
})