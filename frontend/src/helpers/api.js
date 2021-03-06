/* require modules */

import { serverUrl } from "."
import toast from "./toast"

/* api request headers */
const headers = {
    'Content-Type': 'application/json'
}

/* create a class to make api request */
class API {

    constructor(state, dispatch) {
        this.state = state
        this.dispatch = dispatch
    }

    /* get request */
    async get(options) {
        try {

            let response = await fetch(`${serverUrl}/api/${options.route}?${options.parameters}`, {
                method: 'GET',
                mode: 'cors',
                headers
            })

            response = await response.json()

            return response

        } catch (error) {
            this.dispatch({ type: 'loading', value: { loading: false } })
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            return { success: false, message: error }
        }
    }

    /* all post request */
    async post(options) {
        try {

            this.dispatch({ type: 'loading', value: { loading: true } })
            let response = await fetch(`${serverUrl}/api/${options.route}`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(options.body),
                headers
            })
            response = await response.json()

            this.dispatch({ type: 'loading', value: { loading: false } })
            return response

        } catch (error) {
            this.dispatch({ type: 'loading', value: { loading: false } })
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            return { success: false, message: error }
        }
    }

    async put(options) {
        try {

            this.dispatch({ type: 'loading', value: { loading: true } })
            let response = await fetch(`${serverUrl}/api/${options.route}`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(options.body),
                headers
            })
            response = await response.json()

            this.dispatch({ type: 'loading', value: { loading: false } })
            return response

        } catch (error) {
            this.dispatch({ type: 'loading', value: { loading: false } })
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            return { success: false, message: error }
        }
    }

    async delete(options) {
        try {
            this.dispatch({ type: 'loading', value: { loading: true } })
            let response = await fetch(`${serverUrl}/api/${options.route}?${options.parameters}`, {
                mode: 'cors',
                method: 'DELETE',
                headers
            })
            response = await response.json()
            this.dispatch({ type: 'loading', value: { loading: false } })

            return response

        } catch (error) {
            this.dispatch({ type: 'loading', value: { loading: false } })
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            return { success: false, message: error }
        }
    }
}

/* export API class for global accessibility */
export default API