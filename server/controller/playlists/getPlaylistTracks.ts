import pg from '../../db'
import SQL from 'sql-template-strings'
import { ListedTrack } from '../musics/getAllMusic';

export default async function getPlaylistTracks(playlistId: number, userId: number): Promise<ListedTrack[]> {

    const selectQuery = SQL`
        WITH liked_by_user AS (
            SELECT
                TRUE as liked,
                lik_id
            FROM
                like_lik lik
                INNER JOIN utilisateur_uti uti ON uti.uti_id = lik.uti_id_liker
            WHERE
                uti.uti_id = ${userId}
        )

        SELECT
            mus_titre AS title,
            mus_artiste AS artist,
            mus_length AS duration,
            mus_filesize AS filesize,
            (uti_prenom||' '||uti_nom) AS uploader_desc,
            uti_id_uploader AS "uploaderId",
            mus.mus_id AS "musId",
            mus_path AS filepath,
            COUNT(lik.lik_id) AS likes,
            (SELECT liked FROM liked_by_user liked WHERE liked.lik_id = lik.lik_id) AS "likedByUser"
        FROM
            musique_mus mus
            INNER JOIN utilisateur_uti uti ON uti.uti_id = mus.uti_id_uploader
            LEFT OUTER JOIN like_lik lik ON mus.mus_id = lik.mus_id
            INNER JOIN musiquelink_mul mul ON mul.mus_id = mus.mus_id
        WHERE
            mul.pll_id = ${playlistId}
        GROUP BY
            mus.mus_id,
            uploader_desc,
            "likedByUser"
    `

    const result = await pg.query(selectQuery)

    return result.rows
}
