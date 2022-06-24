/* require modules */
import M from 'materialize-css'

/* function for showing notification */
function toast(message) {
    new M.Toast({ html: message })
}

/* export toast function for global accessibility */
export default toast