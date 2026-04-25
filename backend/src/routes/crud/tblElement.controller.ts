import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblElement,
  TblElementInputCreate,
  TblElementInputUpdate,
  TblElementPlain,
} from "orm/generated/prismabox/TblElement";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblElement = new BaseService(prisma.tblElement);

const ControllerTblElement = new BaseController({
  prefix: "/tblElement",
  swagger: {
    tags: ["tblElement"],
  },
  primaryKey: "elementId",
  service: ServiceTblElement,
  createSchema: TblElementInputCreate,
  updateSchema: TblElementInputUpdate,
  responseSchema: buildResponseSchema(TblElementPlain, TblElement),
}).app;

export default ControllerTblElement;
