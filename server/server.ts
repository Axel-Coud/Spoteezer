import express from 'express'
import config from './config'
import path from 'path'

const server = express()

// On sert les assets depuis le rootDir ./client
server.use(express.static(__dirname + './../client/'))

// Entry-point
server.get('/', (_, res) => {

    res.sendFile(path.join(__dirname, './../client/index.html'))
})

server.listen(config.port, () => {
    console.log(`/************************************\\
    
  Server is now running on port ${config.port}

/************************************\\`)
})
