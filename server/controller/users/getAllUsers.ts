import pgClient from '../../db'
import SQL from 'sql-template-strings'
import { User } from './addUser';

export default async function getAllUsers(): Promise<User[]> {

    const sql = SQL`
        SELECT
            *
        FROM
            utilisateur_uti
    `

    const results = await pgClient.query(sql)

    return results.rows
}
