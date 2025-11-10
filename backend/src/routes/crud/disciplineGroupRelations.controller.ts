import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  DisciplineGroupRelations,
  DisciplineGroupRelationsInputCreate,
  DisciplineGroupRelationsInputUpdate,
  DisciplineGroupRelationsPlain,
} from "orm/generated/prismabox/DisciplineGroupRelations";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceDisciplineGroupRelations = new BaseService(prisma.disciplineGroupRelations);

const ControllerDisciplineGroupRelations = new BaseController({
  prefix: "/disciplineGroupRelations",
  swagger: {
    tags: ["disciplineGroupRelations"],
  },
  service: ServiceDisciplineGroupRelations,
  createSchema: DisciplineGroupRelationsInputCreate,
  updateSchema: DisciplineGroupRelationsInputUpdate,
  responseSchema: buildResponseSchema(DisciplineGroupRelationsPlain, DisciplineGroupRelations),
}).app;

export default ControllerDisciplineGroupRelations
