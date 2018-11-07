import pg from '../../db'
import SQL from 'sql-template-strings'

export default async function removeTrackFromPlaylist(musId: number, playlistId: number): Promise<number> {

    const deleteQuery = SQL`
        DELETE FROM musiquelink_mul
        WHERE
            mus_id = ${musId}
            AND
            pll_id = ${playlistId}
        RETURNING *
    `

    const result = await pg.query(deleteQuery)

    return result.rows[0].mus_id
}
