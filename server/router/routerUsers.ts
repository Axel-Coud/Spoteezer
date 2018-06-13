import {Router} from 'express'
import addUser, { User } from '../controller/users/addUser';
import getAllUsers from '../controller/users/getAllUsers';

const router = Router()

router.get('/all', async (_, res) => {

    let users: null | User[] = null
    try {
        users = await getAllUsers()
    } catch (error) {
        console.log('Erreur dans get all users :' + error)
        return res.status(500).send(error)
    }

    return res.status(200).send(users)
})

router.post('/newUser', async (req, res) => {

    const userInfos: User = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: req.body.password
    }

    let insertResult: null | User = null
    try {
        insertResult = await addUser(userInfos)
    } catch (error) {
        console.log('Erreur dans post nwUser :' + error)
        return res.status(500).send(error)
    }

    return res.status(200).send(insertResult)
})

export default router
