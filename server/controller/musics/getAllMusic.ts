import pg from '../../db'
import SQL from 'sql-template-strings'
import { Music } from './getOneMusic'

export default async function getAllMusic(): Promise<Music[]> {

    const query = SQL`
        SELECT
            mus_titre AS title,
            mus_artiste AS artist,
            mus_length AS duration,
            mus_filesize AS filesize,
            (uti_prenom||' '||uti_nom) AS uploader_desc,
            uti_id_uploader AS "uploaderId",
            mus_id AS "musId",
            mus_path AS filepath
        FROM
            musique_mus mus
            INNER JOIN utilisateur_uti uti ON uti.uti_id = mus.uti_id_uploader
    `

    const result = await pg.query(query)

    return result.rows
}
