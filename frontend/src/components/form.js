/* require modules */
import React from 'react'

/* create form function component */
const Form = React.memo(({ onSubmit, children }) => {
    return (
        <form action="#" onSubmit={onSubmit}>
            {children}
        </form>
    )
})

/* export form component for global accessibility */
export default Form