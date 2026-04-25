import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblUserInstallation,
  TblUserInstallationInputCreate,
  TblUserInstallationInputUpdate,
  TblUserInstallationPlain,
} from "orm/generated/prismabox/TblUserInstallation";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserInstallation = new BaseService(prisma.tblUserInstallation);

const ControllerTblUserInstallation = new BaseController({
  prefix: "/tblUserInstallation",
  swagger: {
    tags: ["tblUserInstallation"],
  },
  primaryKey: "userInstId",
  service: ServiceTblUserInstallation,
  createSchema: TblUserInstallationInputCreate,
  updateSchema: TblUserInstallationInputUpdate,
  responseSchema: buildResponseSchema(TblUserInstallationPlain, TblUserInstallation),
}).app;

export default ControllerTblUserInstallation;
