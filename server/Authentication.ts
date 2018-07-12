import jwt from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'

export default async function validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {

    // Si l'utilisateur veut créer un compte ou se connecter on accepte sans token
    if (req.originalUrl === '/users/add' || req.originalUrl === '/login') {

        next()
    } else if (!req.cookies.jwt) {
        res.status(500).send('No token provided')
        
    } else {
        const { token } = req.cookies
        // @ts-ignore process.env.JWT_SECRET should not be considered undefined in any circumstances
        const secret: string = process.env.JWT_SECRET
        jwt.verify(token, secret, (err) => {
            // Si le token n'est pas authentifié on renvoit sur l'entry point du serveur(page de login)
            if (err) {
                console.log("JSON web token invalide : ", err)
                res.sendFile('index.html')
            }
            console.log('/--/Token validé')
            next()
        })

        // try {
        //     const token = generateToken(1)
        // } catch (error) {
        //     console.log(error)
        // }
    }
}

interface JwtPayload {
    userId: number,
    data?: any
}

export const generateToken = (userId: number): string => {
    if (process.env.JWT_SECRET) {
        const secret: string = process.env.JWT_SECRET
        const payload: JwtPayload = {
            userId,
            data: 'pouet'
        }
        const token = jwt.sign(payload, secret, {
            expiresIn: "30m"
        })
        return token

    } else {
        throw new Error(`
            Vous ne pouvez pas générer de token JWT(Variable d'environnement contenant le Secret introuvable)
        `)
    }
}
