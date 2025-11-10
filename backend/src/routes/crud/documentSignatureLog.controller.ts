import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  DocumentSignatureLog,
  DocumentSignatureLogInputCreate,
  DocumentSignatureLogInputUpdate,
  DocumentSignatureLogPlain,
} from "orm/generated/prismabox/DocumentSignatureLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceDocumentSignatureLog = new BaseService(prisma.documentSignatureLog);

const ControllerDocumentSignatureLog = new BaseController({
  prefix: "/documentSignatureLog",
  swagger: {
    tags: ["documentSignatureLog"],
  },
  service: ServiceDocumentSignatureLog,
  createSchema: DocumentSignatureLogInputCreate,
  updateSchema: DocumentSignatureLogInputUpdate,
  responseSchema: buildResponseSchema(DocumentSignatureLogPlain, DocumentSignatureLog),
}).app;

export default ControllerDocumentSignatureLog
