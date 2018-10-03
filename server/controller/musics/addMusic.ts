import SQL from 'sql-template-strings'
import pg from '../../db'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export interface MusicInfos {
    uploaderId: number,
    title: string,
    artist: string,
    length: string
}

/**
 * Prend un fichier multer et des infos précise du morceau en paramètre et l'écrit dans le serveur + base de données
 * @param musicFile Fichier storé dans la ram grâce à multer
 * @param infos informations supplémentaire nécessaire à l'upload dans la base donnée
 */
export default async function addMusic(musicFile: Express.Multer.File, infos: MusicInfos): Promise<void> {

    const uploadFolderPath = path.join(__dirname, '../..', 'uploadBucket', infos.title + '.mp3')

    await writeFile(uploadFolderPath, musicFile.buffer)

    const insertQuery = SQL`
        INSERT INTO musique_mus (
            mus_titre,
            mus_artiste,
            mus_length,
            mus_path,
            mus_filesize,
            uti_id_uploader
        ) VALUES (
            ${infos.title},
            ${infos.artist},
            ${infos.length},
            ${uploadFolderPath},
            ${convertBytesToSize(musicFile.size)},
            ${infos.uploaderId}
        )
    `

    await pg.query(insertQuery)

    return
}

function convertBytesToSize(bytes: number): string {

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) {
        return 'n/a'
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    if (i === 0) {
        return bytes + ' ' + sizes[i]
    }
    const convertedSize = (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]

    return convertedSize
}
