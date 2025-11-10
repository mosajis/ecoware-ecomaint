import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblAddressProduct,
  TblAddressProductInputCreate,
  TblAddressProductInputUpdate,
  TblAddressProductPlain,
} from "orm/generated/prismabox/TblAddressProduct";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblAddressProduct = new BaseService(prisma.tblAddressProduct);

const ControllerTblAddressProduct = new BaseController({
  prefix: "/tblAddressProduct",
  swagger: {
    tags: ["tblAddressProduct"],
  },
  service: ServiceTblAddressProduct,
  createSchema: TblAddressProductInputCreate,
  updateSchema: TblAddressProductInputUpdate,
  responseSchema: buildResponseSchema(TblAddressProductPlain, TblAddressProduct),
}).app;

export default ControllerTblAddressProduct
