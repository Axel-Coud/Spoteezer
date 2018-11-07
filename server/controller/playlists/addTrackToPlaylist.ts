import pg from '../../db'
import SQL from 'sql-template-strings'

export default async function addTrackToPlaylist(musId: number, playlistId: number): Promise<void> {

    if (await checkIfAlreadyAdded(musId, playlistId)) {
        throw new Error(`Ce morceau éxiste déjà pour cette playlist`)
    }

    const insertQuery = SQL`
        INSERT INTO musiquelink_mul (
            mus_id,
            pll_id
        ) VALUES (
            ${musId},
            ${playlistId}
        )
    `

    await pg.query(insertQuery)

    return
}

async function checkIfAlreadyAdded(musId: number, playlistId: number): Promise<boolean> {

    const selectQuery = SQL`
        SELECT
            *
        FROM
            musiquelink_mul
        WHERE
            mus_id = ${musId}
            AND
            pll_id = ${playlistId}
    `

    const result = await pg.query(selectQuery)

    return result.rowCount > 0
}
