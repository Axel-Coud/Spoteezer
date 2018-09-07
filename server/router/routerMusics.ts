import { Router } from 'express'
import multer from 'multer'
import addMusic, { MusicInfos } from '../controller/musics/addMusic'
import getAllMusic, { Music } from '../controller/musics/getAllMusic';

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
        // GET ALL MODULE
        musicList = await getAllMusic()
    } catch (error) {
        return res.status(401).send("Échec get all music : " + error)
    }

    return res.status(200).send(musicList)
})

export default router
