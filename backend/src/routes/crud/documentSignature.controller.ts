import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  DocumentSignature,
  DocumentSignatureInputCreate,
  DocumentSignatureInputUpdate,
  DocumentSignaturePlain,
} from "orm/generated/prismabox/DocumentSignature";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceDocumentSignature = new BaseService(prisma.documentSignature);

const ControllerDocumentSignature = new BaseController({
  prefix: "/documentSignature",
  swagger: {
    tags: ["documentSignature"],
  },
  service: ServiceDocumentSignature,
  createSchema: DocumentSignatureInputCreate,
  updateSchema: DocumentSignatureInputUpdate,
  responseSchema: buildResponseSchema(DocumentSignaturePlain, DocumentSignature),
}).app;

export default ControllerDocumentSignature
