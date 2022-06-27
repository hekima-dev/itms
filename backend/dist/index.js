/* require modules */
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const { router, controllers } = require('bapig')
const socket = require('socket.io')

/* no need to install this, its built in with node.js */
const path = require('path')
const fs = require('fs')
const helpers = require('./helpers/index')
const https = require('https')
const http = require('http')

/* initialize express */
const server = express()



/* middleware */
server.use(cors())
server.use(helmet())
server.use(morgan('dev'))

/* parsing json */
server.use(express.json())

/* serve static files */
server.use(express.static(path.join(__dirname, '../public')))

/* server information */
const serverInformation = {
    port: 1000,
    domain: 'itms.bapig.dev',
    environment: 'production' /* change to production on live server */
}

// const socket = require('socket.io')


/* options use for live server only */
const httpsOptions = {
    cert: serverInformation.environment === 'development' ? '' : fs.readFileSync(`/etc/letsencrypt/live/${serverInformation.domain}/fullchain.pem`),
    key: serverInformation.environment === 'development' ? '' : fs.readFileSync(`/etc/letsencrypt/live/${serverInformation.domain}/privkey.pem`)
}

/* socket server */
const socketServer = serverInformation.environment === 'development' ? http.createServer(server) : https.createServer(httpsOptions, server)

/* database information */
const database = {
    name: 'itms',
    uri: 'mongodb://localhost:27017',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
}

/* database connection with retry after n seconds */
async function connectWithRetry(seconds) {
    try {

        /* database connection */
        const databaseConnected = await mongoose.connect(`${database.uri}/${database.name}`, database.options)

        /* verify database connection */
        if (databaseConnected) {

            /* create database collections(tables) */
            require('./utils/databaseModels')

            /* create adminstrator */
            helpers.createAdminstrator()

            /* start server either development server or production server */
            if (serverInformation.environment === 'development')
                /* start development server */
                socketServer.listen(serverInformation.port, serverCallback)

            else {
                socketServer.listen(1001, () => 'development server is running on http://localhost:1001')
                /* start production server */
                socketServer.listen(serverInformation.port, serverCallback)
            }

        }
        else {

            console.log(`${database.name} database is retrying to connect...`)

            /* retry to connect */
            setTimeout(connectWithRetry, 1000 * seconds)
        }

    } catch (error) {
        console.log(error)
        console.log(`${database.name} database is retrying to connect...`)

        /* retry to connect */
        setTimeout(connectWithRetry, 1000 * seconds)
    }
}

/* initiate database connection, try after 5 seconds it it fails */
connectWithRetry(5)

/* callback after server has started */
function serverCallback() {
    console.log(`${serverInformation.environment} server is running on ${serverInformation.environment === 'production' ? `https://${serverInformation.domain}:` : `http://localhost:`}${serverInformation.port} and ${database.name.replace(/_/g, ' ')} database has been connected.`)
}

/* intialize socket */
const io = socket(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', function (socket) {
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
})


/* application programming interface (api's) */
server.post('/temperature/create', async (request, response) => {
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
                branch: branchExist.message._id,
                employee: branchExist.message.employee._id
            })

            /* verify temperature has been added */
            if (temperatureAdded.success) {
                io.emit('temperature', temperatureAdded.message)

                response.json({ success: true, message: temperatureAdded.message })
                if (temperatureAdded.message.value > 40)
                    controllers.sendMessage({
                        message: `${temperatureAdded.message.branch.name.replace(/_/g, ' ').toUpperCase()} tempeature is above 40, current temperature is ${temperatureAdded.message.value}.`,
                        receivers: [`+255${temperatureAdded.message.employee.phone_number.substring(1)}`]
                    })
            }
            else
                response.json(temperatureAdded)

        }
        else
            response.json(branchExist)

    } catch (error) {
        response.json({ success: false, message: error.message })
    }
})

server.use('/api', router)
