import pg from '../../db'
import SQL from 'sql-template-strings'
import { User } from './addUser';

export default async function getUserById(userId: number): Promise<Partial<User>> {

    const sql = SQL`
        SELECT
            uti.uti_id AS userid,
            uti.uti_prenom AS prenom,
            uti.uti_nom AS nom,
            uti.uti_username AS username,
            uti.uti_email AS email
        FROM
            utilisateur_uti uti
        WHERE
            uti.uti_id = ${userId}

    `

    const user = await pg.query(sql)

    if (!user.rowCount) {
        throw new Error('No user with id : ' + userId)
    }

    return user.rows[0]
}
