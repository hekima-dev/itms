/* require modules */
import toast from "./toast"

/* application name */
export const applicationName = 'ITMS'

/* server url */
export const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1000/api' : ''

/* function to get user information */
export function getUserInfo(info) {
    try {
        const user = sessionStorage.getItem('user')

        if (user) {
            if (info) {
                const parsedUser = JSON.parse(user)
                return parsedUser[info]
            }
            else
                return JSON.parse(user)
        }
        else
            window.location.reload()

    } catch (error) {
        if (error instanceof Error)
            toast(error.message)
        else
            console.error(error)
    }
}