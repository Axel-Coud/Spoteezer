import {Router} from 'express'
import pgClient from '../db'
import SQL from 'sql-template-strings'
import { QueryResult } from 'pg';

const router = Router()

router.get('/all', async (_, res) => {

    const sql = SQL`
        SELECT
            *
        FROM
            utilisateur_uti
    `

    let users: QueryResult | null = null
    try {
        users = await pgClient.query(sql)
    } catch (error) {
        console.log('Erreur dans get all users :' + error)
        return res.status(500).send(error)
    }

    return res.status(200).send(users.rows)
})

router.post('/newUser', async (req, res) => {

    // Pour l'instant on gère le password en dur(à changer quand on va injecter la partie authentication)
    const sql = SQL`
        INSERT INTO utilisateur_uti (
            uti_nom,
            uti_prenom,
            uti_email,
            uti_pseudo,
            uti_password
        ) VALUES (
            ${req.body.nom},
            ${req.body.prenom},
            ${req.body.email},
            ${req.body.pseudo},
            ${req.body.password}
        ) RETURNING *
    `

    let insertResult: QueryResult | null = null
    try {
        insertResult = await pgClient.query(sql)
    } catch (error) {
        console.log('Erreur dans post nwUser :' + error)
        return res.status(500).send(error)
    }

    return res.status(200).send({insertedUser: insertResult.rows[0]})
})

export default router
