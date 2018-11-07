import { Client } from 'pg'
import config from './config'

const client = new Client(config.dbConfig)

client.on('error', (err) => {
    console.log('Erreur émise par le client postgres: ', err)
});

(async () => {
    await client.connect()
})();

export default client
