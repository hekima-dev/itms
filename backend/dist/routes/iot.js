/* require modules */
const router = require('express').Router()

/* post route that will receive temperature and branch id from hardware device */
router.post('/create', async (request, response) => {
    try {

        /* destructure temprature and branch id from the posted data */
        const { temperature, branchId } = request.body

    } catch (error) {
        response.json({ success: false, message: error.message })
    }
})

/* export router for global accessibility */
module.exports = router