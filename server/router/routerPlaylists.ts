import { Router } from 'express'
import getUserPlaylists, { Playlist } from '../controller/playlists/getUserPlaylists'
import addPlaylist from '../controller/playlists/addPlaylist'
import getPlaylistFromId from '../controller/playlists/getPlaylistFromId'
import deletePlaylist from '../controller/playlists/deletePlaylist';

const router = Router()

router.get('/', async (req, res) => {

    let playlist: Playlist | null = null
    try {
        playlist = await getPlaylistFromId(req.query.playlistId)
    } catch (error) {
        return res.status(500).json(error.message)
    }

    return res.status(200).json(playlist)
})

router.get('/allFromUser', async (req, res) => {

    let userPlaylists: Playlist[] | null = null
    try {
        userPlaylists = await getUserPlaylists(req.userId!)
    } catch (error) {
        return res.status(500).json(error.message)
    }

    return res.status(200).json(userPlaylists)
})

router.post('/add', async (req, res) => {

    let addedPlaylist: Playlist | null = null
    try {
        addedPlaylist = await addPlaylist(req.userId!, req.body.pllTitle)
    } catch (error) {
        return res.status(500).json(error.message)
    }

    return res.status(200).json(addedPlaylist)
})

router.delete('/delete', async (req, res) => {

    let deletedPlaylist: Playlist | null = null
    try {
        deletedPlaylist = await deletePlaylist(req.query.playlistId)
    } catch (error) {
        return res.status(500).json(error.message)
    }

    return res.status(200).json(deletedPlaylist)
})

export default router
