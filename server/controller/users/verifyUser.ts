import { SQL } from "sql-template-strings"
import bcrypt from 'bcrypt'
import pg from '../../db'
import { UserToLog } from "../../router/routerSession";

export default async function verifyUser(username: string, password: string): Promise<UserToLog> {

    const sql = SQL`
        SELECT
            uti.uti_id AS userid,
            uti.uti_prenom AS prenom,
            uti.uti_nom AS nom,
            uti.uti_email AS email,
            uti.uti_username AS username,
            uti.uti_password as password
        FROM
            utilisateur_uti uti
        WHERE
            uti.uti_username = ${username}
    `

    const retrievedUser = await pg.query(sql)

    if (!retrievedUser.rowCount) {
        throw new Error(`Aucun utilisateur '${username}' trouvé`)
    }

    const isPasswordRight = await bcrypt.compare(password, retrievedUser.rows[0].password)

    if (!isPasswordRight) {
        throw new Error(`Mot de passe incorrect`)
    }

    return retrievedUser.rows[0]

}
