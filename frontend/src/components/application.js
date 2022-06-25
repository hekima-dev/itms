/* require modules */
import React from 'react'
import { Link } from 'react-router-dom'
import { applicationName, getUserInfo } from '../helpers'
import M from 'materialize-css'

/* create application wrapper function component */
const Application = React.memo(({ authenticated, createOrRemoveSession, children }) => {

    React.useEffect(() => {
        /* initialize materilize javasript*/
        new M.AutoInit()
        // eslint-disable-next-line
    }, [])

    return (
        <React.Fragment>

            {/* navigation goes here */}
            <div className='navbar-fixed'>
                <nav className={authenticated ? 'is-fixed ' : ''}>
                    <div className="nav-wrapper">
                        <Link to="/" className="brand-logo center">
                            {applicationName}
                        </Link>

                        {/* show sidenav menu trigger when user is authenticated */}
                        {
                            authenticated
                                ?
                                <Link to="#" className="sidenav-trigger white-text" data-target="slide-out">
                                    <i className="material-icons-round">menu</i>
                                </Link>
                                : null
                        }
                    </div>
                </nav>
            </div>


            {/* sidenav goes here */}
            <ul id="slide-out" className={authenticated ? ' sidenav sidenav-fixed' : 'sidenav'}>
                <li>
                    <div className="user-view">
                        <div className="background">
                            <img src="/mstile-310x150.png" alt='' />
                        </div>
                        <Link to="/view-profile">
                            <img className="circle" src="/apple-touch-icon.png" alt='' />
                        </Link>
                        <Link to="/view-profile">
                            <span className="white-text name">
                                {authenticated ? getUserInfo('username').replace(/_/g, ' ') : ''}
                            </span>
                        </Link>
                        <Link to="/view-profile">
                            <span className="white-text email">
                                {authenticated ? getUserInfo('phone_number') : ''}
                            </span>
                        </Link>
                    </div>
                </li>
                <li>
                    <Link to="#" className="subheader">Main menu</Link>
                </li>
                <li>
                    <Link to="/dashboard">
                        <i className="material-icons-round">dashboard</i>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/branches">
                        <i className="material-icons-round">account_tree</i>
                        Branches
                    </Link>
                </li>
                <li>
                    <Link to="/temperature">
                        <i className="material-icons-round">thermostat</i>
                        Temperature
                    </Link>
                </li>
                <li>
                    <Link to="/report">
                        <i className="material-icons-round">receipt</i>
                        Report
                    </Link>
                </li>
                <li>
                    <Link to="/roles">
                        <i className="material-icons-round">task</i>
                        Roles
                    </Link>
                </li>
                <li>
                    <Link to="/users">
                        <i className="material-icons-round">groups</i>
                        Users
                    </Link>
                </li>
                <li>
                    <div className="divider"></div>
                </li>
                <li>
                    <Link to="#" className="subheader">My account</Link>
                </li>
                <li>
                    <Link to="/edit-profile" className="waves-effect">
                        <i className="material-icons-round">badge</i>
                        Edit profile
                    </Link>
                </li>
                <li>
                    <Link to="/change-password" className="waves-effect">
                        <i className="material-icons-round">lock</i>
                        Change password
                    </Link>
                </li>
                <li>
                    <Link to="#" className="waves-effect"
                        onClick={() => createOrRemoveSession('remove')}
                    >
                        <i className="material-icons-round">logout</i>
                        Logout
                    </Link>
                </li>
            </ul>
            <main className={authenticated ? 'is-fixed' : ''}>
                {children}
            </main>
        </React.Fragment>
    )
})

/* export application wrapper for global accessibility */
export default Application