import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblFailureReportAttachment,
  TblFailureReportAttachmentInputCreate,
  TblFailureReportAttachmentInputUpdate,
  TblFailureReportAttachmentPlain,
} from "orm/generated/prismabox/TblFailureReportAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureReportAttachment = new BaseService(
  prisma.tblFailureReportAttachment,
);

const ControllerTblFailureReportAttachment = new BaseController({
  prefix: "/tblFailureReportAttachment",
  swagger: {
    tags: ["tblFailureReportAttachment"],
  },
  primaryKey: "failureReportAttachmentId",
  service: ServiceTblFailureReportAttachment,
  createSchema: TblFailureReportAttachmentInputCreate,
  updateSchema: TblFailureReportAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblFailureReportAttachmentPlain,
    TblFailureReportAttachment,
  ),
}).app;

export default ControllerTblFailureReportAttachment;
