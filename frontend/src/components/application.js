/* require modules */
import React from 'react'
import { Link } from 'react-router-dom'
import { applicationName } from '../helpers'
import M from 'materialize-css'

/* create application wrapper function component */
const Application = React.memo(({ application, children }) => {

    const isAuthenticated = application.reducer.state.authenticated

    React.useEffect(() => {
        /* initialize materilize javasript*/
        new M.AutoInit()
    }, [])

    return (
        <React.Fragment>

            {/* navigation goes here */}
            <div className='navbar-fixed'>
                <nav className={isAuthenticated ? 'is-fixed ' : ''}>
                    <div className="nav-wrapper">
                        <Link to="/" className="brand-logo center">
                            {applicationName}
                        </Link>

                        {/* show sidenav menu trigger when user is authenticated */}
                        {
                            isAuthenticated
                                ?
                                <Link to="#" className="sidenav-trigger white-text" data-target="slide-out">
                                    <i className="material-icons">menu</i>
                                </Link>
                                : null
                        }
                    </div>
                </nav>
            </div>


            {/* sidenav goes here */}
            <ul id="slide-out" className={isAuthenticated ? ' sidenav sidenav-fixed' : 'sidenav'}>
                <li>
                    <div className="user-view">
                        <div className="background">
                            <img src="images/office.jpg" alt='' />
                        </div>
                        <a href="#user">
                            <img className="circle" src="images/yuna.jpg" alt='' />
                        </a>
                        <a href="#name">
                            <span className="white-text name">John Doe</span>
                        </a>
                        <a href="#email">
                            <span className="white-text email">jdandturk@gmail.com</span>
                        </a>
                    </div>
                </li>
                <li>
                    <a href="#!">
                        <i className="material-icons">cloud</i>
                        First Link With Icon
                    </a>
                </li>
                <li>
                    <a href="#!">Second Link</a>
                </li>
                <li>
                    <div className="divider"></div>
                </li>
                <li>
                    <a className="subheader">Subheader</a>
                </li>
                <li>
                    <a className="waves-effect" href="#!">Third Link With Waves</a>
                </li>
            </ul>
            <main className={isAuthenticated ? 'is-fixed' : ''}>
                {children}
            </main>
        </React.Fragment>
    )
})

/* export application wrapper for global accessibility */
export default Application