import express from 'express'
import config from './config'

const server = express()

server.listen(config.port, () => {
    console.log(`Server is now running on port ${config.port}`)
})