/* require modules */
import React from 'react'

/* create and export button function component */
export const Button = React.memo((props) => {
    return (
        <button
            disabled={props.disabled || props.loading}
            className={props.disabled || props.loading ? 'btn disabled' : 'btn'}
            type={props.type}
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