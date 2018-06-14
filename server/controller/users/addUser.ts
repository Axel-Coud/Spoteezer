import SQL from 'sql-template-strings'
import pgClient from '../../db'
import bcrypt from 'bcrypt'

export interface User {
    nom: string,
    prenom: string,
    email: string,
    pseudo: string,
    password: string
}

/**
 * Prends un literal contenant les informations du nouvel utilisateur et l'inject dans la db.
 * @param newUser Informations du nouvel utilisateur à ajouter
 */
export default async function addUser(newUser: User): Promise<void> {

    // Pour l'instant on gère le password en dur(à changer quand on va injecter la partie authentication)
    const encryptedPassword = await encryptPassword(newUser.password)

    const sql = SQL`
    INSERT INTO utilisateur_uti (
        uti_nom,
        uti_prenom,
        uti_email,
        uti_pseudo,
        uti_password
    ) VALUES (
        ${newUser.nom},
        ${newUser.prenom},
        ${newUser.email},
        ${newUser.pseudo},
        ${encryptedPassword}
    )
    `
    await pgClient.query(sql)
}

const encryptPassword = async (password: string): Promise<string> => {

    const salt = await bcrypt.genSalt()
    const cryptedPwd = await bcrypt.hash(password, salt)

    return cryptedPwd
}
