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
    port: 8889,
    dbConfig: {
        user: 'postgres',
        host: 'localhost',
        database: 'spoteezer',
        // Cast env var to string as typescript thinks it can be undefined
        password: process.env.DB_PWD as string,
        port: 5432
    }
}

export default config
