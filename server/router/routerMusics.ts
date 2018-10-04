import { Router } from 'express'
import multer from 'multer'
import addMusic, { MusicInfos } from '../controller/musics/addMusic'
import getAllMusic from '../controller/musics/getAllMusic'
import getOneMusic, { Music } from '../controller/musics/getOneMusic'
import deleteMusic from '../controller/musics/deleteMusic';

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/add', upload.single('file'), async (req, res) => {

    const musicInfos: MusicInfos = {
        artist: req.body.artist,
        title: req.body.title,
        uploaderId: req.body.uploaderId,
        length: req.body.duration
    }

    try {
        await addMusic(req.file, musicInfos)
    } catch (error) {
        return res.status(401).send("La musique n'a pas pu être ajoutée : " + error)
    }

    return res.status(200).send('Ajouté avec succès')
})

router.get('/all', async (_, res) => {

    let musicList: null | Music[] = null

    try {
        musicList = await getAllMusic()
    } catch (error) {
        return res.status(401).send("Échec get all music : " + error)
    }

    return res.status(200).send(musicList)
})

router.get('/download', async (req, res) => {

    let musicFile: null | {musicInfos: Music} & {file: Buffer} = null

    try {
        musicFile = await getOneMusic(req.query.musId)
    } catch (error) {
        return res.status(500).json(error.message)
    }

    res.status(200).download(musicFile.musicInfos.filepath)
})

router.delete('/delete', async (req, res) => {

    try {
        await deleteMusic(req.query.musId)
    } catch (error) {
        return res.status(500).json(error.message)
    }

    res.status(200).json()
})

export default router
