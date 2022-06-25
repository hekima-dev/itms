/* require modules */
import React from 'react'
import { Link } from 'react-router-dom'
import M from 'materialize-css'

/* create and export button function component */
export const Button = React.memo((props) => {
    return (
        <button
            disabled={props.disabled || props.loading}
            className={props.disabled || props.loading ? 'btn disabled' : 'btn'}
            type="submit"
            onClick={props.onClick}
        >
            {
                props.disabled
                    ? 'error'
                    : props.loading
                        ? 'loading'
                        : props.title
            }
        </button>
    )
})


/* floating button */
export const FloatingButton = React.memo((props) => {
    React.useEffect(() => {
        new M.AutoInit()
        // eslint-disable-next-line
    }, [])
    return (
        <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip={props.title}>
            <Link to={props.link} className="btn-floating btn-large waves-effect waves-light" >
                <i className="material-icons-round">
                    {props.icon}
                </i>
            </Link>

        </div>

    )
})

/* action button */
export const ActionButton = React.memo((props) => {
    React.useEffect(() => {
        new M.AutoInit()
        // eslint-disable-next-line
    }, [])

    return (
        <Link to={props.link} className={`btn-small btn-flat ${props.styles} tooltipped`} onClick={props.onClick} data-position="left" data-tooltip={props.title}>
            <i className='material-icons-round'>{props.icon}</i>
        </Link>
    )
})