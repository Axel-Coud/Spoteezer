import { Client } from 'pg'

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'spoteezer',
    password: 'admin',
    port: 5432
})

client.on('error', (err) => {
    console.log('Erreur émise par le client postgres: ', err)
});

(async () => {
    client.connect()
})();

export default client
