import jwt from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'

export default function validateToken(req: Request, res: Response, next: NextFunction): void {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        // @ts-ignore process.env.JWT_SECRET should not be considered undefined in any circumstances
        const secret: string = process.env.JWT_SECRET
        jwt.verify(token, secret, (err) => {
            if (err) {
                next(new Error("Json Web Token Invalide : " + err))
            }
            next()
        })

    }
    // try {
    //     const token = await generateToken(1)
    // } catch (error) {
    //     console.log(error)
    // }
}

interface JwtPayload {
    userId: number,
    data?: any
}

export const generateToken =  async (userId: number): Promise<string> => {
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
