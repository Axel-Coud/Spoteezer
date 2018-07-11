import express from 'express'
import { generateToken } from '../Authentication'
import verifyUser from '../controller/users/verifyUser'

export interface UserToLog {
    username: string
    email: string
    prenom: string
    nom: string
    userId: number
    password?: string
}

const router = express.Router()

router.post('/login', async (req, res) => {

    let userToLogIn: UserToLog | null = null

    try {
        userToLogIn = await verifyUser(req.body.username, req.body.password)
    } catch (error) {
        return res.status(500).send(error)
    }

    res.cookie('jwt', generateToken(userToLogIn.userId))

})

export default router
