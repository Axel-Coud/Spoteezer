import express from 'express'
import config from './config'
import router from './router/routerApex'
import validateToken from './Authentication'
import getUserFromToken from './controller/users/getUserFormToken'
import cookieParser from 'cookie-parser'
import { User } from './controller/users/addUser';

const server = express()

// On sert les assets depuis le rootDir ./client
server.use(express.static(__dirname + './../client/'))

server.use(cookieParser())
server.use(express.json())
server.use(validateToken)
server.use(router)

// Simple route to authenticate(used to tell if token is okay) by using validateToken middleware
server.get('/authenticate', async (req, res) => {

    let user: null | Partial<User> = null
    try {
        user = await getUserFromToken(req.cookies.token)
    } catch (error) {
        console.log("Erreur dans l'authentication : " + error)
        return res.status(403).send({
            authenticated: false
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
    res.redirect('/');
})

server.listen(config.port, () => {
    console.log(`/************************************\\

    Server is now running on port ${config.port}

/************************************\\`)
})

// le client se ferme déjà automatiquement(j'ai laissé si jamais j'en aurai besoin un jour)
// process.on('SIGINT', () => {
//     // pgClient.end((err) => {
//     //     if (err) {
//     //         console.log(err)
//     //     }
//         console.log('Server closed')
// //     })
// })

// process.on('exit' , async () => {
// //     pgClient.end((err) => {
// //         if (err) {
// //             console.log(err)
// //         }
//         console.log('Server closed')
// //     })
// })
