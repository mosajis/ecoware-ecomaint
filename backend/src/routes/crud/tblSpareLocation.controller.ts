import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblSpareLocation,
  TblSpareLocationInputCreate,
  TblSpareLocationInputUpdate,
  TblSpareLocationPlain,
} from "orm/generated/prismabox/TblSpareLocation";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblSpareLocation = new BaseService(prisma.tblSpareLocation);

const ControllerTblSpareLocation = new BaseController({
  prefix: "/tblSpareLocation",
  swagger: {
    tags: ["tblSpareLocation"],
  },
  service: ServiceTblSpareLocation,
  createSchema: TblSpareLocationInputCreate,
  updateSchema: TblSpareLocationInputUpdate,
  responseSchema: buildResponseSchema(TblSpareLocationPlain, TblSpareLocation),
}).app;

export default ControllerTblSpareLocation
