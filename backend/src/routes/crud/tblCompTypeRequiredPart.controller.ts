import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeRequiredPart,
  TblCompTypeRequiredPartInputCreate,
  TblCompTypeRequiredPartInputUpdate,
  TblCompTypeRequiredPartPlain,
} from "orm/generated/prismabox/TblCompTypeRequiredPart";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeRequiredPart = new BaseService(prisma.tblCompTypeRequiredPart);

const ControllerTblCompTypeRequiredPart = new BaseController({
  prefix: "/tblCompTypeRequiredPart",
  swagger: {
    tags: ["tblCompTypeRequiredPart"],
  },
  service: ServiceTblCompTypeRequiredPart,
  createSchema: TblCompTypeRequiredPartInputCreate,
  updateSchema: TblCompTypeRequiredPartInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeRequiredPartPlain, TblCompTypeRequiredPart),
}).app;

export default ControllerTblCompTypeRequiredPart
