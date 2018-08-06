import SQL from 'sql-template-strings'
import pg from '../../db'
import encryptPassword from '../miscs/encryptPassword'

export interface User {
    nom: string,
    prenom: string,
    email: string,
    username: string,
    password: string,
    userid?: string
}

/**
 * Prends un literal contenant les informations du nouvel utilisateur et l'inject dans la db.
 * @param newUser Informations du nouvel utilisateur à ajouter
 */
export default async function addUser(newUser: User): Promise<void> {

    if (await verifyUsernameExists(newUser.username)) {
        throw new Error(`Ce pseudonyme éxiste déjà`)
    }

    // Pour l'instant on gère le password en dur(à changer quand on va injecter la partie authentication)
    const encryptedPassword = await encryptPassword(newUser.password)

    const addUserSql = SQL`
    INSERT INTO utilisateur_uti (
        uti_nom,
        uti_prenom,
        uti_email,
        uti_username,
        uti_password
    ) VALUES (
        ${newUser.nom},
        ${newUser.prenom},
        ${newUser.email},
        ${newUser.username},
        ${encryptedPassword}
    )
    `
    await pg.query(addUserSql)
}

async function verifyUsernameExists(username: string): Promise<boolean> {

    const sql = SQL`
        SELECT
            *
        FROM
            utilisateur_uti uti
        WHERE
            uti.uti_username = ${username}
    `

    const retrievedUser = await pg.query(sql)

    if (retrievedUser.rowCount) {
        return true
    }

    return false
}
