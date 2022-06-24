/* require modules */
import { Switch, Route } from 'react-router-dom'
import routes from './routes'

/* routing function */
function routing(application) {
    return (
        <Switch>
            {
                routes.map((route, index) => {
                    if (!application.reducer.state.authenticated && route.guest)
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                render={(props) => (
                                    < route.component {...props} application={application} />
                                )}
                                exact={true}
                            />
                        )
                    else if (application.reducer.state.authenticated && !route.guest)
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                render={(props) => (
                                    < route.component {...props} application={application} />
                                )}
                                exact={true}
                            />
                        )
                    else return null
                })
            }
        </Switch>
    )
}

/* export routing function for global accessibility */
export default routing