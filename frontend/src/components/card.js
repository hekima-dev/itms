/* require modules */
import React from 'react'

/* creat card function component */
const Card = React.memo(({ title, children }) => {
    return (
        <div className='card'>
            <div className='card-title center'>
                {title}
            </div>
            {children}
        </div>
    )
})

/* export default card component for global accessibility */
export default Card