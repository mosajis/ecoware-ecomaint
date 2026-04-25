import { BaseController, querySchema } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { t } from "elysia";
import {
  TblUser,
  TblUserInputCreate,
  TblUserInputUpdate,
  TblUserPlain,
} from "orm/generated/prismabox/TblUser";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { AuthService } from "../auth/auth.service";

const authService = new AuthService();

export const ServiceTblUser = new BaseService(prisma.tblUser);

const TypeUser = t.Object({
  userId: t.Integer(),
  userName: t.String(),
  lastLogin: t.Nullable(t.Date()),
  accountDisabled: t.Boolean(),
  forcePasswordChange: t.Boolean(),
  tblEmployee: t.Optional(
    t.Object({
      firstName: t.String(),
      lastName: t.String(),
      title: t.Nullable(t.String()),
      tblDiscipline: t.Optional(
        t.Object({
          name: t.String(),
        }),
      ),
    }),
  ),
  tblUserGroup: t.Optional(
    t.Object({
      name: t.String(),
    }),
  ),
});

const ResponseSchema = t.Object({
  items: t.Array(TypeUser),
  total: t.Number(),
  page: t.Number(),
  perPage: t.Number(),
  totalPages: t.Number(),
});

const ControllerTblUser = new BaseController({
  prefix: "/tblUser",
  swagger: {
    tags: ["tblUser"],
  },
  primaryKey: "userId",
  service: ServiceTblUser,
  createSchema: TblUserInputCreate,
  updateSchema: TblUserInputUpdate,
  responseSchema: buildResponseSchema(TblUserPlain, TblUser),
  extend: (app) => {
    // 👤 Register
    app.post(
      "/",
      async ({ body, set }) => {
        try {
          const result = await authService.register(body);
          return result;
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
          userName: t.String(),
          password: t.String(),
          employeeId: t.Number(),
          userGroupId: t.Number(),
          accountDisabled: t.Boolean(),
          forcePasswordChange: t.Boolean(),
        }),
        response: buildResponseSchema(TypeUser, TblUser),
        detail: {
          tags: ["tblUser"],
          summary: "Create",
        },
      },
    );
  },
}).app;

export default ControllerTblUser;
