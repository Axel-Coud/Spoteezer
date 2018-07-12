import bcrypt from 'bcrypt'

export default async function encryptPassword(password: string): Promise<string> {

    const salt = await bcrypt.genSalt()
    const cryptedPwd = await bcrypt.hash(password, salt)

    return cryptedPwd
}
