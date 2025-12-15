import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  Sysdiagrams,
  SysdiagramsInputCreate,
  SysdiagramsInputUpdate,
  SysdiagramsPlain,
} from "orm/generated/prismabox/Sysdiagrams";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceSysdiagrams = new BaseService(prisma.sysdiagrams);

const ControllerSysdiagrams = new BaseController({
  prefix: "/sysdiagrams",
  swagger: {
    tags: ["sysdiagrams"],
  },
  primaryKey: "diagramId",
  service: ServiceSysdiagrams,
  createSchema: SysdiagramsInputCreate,
  updateSchema: SysdiagramsInputUpdate,
  responseSchema: buildResponseSchema(SysdiagramsPlain, Sysdiagrams),
}).app;

export default ControllerSysdiagrams
