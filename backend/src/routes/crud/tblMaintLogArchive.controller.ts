import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaintLogArchive,
  TblMaintLogArchiveInputCreate,
  TblMaintLogArchiveInputUpdate,
  TblMaintLogArchivePlain,
} from "orm/generated/prismabox/TblMaintLogArchive";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintLogArchive = new BaseService(prisma.tblMaintLogArchive);

const ControllerTblMaintLogArchive = new BaseController({
  prefix: "/tblMaintLogArchive",
  swagger: {
    tags: ["tblMaintLogArchive"],
  },
  service: ServiceTblMaintLogArchive,
  createSchema: TblMaintLogArchiveInputCreate,
  updateSchema: TblMaintLogArchiveInputUpdate,
  responseSchema: buildResponseSchema(TblMaintLogArchivePlain, TblMaintLogArchive),
}).app;

export default ControllerTblMaintLogArchive
