import SQL from 'sql-template-strings'
import pgClient from '../../db'
import encryptPassword from '../miscs/encryptPassword'

export interface User {
    nom: string,
    prenom: string,
    email: string,
    username: string,
    password: string,
    userId?: string
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
        ${newUser.username},
        ${encryptedPassword}
    )
    `
    await pgClient.query(sql)
}
