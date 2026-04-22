import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
import { type TblUser } from "orm/generated/prisma/client";

export class AuthService {
  constructor() {}

  async validateUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<Omit<TblUser, "password"> | null> {
    const user = await prisma.tblUser.findFirst({
      where: { userName: username },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!isPasswordValid) return null;

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(
    user: Omit<TblUser, "password">,
    loginAuditId: number,
    sign: (payload: any) => any,
  ) {
    const payload = {
      sub: user.userId,
      username: user.userName,
      userGroupId: user.userGroupId,
      loginAuditId,
    };

    const accessToken = await sign(payload);

    return { accessToken };
  }

  async register(registerDto: { username: string; password: string }) {
    const { username, password } = registerDto;

    const existingUser = await prisma.tblUser.findFirst({
      where: { userName: username },
    });

    if (existingUser) {
      throw new Error("Mobile number already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.tblUser.create({
      data: {
        userName: username,
        password: hashedPassword,
        userGroupId: 3,
        lastLogin: new Date().toString(),
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
