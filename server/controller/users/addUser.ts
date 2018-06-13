import SQL from 'sql-template-strings'
import pgClient from '../../db'

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
export default async function addUser(newUser: User): Promise<User> {

    // Pour l'instant on gère le password en dur(à changer quand on va injecter la partie authentication)
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
        ${newUser.password}
    ) RETURNING *
    `
    const insertResult = await pgClient.query(sql)

    return insertResult.rows[0]
}
