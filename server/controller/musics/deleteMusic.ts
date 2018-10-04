import pg from '../../db'
import SQL from 'sql-template-strings'
import { promises } from 'fs'

/**
 * Supprime une musique de la base de donnée en fonction de l'id envoyé en paramètre tout en supprimant le fichier lié dans la base donnée
 * @param musId Id de la musique à supprimer
 */
export default async function deleteMusic(musId: number): Promise<void> {

    const deleteQuery = SQL`
        DELETE FROM musique_mus
        WHERE mus_id = ${musId}
        RETURNING *
    `

    const deleted = await pg.query(deleteQuery)

    await promises.unlink(deleted.rows[0].mus_path)
}
