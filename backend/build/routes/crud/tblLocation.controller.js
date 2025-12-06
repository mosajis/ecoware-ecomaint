import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblLocation, TblLocationInputCreate, TblLocationInputUpdate, TblLocationPlain, } from "orm/generated/prismabox/TblLocation";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblLocation = new BaseService(prisma.tblLocation);
const ControllerTblLocation = new BaseController({
    prefix: "/tblLocation",
    swagger: {
        tags: ["tblLocation"],
    },
    primaryKey: "locationId",
    service: ServiceTblLocation,
    createSchema: TblLocationInputCreate,
    updateSchema: TblLocationInputUpdate,
    responseSchema: buildResponseSchema(TblLocationPlain, TblLocation),
}).app;
export default ControllerTblLocation;
