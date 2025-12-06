import bcrypt from "bcrypt";
import { PrismaClient } from "orm/generated/prisma";
const prisma = new PrismaClient();
export class AuthService {
    constructor() { }
    async validateUser({ username, password, }) {
        const user = await prisma.users.findFirst({
            where: { uUserName: username },
        });
        if (!user)
            return null;
        const isPasswordValid = await bcrypt.compare(password, user.uPassword);
        if (!isPasswordValid)
            return null;
        const { uPassword: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(user, sign) {
        const payload = {
            sub: user.userId,
            username: user.uUserName,
            userGroupId: user.userGroupId,
        };
        const accessToken = await sign(payload);
        return { accessToken };
    }
    async register(registerDto) {
        const { username, password } = registerDto;
        const existingUser = await prisma.users.findFirst({
            where: { uUserName: username },
        });
        if (existingUser) {
            throw new Error("Mobile number already in use");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                uUserName: username,
                uPassword: hashedPassword,
                userGroupId: 3,
                uLastLogin: new Date().toISOString(),
                userId: 888,
            },
        });
        const { uPassword: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
