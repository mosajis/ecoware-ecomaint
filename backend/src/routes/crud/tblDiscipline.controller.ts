import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDiscipline,
  TblDisciplineInputCreate,
  TblDisciplineInputUpdate,
  TblDisciplinePlain,
} from "orm/generated/prismabox/TblDiscipline";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDiscipline = new BaseService(prisma.tblDiscipline);

const ControllerTblDiscipline = new BaseController({
  prefix: "/tblDiscipline",
  swagger: {
    tags: ["tblDiscipline"],
  },
  primaryKey: "discId",
  service: ServiceTblDiscipline,
  createSchema: TblDisciplineInputCreate,
  updateSchema: TblDisciplineInputUpdate,
  responseSchema: buildResponseSchema(TblDisciplinePlain, TblDiscipline),
}).app;

export default ControllerTblDiscipline;
