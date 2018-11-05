import pg from '../../db'
import SQL from 'sql-template-strings'
import { Playlist } from './getUserPlaylists'

export default async function addPlaylist(userId: number, pllTitle: string): Promise<Playlist> {

    const insertQuery = SQL`
        INSERT INTO playlist_pll (
            pll_titre,
            pll_length,
            uti_id_maker
        ) VALUES (
            ${pllTitle},
            0,
            ${userId}
        ) RETURNING
        pll_id AS "playlistId",
        pll_titre AS "playlistTitle",
        pll_length AS "playlistLength",
        uti_id_maker AS "playlistUserId"
    `

    const result = await pg.query(insertQuery)

    return result.rows[0]
}
