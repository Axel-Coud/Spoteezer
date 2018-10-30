import pg from '../../db'
import SQL from 'sql-template-strings'
import { promises } from 'fs'

export interface Music {
    musId: number,
    title: string,
    artist: string,
    duration: string,
    filesize: string,
    filepath: string,
    uploaderId: number,
    uploader_desc: string,
    likes: number
}

export default async function getOneMusic(musId: number): Promise<{musicInfos: Music} & {file: Buffer}> {
    const musicInfos = await getMusicInfos(musId)
    const musicFile = await getMusicFile(musicInfos.filepath)

    return {musicInfos, file: musicFile}
}

async function getMusicInfos(musId: number): Promise<Music> {

    const query = SQL`
    SELECT
        mus.mus_id AS "musId",
        mus_titre AS title,
        mus_artiste AS artist,
        mus_length AS duration,
        mus_filesize AS filesize,
        uti_id_uploader AS "uploaderId",
        mus_path AS filepath,
        (uti_prenom||' '||uti_nom) AS uploader_desc,
        COUNT(lik.lik_id) AS likes
    FROM
        musique_mus mus
        INNER JOIN utilisateur_uti uti ON uti.uti_id = mus.uti_id_uploader
        LEFT OUTER JOIN like_lik lik ON mus.mus_id = lik.mus_id
        WHERE
        mus.mus_id = ${musId}
    GROUP BY
        mus.mus_id,
        uploader_desc
    `

    const res = await pg.query(query)

    return res.rows[0]
}

async function getMusicFile(filePath: string): Promise<Buffer> {
    const file = await promises.readFile(filePath)

    return file
}
