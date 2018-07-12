import { UserToLog } from "../../router/routerLogin"
import { SQL } from "sql-template-strings"
import encryptPassword from "../miscs/encryptPassword"

export default async function verifyUser(username: string, password: string): Promise<UserToLog> {

    const encryptedPassword = encryptPassword(password)

    const sql = SQL`
        SELECT
            uti.uti_id AS userId,
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

}
