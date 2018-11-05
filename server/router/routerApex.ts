import {Router} from 'express'
import routerUsers from './routerUsers'
import routerSession from './routerSession'
import routerMusics from './routerMusics'
import routerPlaylists from './routerPlaylists'

// On link tout nos router ici et on envoit pour pas bloat 'server.ts'
const routerApex = Router()

routerApex.use('/users', routerUsers)
routerApex.use('/musics', routerMusics)
routerApex.use('/playlists', routerPlaylists)
routerApex.use(routerSession)

export default routerApex
