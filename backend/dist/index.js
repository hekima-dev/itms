/* require modules */
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const { router } = require('bapig')

/* no need to install this, its built in with node.js */
const path = require('path')
const https = require('https')
const fs = require('fs')
const helpers = require('./helpers/index')

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

/* options use for live server only */
const httpsOptions = {
    cert: serverInformation.environment === 'development' ? '' : fs.readFileSync(`/etc/letsencrypt/live/${serverInformation.domain}/fullchain.pem`),
    key: serverInformation.environment === 'development' ? '' : fs.readFileSync(`/etc/letsencrypt/live/${serverInformation.domain}/privkey.pem`)
}

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
                server.listen(serverInformation.port, serverCallback)

            else
                /* start production server */
                https.createServer(httpsOptions, server).listen(serverInformation.port, serverCallback)

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

/* application programming interface (api's) */
server.use('/api', router)
server.use('/temperature', require('./routes'))