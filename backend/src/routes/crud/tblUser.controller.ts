import { BaseController } from "@/utils/base.controller";
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
    app.get(
      "/",
      async ({ query }) => {
        const users = await ServiceTblUser.findAll({
          ...query,
          select: {
            userId: true,
            userName: true,
            lastLogin: true,
            accountDisabled: true,
            forcePasswordChange: true,
            tblEmployee: {
              select: {
                firstName: true,
                lastName: true,
                title: true,
                tblDiscipline: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            tblUserGroup: {
              select: {
                name: true,
              },
            },
          },
        });
        return users;
      },
      {
        response: ResponseSchema,
      },
    );
  },
}).app;

export default ControllerTblUser;
