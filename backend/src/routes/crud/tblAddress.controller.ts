import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblAddress,
  TblAddressInputCreate,
  TblAddressInputUpdate,
  TblAddressPlain,
} from "orm/generated/prismabox/TblAddress";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblAddress = new BaseService(prisma.tblAddress);

const ControllerTblAddress = new BaseController({
  prefix: "/tblAddress",
  swagger: {
    tags: ["tblAddress"],
  },
  primaryKey: "addressId",
  service: ServiceTblAddress,
  createSchema: TblAddressInputCreate,
  updateSchema: TblAddressInputUpdate,
  responseSchema: buildResponseSchema(TblAddressPlain, TblAddress),
}).app;

export default ControllerTblAddress
