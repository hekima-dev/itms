/* require modules */
const { controllers } = require('bapig')

/* auto create adminstrator */
async function createAdminstrator() {
    try {

        /* verify there if no adminstrator */
        const adminstratorExist = await controllers.validateDocument({ schema: 'user', validationType: 'onCreate', condition: { role: null } })

        /* confirm there is no adminstrator */
        if (!adminstratorExist.success) {

            /* create new adminstrator */
            const adminstratorCreated = await controllers.createDocumentFieldEncryption({
                schema: 'user',
                fieldToEncrypt: 'password',
                password: 'admin@12345',
                username: 'admin',
                phone_number: '0752628215'
            })

            /* confirm adminstator has been created */
            if (adminstratorCreated.success)
                console.log(`Adminstrator has been created.`)
            else
                console.log(`Failed to create adminstrator: ${adminstratorCreated.message}.`)

        }

    } catch (error) {
        console.log(`Failed to create adminstrator, Error: ${error.message}.`)
    }
}

/* export create administrator function for global accessibility */
module.exports = {
    createAdminstrator
}