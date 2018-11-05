import pg from '../../db'
import SQL from 'sql-template-strings'

export interface Playlist {
    playlistId: number,
    playlistTitle: string,
    playlistLength: number,
    playlistUserId: number
}

export default async function getUserPlaylists(userId: number): Promise<Playlist[]> {
     const selectQuery = SQL`
        SELECT
            pll_id AS "playlistId",
            pll_titre AS "playlistTitle",
            pll_length AS "playlistLength",
            uti_id_maker AS "playlistUserId"
        FROM
            playlist_pll
        WHERE
            uti_id_maker = ${userId}
     `

     const result = await pg.query(selectQuery)

     return result.rows
}
