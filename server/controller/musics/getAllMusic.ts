import pg from '../../db'
import SQL from 'sql-template-strings'

export interface Music {
    title: string,
    artist: string,
    duration: string,
    fileSize: string,
    uploader: string
}

export default async function getAllMusic(): Promise<Music[]> {

    const query = SQL`
        SELECT
            mus_titre AS title,
            mus_artiste AS artist,
            mus_length AS duration,
            mus_filesize AS "fileSize",
            (uti_prenom||' '||uti_nom) AS uploader
        FROM
            musique_mus mus
            INNER JOIN utilisateur_uti uti ON uti.uti_id = mus.uti_id_uploader
    `

    const result = await pg.query(query)

    return result.rows
}
