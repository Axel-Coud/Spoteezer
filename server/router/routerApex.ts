import {Router} from 'express'
import routerUsers from './routerUsers'

// On link tout nos router ici et on envoit pour pas bloat 'server.ts'
const routerApex = Router()

routerApex.use('/users', routerUsers)

export default routerApex
