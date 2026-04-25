import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthService } from "./auth.service";
import { prisma } from "@/utils/prisma";
import { TblUserPlain } from "orm/generated/prismabox/TblUser";

const authService = new AuthService();

export const UsersSafePlain = t.Omit(TblUserPlain, ["password"]);

export const ControllerAuth = new Elysia().group("/auth", (app) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env["JWT_SECRET"] || "",
        exp: "1d",
      }),
    )
    // 🔐 Login
    .post(
      "/login",
      async ({ jwt, body, set, request }) => {
        const { username, password } = body;

        const clientIp = "unknown";
        const clientAgent = request.headers.get("user-agent") || "unknown";
        const now = new Date();

        const user = await authService.validateUser({
          username: username,
          password,
        });

        if (!user) {
          await prisma.tblLoginAudit.create({
            data: {
              employeeId: null,
              actionType: 3, // Error
              isSuccess: false,
              createdAt: now,
              errorMessage: "username or password is incorrect",
              ipAddress: clientIp,
              deviceInfo: clientAgent,
            },
          });

          set.status = 401;
          return {
            status: "error",
            message: "username or password is incorrect",
          };
        }

        if (user.accountDisabled) {
          await prisma.tblLoginAudit.create({
            data: {
              employeeId: user.employeeId,
              actionType: 3, // Error
              isSuccess: false,
              createdAt: now,
              errorMessage: "Account is disabled",
              ipAddress: clientIp,
              deviceInfo: clientAgent,
            },
          });

          set.status = 403;
          return {
            status: "error",
            message: "Account is disabled",
          };
        }

        const loginAudit = await prisma.tblLoginAudit.create({
          data: {
            employeeId: user.employeeId,
            actionType: 1, // 1: Login
            isSuccess: true,
            ipAddress: clientIp,
            deviceInfo: clientAgent,
            loginTime: now,
            createdAt: now,
            errorMessage: "",
          },
        });

        const loginAuditId = loginAudit.loginAuditId;

        // Update last login
        await prisma.tblUser.update({
          where: { userId: user.userId },
          data: {
            lastLogin: now,
          },
        });

        const { accessToken } = await authService.login(
          user,
          loginAuditId,
          jwt.sign,
        );

        return { accessToken, loginAuditId };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
        response: t.Union([
          t.Object({
            accessToken: t.String(),
            loginAuditId: t.Number(),
          }),
          t.Object({
            message: t.String(),
          }),
        ]),
        detail: {
          tags: ["auth"],
          summary: "Login",
        },
      },
    )

    // 🚪 Logout
    .post(
      "/logout",
      async ({ jwt, headers }) => {
        const authHeader = headers["authorization"];
        const token = authHeader?.split(" ")[1];

        if (token) {
          const payload = await jwt.verify(token);

          if (payload && payload.loginAuditId) {
            await prisma.tblLoginAudit.update({
              where: { loginAuditId: Number(payload.loginAuditId) },
              data: { logoutTime: new Date() },
            });
          }
        }

        return { success: true };
      },
      {
        response: t.Object({
          success: t.Boolean(),
        }),
        detail: {
          tags: ["auth"],
          summary: "Logout",
        },
      },
    )

    // ✅ Auth check
    .get(
      "/authorization",
      async ({ jwt, headers, set }) => {
        const authHeader = headers["authorization"];
        const token = authHeader?.split(" ")[1];

        if (!token) {
          set.status = 401;
          return {
            authorized: false,
            user: null,
            message: "Authorization token missing",
          };
        }

        const payload = await jwt.verify(token);

        if (!payload || !payload.username) {
          set.status = 401;
          return {
            authorized: false,
            user: null,
            message: "Invalid or expired token",
          };
        }

        const username = String(payload.username);
        const user = await prisma.tblUser.findFirst({
          where: { userName: username },
          select: {
            userId: true,
            userName: true,
            forcePasswordChange: true,
            tblEmployee: {
              select: {
                employeeId: true,
                lastName: true,
                firstName: true,

                tblDiscipline: {
                  select: {
                    name: true,
                    discId: true,
                  },
                },
              },
            },
          },
        });

        if (!user) {
          // token is valid but user not found
          return {
            authorized: false,
            user: null,
            message: "User not found",
          };
        }

        return {
          authorized: true,
          user: user, // Matches UsersSafePlain
        };
      },
      {
        response: t.Union([
          t.Object({
            authorized: t.Literal(false),
            user: t.Null(),
            message: t.String(),
          }),
          t.Object({
            authorized: t.Literal(true),
            user: t.Any(),
          }),
        ]),
        detail: {
          tags: ["auth"],
          summary: "Get authorized user from token",
        },
      },
    ),
);
