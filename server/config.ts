/**
 * Contient toutes les propriétés nécessaires au fonctionnement du serveur et de la base de donnée
 */
interface Config {
    port: number
    dbConfig: DbConfig
}

interface DbConfig {
    user: string
    host: string
    database: string
    password: string
    port: number
}

const config: Config = {
    port: 8888,
    dbConfig: {
        user: 'postgres',
        host: 'localhost',
        database: 'spoteezer',
        password: 'admin',
        port: 5432
    }
}

export default config
