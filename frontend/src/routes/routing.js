/* require modules */
import { Switch, Route } from 'react-router-dom'
import PageNotFound from '../pages/404'
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
                                
                            />
                        )
                    else return null
                })
            }
            <Route path="*" exact component={PageNotFound} />
        </Switch>
    )
}

/* export routing function for global accessibility */
export default routing