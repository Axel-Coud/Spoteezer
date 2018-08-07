import express from 'express'
import { generateToken } from '../Authentication'
import verifyUser from '../controller/users/verifyUser'

export interface UserToLog {
    username: string
    email: string
    prenom: string
    nom: string
    userid: number
    password?: string
}

const router = express.Router()

router.post('/login', async (req, res) => {

    let userToLogIn: UserToLog | null = null

    try {
        userToLogIn = await verifyUser(req.body.username, req.body.password)
    } catch (error) {
        console.log('Erreur dans verifyUser : ', error)
        return res.status(500).json(error.message)
    }

    res.cookie('token', generateToken(userToLogIn.userid))

    res.status(200).send(`Bienvenue, ${userToLogIn.prenom}`)

})

router.get('/endSession', (req, res) => {
    res.clearCookie('token')

    res.status(200).send('token deleted')
})

export default router
