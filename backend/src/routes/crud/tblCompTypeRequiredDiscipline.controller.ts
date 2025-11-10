import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeRequiredDiscipline,
  TblCompTypeRequiredDisciplineInputCreate,
  TblCompTypeRequiredDisciplineInputUpdate,
  TblCompTypeRequiredDisciplinePlain,
} from "orm/generated/prismabox/TblCompTypeRequiredDiscipline";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeRequiredDiscipline = new BaseService(prisma.tblCompTypeRequiredDiscipline);

const ControllerTblCompTypeRequiredDiscipline = new BaseController({
  prefix: "/tblCompTypeRequiredDiscipline",
  swagger: {
    tags: ["tblCompTypeRequiredDiscipline"],
  },
  service: ServiceTblCompTypeRequiredDiscipline,
  createSchema: TblCompTypeRequiredDisciplineInputCreate,
  updateSchema: TblCompTypeRequiredDisciplineInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeRequiredDisciplinePlain, TblCompTypeRequiredDiscipline),
}).app;

export default ControllerTblCompTypeRequiredDiscipline
