import { Router } from 'express'
import addUser, { User } from '../controller/users/addUser'
import getAllUsers from '../controller/users/getAllUsers'

const router = Router()

router.get('/all', async (_, res) => {

    let users: null | User[] = null
    try {
        users = await getAllUsers()
    } catch (error) {
        console.log('Erreur dans get all users :' + error)
        return res.status(500).send(error.message)
    }

    return res.status(200).send(users)
})

router.post('/add', async (req, res) => {

    const userInfos: User = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        username: req.body.pseudo,
        password: req.body.password
    }

    try {
        await addUser(userInfos)
    } catch (error) {
        console.log('Erreur dans post newUser :' + error)
        return res.status(500).send(error.message)
    }

    return res.status(200).send('Nouveau user ajouté')
})

export default router
