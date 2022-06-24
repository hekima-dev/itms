/* require modules */

import toast from "../helpers/toast";

/* application reducer (manage state updating) */
function reducer(state, action) {
    try {

        /* loading and disabled should not change each other */
        if ((action.type === 'loading') || (action.type === 'disabled'))
            return { ...state, [action.type]: action.value[action.type] }

        /* check for error values and enable disabled */
        else if (action.type.includes('Error'))
            return { ...state, [action.type]: action.value[action.type], disabled: true }

        /* check for non-error values and empty related field and disable disabled */
        else
            return { ...state, [action.type]: action.value[action.type], [`${action.type}Error`]: '', disabled: false }

    } catch (error) {
        if (error instanceof Error)
            toast(error.message)
        else
            console.log(error)

        return state
    }
}

/* export default reducer for global accessibility */
export default reducer
