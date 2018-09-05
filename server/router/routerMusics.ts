import { Router } from 'express'
import multer from 'multer'
import addMusic, { MusicInfos } from '../controller/musics/addMusic'

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

export default router
