import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthService } from "./auth.service";
import { TblUsersPlain } from "orm/generated/prismabox/TblUsers";
import { ServiceTblUsers } from "../crud/tblUsers.controller";

const authService = new AuthService();

export const UsersSafePlain = t.Omit(TblUsersPlain, ["uPassword"]);

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
      async ({ jwt, body, set }) => {
        const { username, password } = body;

        const user = await authService.validateUser({
          username: username,
          password,
        });

        if (!user) {
          set.status = 401;
          return {
            status: "error",
            message: "username or password is incorrect",
          };
        }

        // Update last login
        // await ServiceUsers.update(user.userId, { lastLoginDatetime: new Date() });

        const result = await authService.login(user, jwt.sign);
        return result;
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
        response: t.Union([
          t.Object({
            accessToken: t.String(),
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

    // 👤 Register
    .post(
      "/register",
      async ({ body, set }) => {
        try {
          await authService.register(body);
          return {};
        } catch (e: any) {
          set.status = 400;
          return {
            status: "error",
            message: e.message || "Registration failed",
          };
        }
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
        response: t.Object({}),
        detail: {
          tags: ["auth"],
          summary: "Register",
        },
      },
    )

    // 🚪 Logout
    .post(
      "/logout",
      async () => {
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
        const user = await ServiceTblUsers.findOne({ uUserName: username });

        if (!user) {
          // token is valid but user not found
          return {
            authorized: false,
            user: null,
            message: "User not found",
          };
        }

        // token valid and user exists
        const { uPassword, ...safeUser } = user;
        return {
          authorized: true,
          user: safeUser, // Matches UsersSafePlain
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
            user: UsersSafePlain,
          }),
        ]),
        detail: {
          tags: ["auth"],
          summary: "Get authorized user from token",
        },
      },
    ),
);
