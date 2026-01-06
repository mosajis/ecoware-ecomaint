import bcrypt from 'bcrypt'
import { PrismaClient, type TblUsers } from 'orm/generated/prisma'

const prisma = new PrismaClient()

export class AuthService {
  constructor() {}

  async validateUser({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<Omit<TblUsers, 'uPassword'> | null> {
    const user = await prisma.tblUsers.findFirst({
      where: { uUserName: username },
    })

    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.uPassword)
    if (!isPasswordValid) return null

    const { uPassword: _password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(user: Omit<TblUsers, 'uPassword'>, sign: (payload: any) => any) {
    const payload = {
      sub: user.userId,
      username: user.uUserName,
      userGroupId: user.userGroupId,
    }

    const accessToken = await sign(payload)

    return { accessToken }
  }

  async register(registerDto: { username: string; password: string }) {
    const { username, password } = registerDto

    const existingUser = await prisma.tblUsers.findFirst({
      where: { uUserName: username },
    })

    if (existingUser) {
      throw new Error('Mobile number already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.tblUsers.create({
      data: {
        uUserName: username,
        uPassword: hashedPassword,
        userGroupId: 3,
        uLastLogin: new Date().toISOString(),
        userId: 888,
      },
    })

    const { uPassword: _password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
