import pg from '../../db'
import SQL from 'sql-template-strings'
import moment from 'moment'

/**
 * Like ou unlike une musique en fonction de l'historique de like de l'utilisateur sur la musique ciblée
 * @param trackId Identifiant de la musique à like ou unlike
 * @param userId Identifiant de la personne qui veut like ou unlike
 */
export default async function toggleLikeForTrackByUser(trackId: number, userId: number): Promise<'liked' | 'unliked'> {

    if (await checkIfTrackAlreadyLikedByUser(trackId, userId)) {
        await unlikeTrack(trackId, userId)
        return 'unliked'
    } else {
        await likeTrack(trackId, userId)
        return 'liked'
    }

}

async function checkIfTrackAlreadyLikedByUser(trackId: number, userId: number): Promise<boolean> {

    const selectQuery = SQL`
        SELECT
            *
        FROM
            like_lik
        WHERE
            mus_id = ${trackId}
            AND
            uti_id_liker = ${userId}
    `

    const results = await pg.query(selectQuery)

    return results.rows.length > 0
}

async function likeTrack(trackId: number, userId: number) {

    const insertQuery = SQL`
        INSERT INTO like_lik (
            mus_id,
            uti_id_liker,
            lik_timestamp
        ) VALUES (
            ${trackId},
            ${userId},
            ${moment()}
        )
    `

    await pg.query(insertQuery)
}

async function unlikeTrack(trackId: number, userId: number) {

    const deleteQuery = SQL`
        DELETE FROM like_lik
        WHERE
            mus_id = ${trackId}
            AND
            uti_id_liker = ${userId}
    `

    await pg.query(deleteQuery)
}
