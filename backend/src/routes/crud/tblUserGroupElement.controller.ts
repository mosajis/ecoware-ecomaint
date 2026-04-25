import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblUserGroupElement,
  TblUserGroupElementInputCreate,
  TblUserGroupElementInputUpdate,
  TblUserGroupElementPlain,
} from "orm/generated/prismabox/TblUserGroupElement";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserGroupElement = new BaseService(prisma.tblUserGroupElement);

const ControllerTblUserGroupElement = new BaseController({
  prefix: "/tblUserGroupElement",
  swagger: {
    tags: ["tblUserGroupElement"],
  },
  primaryKey: "userGroupElementId",
  service: ServiceTblUserGroupElement,
  createSchema: TblUserGroupElementInputCreate,
  updateSchema: TblUserGroupElementInputUpdate,
  responseSchema: buildResponseSchema(TblUserGroupElementPlain, TblUserGroupElement),
}).app;

export default ControllerTblUserGroupElement;
