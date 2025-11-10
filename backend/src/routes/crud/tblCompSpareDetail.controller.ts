import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompSpareDetail,
  TblCompSpareDetailInputCreate,
  TblCompSpareDetailInputUpdate,
  TblCompSpareDetailPlain,
} from "orm/generated/prismabox/TblCompSpareDetail";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompSpareDetail = new BaseService(prisma.tblCompSpareDetail);

const ControllerTblCompSpareDetail = new BaseController({
  prefix: "/tblCompSpareDetail",
  swagger: {
    tags: ["tblCompSpareDetail"],
  },
  service: ServiceTblCompSpareDetail,
  createSchema: TblCompSpareDetailInputCreate,
  updateSchema: TblCompSpareDetailInputUpdate,
  responseSchema: buildResponseSchema(TblCompSpareDetailPlain, TblCompSpareDetail),
}).app;

export default ControllerTblCompSpareDetail
