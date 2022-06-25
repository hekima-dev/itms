import React from 'react'

const PageNotFound = React.memo(() => {
    return (
        <div className='not-found'>
            <h3>Page not found</h3>
            <i className='material-icons-round'>find_in_page</i>
        </div>
    )
})

export default PageNotFound