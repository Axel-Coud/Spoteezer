import pg from '../../db'
import SQL from 'sql-template-strings'

/**
 * Supprime une musique de la base de donnée en fonction de l'id envoyé en paramètre
 * @param musId Id de la musique à supprimer
 */
export default async function deleteMusic(musId: number): Promise<void> {

    const deleteQuery = SQL`
        DELETE FROM musique_mus
        WHERE mus_id = ${musId}
    `

    await pg.query(deleteQuery)
}
