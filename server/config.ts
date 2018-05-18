/**
 * Contient toutes les propriétés nécessaires au fonctionnement du serveur et de la base de donnée
 */
interface Config {
    port: number
}

const config: Config = {
    port: 8888
}

export default config