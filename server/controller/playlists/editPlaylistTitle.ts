import pg from '../../db'
import SQL from 'sql-template-strings'
import { Playlist } from './getUserPlaylists'

export default async function editPlaylistTitle(playlistId: number, newPlaylistTitle: string): Promise<Playlist> {

    const updateQuery = SQL`
        UPDATE playlist_pll
        SET pll_titre = ${newPlaylistTitle}
        WHERE pll_id = ${playlistId}
        RETURNING
        pll_id AS "playlistId",
        pll_titre AS "playlistTitle",
        pll_length AS "playlistLength",
        uti_id_maker AS "playlistUserId"
    `

    const updatedPlaylist = await pg.query(updateQuery)

    return updatedPlaylist.rows[0]
}
