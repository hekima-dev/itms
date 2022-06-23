/* require modules */
const router = require('express').Router()
const { controllers } = require('bapig')

/* post route that will receive temperature and branch id from hardware device */
router.post('/create', async (request, response) => {
    try {

        /* destructure temprature and branch id from the posted data */
        const { temperature, branch } = request.body

        /* verify branch exist */
        const branchExist = await controllers.getSingleDocument({
            schema: 'branch',
            condition: { identification: branch }
        })

        /* confirm branch exist */
        if (branchExist.success) {

            /* add new temparature */
            const temperatureAdded = await controllers.createSingleDocument({
                schema: 'temperature',
                value: temperature,
                branch: branchExist.message._id
            })

            /* verify temperature has been added */
            if (temperatureAdded.success)
                response.json({ success: true, message: temperatureAdded.message })
            else
                response.json(temperatureAdded)

        }
        else
            response.json(branchExist)

    } catch (error) {
        response.json({ success: false, message: error.message })
    }
})

/* export router for global accessibility */
module.exports = router