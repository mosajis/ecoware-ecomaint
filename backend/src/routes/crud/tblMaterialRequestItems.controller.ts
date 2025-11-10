import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaterialRequestItems,
  TblMaterialRequestItemsInputCreate,
  TblMaterialRequestItemsInputUpdate,
  TblMaterialRequestItemsPlain,
} from "orm/generated/prismabox/TblMaterialRequestItems";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaterialRequestItems = new BaseService(prisma.tblMaterialRequestItems);

const ControllerTblMaterialRequestItems = new BaseController({
  prefix: "/tblMaterialRequestItems",
  swagger: {
    tags: ["tblMaterialRequestItems"],
  },
  service: ServiceTblMaterialRequestItems,
  createSchema: TblMaterialRequestItemsInputCreate,
  updateSchema: TblMaterialRequestItemsInputUpdate,
  responseSchema: buildResponseSchema(TblMaterialRequestItemsPlain, TblMaterialRequestItems),
}).app;

export default ControllerTblMaterialRequestItems
