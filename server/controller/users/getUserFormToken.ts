import pg from '../../db'
import SQL from 'sql-template-strings'
import jwt from 'jsonwebtoken'
import { User } from './addUser'
import getUserById from './getUserById';

export default async function getUserFromToken(jwtToken: string): Promise<Partial<User>> {

    if (!jwtToken) {
        throw new Error('aucun token fournit')
    }

    // @ts-ignore process.env.JWT_SECRET should not be considered undefined in any circumstances
    const verified = jwt.verify(jwtToken, process.env.JWT_SECRET)

    const decodedToken = jwt.decode(jwtToken)

    if (!decodedToken) {
        throw new Error(`Le decodage du token a échoué`)
    }

    const user = await getUserById(decodedToken!['userId'])

    return user!
}
