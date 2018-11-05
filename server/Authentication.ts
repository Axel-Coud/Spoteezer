import jwt from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'

// Le fait d'être authentifié nous permet d'avoir l'userId dans la requête
declare global {
    namespace Express {
        interface Request {
            userId?: number
        }
    }
}

export default async function validateToken(req: Request , res: Response, next: NextFunction): Promise<void> {

    // Si l'utilisateur veut créer un compte ou se connecter on accepte sans token
    if (req.originalUrl === '/users/add' || req.originalUrl === '/login' || req.originalUrl === '/auth') {

        next()
    } else if (!req.cookies.token) {
        res.redirect('/')

    } else {
        const { token } = req.cookies
        // @ts-ignore process.env.JWT_SECRET should not be considered undefined in any circumstances
        const secret: string = process.env.JWT_SECRET
        jwt.verify(token, secret, (err, decoded) => {
            // Si le token n'est pas authentifié on renvoit sur l'entry point du serveur
            if (err) {
                console.log("JSON web token invalide pour ", req.originalUrl, " : " , err)
                return res.redirect('/')
            }
            console.log('/--/Token validé pour la route : ' + req.originalUrl)

            // On stock le userId pour la requête(moyen d'accès plus simple)
            req.userId = decoded.userId
            next()
        })

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
            userId
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
