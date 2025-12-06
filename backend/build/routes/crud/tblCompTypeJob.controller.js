import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import { TblCompTypeJob, TblCompTypeJobInputCreate, TblCompTypeJobInputUpdate, TblCompTypeJobPlain, } from "orm/generated/prismabox/TblCompTypeJob";
import { buildResponseSchema } from "@/utils/base.schema";
import { effectCompTypeJobChange } from "../effects/effect";
export const ServiceTblCompTypeJob = new BaseService(prisma.tblCompTypeJob);
const OperationEnum = t.Enum({
    CREATE: 0,
    UPDATE: 1,
    DELETE: 2,
});
const ControllerTblCompTypeJob = new BaseController({
    prefix: "/tblCompTypeJob",
    swagger: {
        tags: ["tblCompTypeJob"],
    },
    primaryKey: "compTypeJobId",
    service: ServiceTblCompTypeJob,
    createSchema: TblCompTypeJobInputCreate,
    updateSchema: TblCompTypeJobInputUpdate,
    responseSchema: buildResponseSchema(TblCompTypeJobPlain, TblCompTypeJob),
    extend: (app) => {
        app.post("/:compTypeJobId/effect", async ({ params, body, set }) => {
            try {
                const compTypeJobId = Number(params.compTypeJobId);
                if (isNaN(compTypeJobId)) {
                    set.status = 400;
                    return { status: "ERROR", message: "Invalid compTypeJobId" };
                }
                await effectCompTypeJobChange({
                    compTypeJobId,
                    operation: body.operation, // enum value
                });
                return { status: "OK" };
            }
            catch (err) {
                set.status = 400;
                return {
                    status: "ERROR",
                    message: err.message,
                };
            }
        }, {
            tags: ["tblCompTypeJob"],
            detail: {
                summary: "Apply Change Effect",
            },
            body: t.Object({
                operation: OperationEnum,
            }),
        });
    },
}).app;
export default ControllerTblCompTypeJob;
