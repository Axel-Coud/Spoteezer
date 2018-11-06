import pg from '../../db'
import SQL from 'sql-template-strings'
import { Playlist } from './getUserPlaylists'

export default async function getPlaylistFromId(playlistId: number): Promise<Playlist> {

    const selectQuery = SQL`
        SELECT
            pll_id AS "playlistId",
            pll_titre AS "playlistTitle",
            pll_length AS "playlistLength",
            uti_id_maker AS "playlistUserId"
        FROM
            playlist_pll
        WHERE
            pll_id = ${playlistId}
    `

    const result = await pg.query(selectQuery)

    return result.rows[0]
}
