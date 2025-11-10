import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  DisciplineGroup,
  DisciplineGroupInputCreate,
  DisciplineGroupInputUpdate,
  DisciplineGroupPlain,
} from "orm/generated/prismabox/DisciplineGroup";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceDisciplineGroup = new BaseService(prisma.disciplineGroup);

const ControllerDisciplineGroup = new BaseController({
  prefix: "/disciplineGroup",
  swagger: {
    tags: ["disciplineGroup"],
  },
  service: ServiceDisciplineGroup,
  createSchema: DisciplineGroupInputCreate,
  updateSchema: DisciplineGroupInputUpdate,
  responseSchema: buildResponseSchema(DisciplineGroupPlain, DisciplineGroup),
}).app;

export default ControllerDisciplineGroup
