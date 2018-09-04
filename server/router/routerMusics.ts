import { Router } from 'express'
import multer from 'multer'
import { resolve } from 'path'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/add', upload.single('file'), async (req, res) => {
    const path = resolve(__dirname, '../uploadBucket')

    return res.status(200).send('Ajouté avec succès')
})

export default router
