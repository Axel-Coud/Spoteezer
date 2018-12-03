import express from 'express'
import config from './config'
import router from './router/routerApex'
import validateToken from './Authentication'
import getUserFromToken from './controller/users/getUserFormToken'
import cookieParser from 'cookie-parser'
import { User } from './controller/users/addUser'
import dotenv from 'dotenv'

const server = express()

// Fetch environment variables from .env file
dotenv.config()

// On sert les assets depuis le rootDir ./client
server.use(express.static(__dirname + './../client/'))

server.use(cookieParser())
server.use(express.json())
server.use(validateToken)
server.use(router)

// Simple route to authenticate(used to tell if token is okay) by using validateToken middleware
server.get('/auth', async (req, res) => {

    let user: null | Partial<User> = null
    try {
        user = await getUserFromToken(req.cookies.token)
    } catch (error) {
        console.log("Erreur dans l'authentication : " + error)
        return res.status(401).send({
            authenticated: false,
            user: null
        })
    }

    res.status(200).json({
        authenticated: true,
        user
    })
})

// Entry-point
server.get('/', (_, res) => {

    res.sendFile('index.html')
})

server.use('*', (_, res) => {
    res.redirect('/')
})

server.listen(config.port, () => {
    console.log(`/************************************\\

    Server is now running on port ${config.port}

/************************************\\`)
})
