import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
import type { connect } from "node:http2";
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

  async register(registerDto: any) {
    const {
      userName,
      password,
      userGroupId,
      employeeId,
      accountDisabled,
      forcePasswordChange,
    } = registerDto;

    const existingUser = await prisma.tblUser.findFirst({
      where: { userName: userName },
    });

    if (existingUser) {
      throw new Error("Username already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.tblUser.create({
      data: {
        tblEmployee: {
          connect: { employeeId: employeeId },
        },
        tblUserGroup: {
          connect: { userGroupId: userGroupId },
        },
        accountDisabled,
        forcePasswordChange,
        userName: userName,
        password: hashedPassword,
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
