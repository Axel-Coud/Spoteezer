import express from 'express'
import config from './config'
import path from 'path'
import router from './router/routerApex'
import pgClient from './db'

const server = express()

// On sert les assets depuis le rootDir ./client
server.use(express.static(__dirname + './../client/'))

server.use(express.json())
server.use(router)

// Entry-point
server.get('/', (_, res) => {

    res.sendFile(path.join(__dirname, './../client/index.html'))
})

server.listen(config.port, () => {
    console.log(`/************************************\\

  Server is now running on port ${config.port}

/************************************\\`)
})

// le client se ferme déjà automatiquement(j'ai laissé si jamais j'en aurai besoin un jour)
process.on('SIGINT', () => {
    // pgClient.end((err) => {
    //     if (err) {
    //         console.log(err)
    //     }
        console.log('Server closed')
//     })
})

process.on('exit' , async () => {
//     pgClient.end((err) => {
//         if (err) {
//             console.log(err)
//         }
        console.log('Server closed')
//     })
})
