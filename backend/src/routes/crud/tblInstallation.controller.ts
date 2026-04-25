import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblInstallation,
  TblInstallationInputCreate,
  TblInstallationInputUpdate,
  TblInstallationPlain,
} from "orm/generated/prismabox/TblInstallation";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblInstallation = new BaseService(prisma.tblInstallation);

const ControllerTblInstallation = new BaseController({
  prefix: "/tblInstallation",
  swagger: {
    tags: ["tblInstallation"],
  },
  primaryKey: "instId",
  service: ServiceTblInstallation,
  createSchema: TblInstallationInputCreate,
  updateSchema: TblInstallationInputUpdate,
  responseSchema: buildResponseSchema(TblInstallationPlain, TblInstallation),
}).app;

export default ControllerTblInstallation;
