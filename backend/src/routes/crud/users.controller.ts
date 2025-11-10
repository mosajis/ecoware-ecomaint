import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  Users,
  UsersInputCreate,
  UsersInputUpdate,
  UsersPlain,
} from "orm/generated/prismabox/Users";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceUsers = new BaseService(prisma.users);

const ControllerUsers = new BaseController({
  prefix: "/users",
  swagger: {
    tags: ["users"],
  },
  service: ServiceUsers,
  createSchema: UsersInputCreate,
  updateSchema: UsersInputUpdate,
  responseSchema: buildResponseSchema(UsersPlain, Users),
}).app;

export default ControllerUsers
