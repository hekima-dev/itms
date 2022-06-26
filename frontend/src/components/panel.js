import React from 'react'
import { Link } from 'react-router-dom'

const Panel = React.memo((props) => {
    return (
        <Link to={props.link}>
            <div className='panel'>
                <div className='panel-left'>
                    <div className='panel-title'>{props.title}</div>
                    <div className='panel-value'>{props.value}</div>
                </div>
                <div className='panel-right'>
                    <i className='material-icons-round'>{props.icon}</i>
                </div>
            </div>
        </Link>
    )
})

export default Panel