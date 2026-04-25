import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblUserGroup,
  TblUserGroupInputCreate,
  TblUserGroupInputUpdate,
  TblUserGroupPlain,
} from "orm/generated/prismabox/TblUserGroup";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserGroup = new BaseService(prisma.tblUserGroup);

const ControllerTblUserGroup = new BaseController({
  prefix: "/tblUserGroup",
  swagger: {
    tags: ["tblUserGroup"],
  },
  primaryKey: "userGroupId",
  service: ServiceTblUserGroup,
  createSchema: TblUserGroupInputCreate,
  updateSchema: TblUserGroupInputUpdate,
  responseSchema: buildResponseSchema(TblUserGroupPlain, TblUserGroup),
}).app;

export default ControllerTblUserGroup;
