/* require modules */
import React, { Suspense } from 'react'
import initialState from './hooks/initialState'
import reducer from './hooks/reducer'
import { BrowserRouter as Router } from 'react-router-dom'
import routing from './routes/routing'
import Application from './components/application'
import toast from './helpers/toast'
import './index.scss'
import API from './helpers/api'
import Loader from './components/loader'


/* create app  function component */
const App = () => {

  /* state management */
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    /* check user in local storage */
    const user = sessionStorage.getItem('user')

    if (user) {
      dispatch({ type: 'authenticated', value: { authenticated: true } })
    }

  }, [])

  /* handle input change */
  function handleInputChange(event) {
    try {

      /* destructure input name and value */
      const { name, value } = event.target

      /* update state */
      dispatch({ type: name, value: { [name]: value } })

    } catch (error) {
      if (error instanceof Error)
        toast(error.message)
      else
        console.error(error)
    }
  }

  function createOrRemoveSession(action, options) {
    try {

      if (action === 'create') {
        /* NOTE: you can encrypt user data for max security */
        sessionStorage.setItem(options.key, JSON.stringify(options.value))
        dispatch({ type: 'authenticated', value: { authenticated: true } })
        toast('You have been logged in')
      }
      else {
        sessionStorage.clear()
        dispatch({ type: 'authenticated', value: { authenticated: false } })
        window.location.reload()
        toast('You have been logged out')
      }

    } catch (error) {
      if (error instanceof Error)
        toast(error.message)
      else
        console.error(error)
    }
  }

  /* application properties */
  const application = {
    reducer: { state, dispatch },
    handleInputChange,
    api: new API(state, dispatch),
    createOrRemoveSession
  }

  return (
    <Suspense fallback={<Loader />}>
      {state.loading ? <Loader /> : null}
      <Router>
        <Application authenticated={state.authenticated} createOrRemoveSession={createOrRemoveSession}>
          {routing(application)}
        </Application>
      </Router>
    </Suspense>
  )

}

/* export App for global accessibility */
export default App;
