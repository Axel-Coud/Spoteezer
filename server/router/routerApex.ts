import {Router} from 'express'
import routerUsers from './routerUsers'
import routerSession from './routerSession'
import routerMusics from './routerMusics'

// On link tout nos router ici et on envoit pour pas bloat 'server.ts'
const routerApex = Router()

routerApex.use('/users', routerUsers)
routerApex.use('/musics', routerMusics)
routerApex.use(routerSession)

export default routerApex
