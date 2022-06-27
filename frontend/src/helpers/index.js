/* require modules */
import toast from "./toast"

/* application name */
export const applicationName = 'ITMS'

/* server url */
export const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1000' : 'https://itms.bapig.dev:1000'

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
            return false

    } catch (error) {
        if (error instanceof Error)
            toast(error.message)
        else
            console.error(error)
    }
}

/* permission check */
export function can(permission) {
    try {
        const userRole = getUserInfo('role')
        if (userRole || (userRole === null)) {
            permission = formatText(permission, 'format')

            if (userRole === null)
                return true
            else {
                if (userRole.permissions.indexOf(permission) >= 0)
                    return true
                else
                    return false
            }
        }
        else return false

    } catch (error) {
        if (error instanceof Error)
            toast(error.message)
        else
            console.error(error)
        return false
    }
}

/* function to format text */
export function formatText(text, action) {
    try {
        if (action === 'format')
            return text.toLowerCase().replace(/ /g, '_')
        else
            return text.toLowerCase().replace(/_/g, ' ')

    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        else
            console.error(error)
        return text
    }
}

export const isAdmin = getUserInfo('role') === null ? true : false