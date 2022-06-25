import React from 'react'

const Table = React.memo(({ children }) => {
    return (
        <table className='responsive-table striped highlight'>
            {children}
        </table>
    )
})

export default Table