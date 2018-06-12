import {Router} from 'express'
import pgClient from '../db'

const router = Router()

router.get('/all', async (req, res) => {
    return res.send('pouet')
})
