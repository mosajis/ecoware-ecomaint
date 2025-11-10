import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblUserSign,
  TblUserSignInputCreate,
  TblUserSignInputUpdate,
  TblUserSignPlain,
} from "orm/generated/prismabox/TblUserSign";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserSign = new BaseService(prisma.tblUserSign);

const ControllerTblUserSign = new BaseController({
  prefix: "/tblUserSign",
  swagger: {
    tags: ["tblUserSign"],
  },
  service: ServiceTblUserSign,
  createSchema: TblUserSignInputCreate,
  updateSchema: TblUserSignInputUpdate,
  responseSchema: buildResponseSchema(TblUserSignPlain, TblUserSign),
}).app;

export default ControllerTblUserSign
