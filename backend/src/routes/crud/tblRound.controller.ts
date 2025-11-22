import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblRound,
  TblRoundInputCreate,
  TblRoundInputUpdate,
  TblRoundPlain,
} from "orm/generated/prismabox/TblRound";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblRound = new BaseService(prisma.tblRound);

const ControllerTblRound = new BaseController({
  prefix: "/tblRound",
  swagger: {
    tags: ["tblRound"],
  },
  primaryKey: "roundId",
  service: ServiceTblRound,
  createSchema: TblRoundInputCreate,
  updateSchema: TblRoundInputUpdate,
  responseSchema: buildResponseSchema(TblRoundPlain, TblRound),
}).app;

export default ControllerTblRound
