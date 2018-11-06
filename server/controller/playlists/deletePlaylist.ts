import pg from '../../db'
import SQL from 'sql-template-strings'
import { Playlist } from './getUserPlaylists'

export default async function deletePlaylist(playlistId: number): Promise<Playlist> {

    const deleteQuery = SQL`
        DELETE FROM playlist_pll
        WHERE pll_id = ${playlistId}
        RETURNING
        pll_id AS "playlistId",
        pll_titre AS "playlistTitle",
        pll_length AS "playlistLength",
        uti_id_maker AS "playlistUserId"
    `

    const result = await pg.query(deleteQuery)

    return result.rows[0]
}
