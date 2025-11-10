import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { ServiceUsers } from "../crud/users.controller";
import { AuthService } from "./auth.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { Users, UsersPlain } from "orm/generated/prismabox/Users";

const authService = new AuthService();

export const UsersSafePlain = t.Omit(UsersPlain, ["uPassword"]);

export const ControllerAuth = new Elysia().group("/auth", (app) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: "Fischl von Luftschloss Narfidort",
      })
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
      }
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
      }
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
      }
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
        const user = await ServiceUsers.findOne({ uUserName: username });

        if (!user) {
          return {
            authorized: true,
            user: null,
          };
        }

        const { password, ...safeUser } = user;

        return {
          authorized: true,
          user: {
            ...safeUser,
            lastLoginDatetime: safeUser.lastLoginDatetime,
          },
        };
      },
      {
        response: t.Object({
          authorized: t.Boolean(),
          user: t.Nullable(buildResponseSchema(UsersSafePlain, Users)),
        }),
        detail: {
          tags: ["auth"],
          summary: "Get authorized user from token",
        },
      }
    )
);
