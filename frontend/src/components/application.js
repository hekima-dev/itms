/* require modules */
import React from 'react'
import { Link } from 'react-router-dom'
import { applicationName, getUserInfo } from '../helpers'
import M from 'materialize-css'
import menus from '../config/menu'

/* create application wrapper function component */
const Application = React.memo(({ authenticated, createOrRemoveSession, children }) => {

    React.useEffect(() => {
        /* initialize materilize javasript*/
        new M.AutoInit()

        return () => {
        }
        // eslint-disable-next-line
    }, [])

    const renderMenu = React.useCallback(() => {
        return (
            menus.map((menu, index) => {
                if (menu.visible && authenticated)
                return (
                    <li key={index}>
                        <Link to={menu.path}>
                            <i className="material-icons-round">{menu.icon}</i>
                            {menu.title}
                        </Link>
                    </li>
                )
                else return null
            })
        )
    }, [authenticated])

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

            <ul id="slide-out" className={authenticated ? ' sidenav sidenav-fixed' : 'sidenav'}>
                <li>
                    <div className="user-view">
                        <div className="background">
                            <img src="/mstile-310x150.png" alt='' />
                        </div>
                        <Link to="/user/profile">
                            <img className="circle" src="/apple-touch-icon.png" alt='' />
                        </Link>
                        <Link to="/user/profile">
                            <span className="name">
                                {authenticated ? getUserInfo('username').replace(/_/g, ' ') : ''}
                            </span>
                        </Link>
                        <Link to="/user/profile">
                            <span className="email">
                                {authenticated ? getUserInfo('phone_number') : ''}
                            </span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className="divider"></div>
                </li>
                <li>
                    <Link to="#" className="subheader">Main menu</Link>
                </li>
                {renderMenu()}
                <li>
                    <div className="divider"></div>
                </li>
                <li>
                    <Link to="#" className="subheader">My account</Link>
                </li>
                <li>
                    <Link to="/user/profile" className="waves-effect">
                        <i className="material-icons-round">badge</i>
                        Edit profile
                    </Link>
                </li>
                <li>
                    <Link to="/user/password" className="waves-effect">
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