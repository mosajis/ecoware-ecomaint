import { BaseController, querySchema } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { t } from "elysia";

import {
  TblFailureReport,
  TblFailureReportInputCreate,
  TblFailureReportInputUpdate,
  TblFailureReportPlain,
} from "orm/generated/prismabox/TblFailureReport";

import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { generateDocumentNumber, removeNulls } from "@/helper";
import { TblMaintLogInputCreate } from "orm/generated/prismabox/TblMaintLog";
import { TblInstallation } from "orm/generated/prismabox/TblInstallation";
import { TblFailureGroupFollow } from "orm/generated/prismabox/TblFailureGroupFollow";
import { TblLocation } from "orm/generated/prismabox/TblLocation";
import { authPlugin } from "../auth/auth.guard";

export const ServiceTblFailureReports = new BaseService(
  prisma.tblFailureReport,
);

export const CreateFullFailureReportSchema = t.Object({
  maintLog: TblMaintLogInputCreate,
  failureReport: TblFailureReportInputCreate,
});

const ControllerTblFailureReports = new BaseController({
  prefix: "/tblFailureReport",
  swagger: {
    tags: ["tblFailureReport"],
  },
  primaryKey: "failureReportId",
  service: ServiceTblFailureReports,
  createSchema: TblFailureReportInputCreate,
  updateSchema: TblFailureReportInputUpdate,
  responseSchema: buildResponseSchema(TblFailureReportPlain, TblFailureReport),
  scope: true,

  extend: (app) => {
    /**
     * 🚀 CREATE FULL
     */
    app.use(authPlugin).post(
      "/full",
      async ({ body, headers, userId }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

        return await prisma.$transaction(async (tx) => {
          const user = await tx.tblUser.findFirst({
            where: {
              userId: Number(userId),
            },
          });

          // 🔥 global generator
          const failureNumber = await generateDocumentNumber({
            tx,
            model: "tblFailureReport",
            prefix: "FR",
          });

          const maintLogData = removeNulls({
            ...body.maintLog,

            tblDiscipline: body.maintLog.tblDiscipline,
            tblMaintClass: body.maintLog.tblMaintClass,
            tblMaintCause: body.maintLog.tblMaintCause,
            tblMaintType: body.maintLog.tblMaintType,
            tblComponentUnit: body.maintLog.tblComponentUnit,

            tblEmployee: {
              connect: {
                employeeId: user?.employeeId,
              },
            },
            tblInstallation: {
              connect: {
                instId,
              },
            },
          });

          const maintLog = await tx.tblMaintLog.create({
            include: {
              tblComponentUnit: {
                include: {
                  tblLocation: true,
                },
              },
            },
            data: maintLogData,
          });

          const failureReportData = removeNulls({
            ...body.failureReport,

            failureNumber,
            tblMaintLog: {
              connect: {
                maintLogId: maintLog.maintLogId,
              },
            },
            tblFailureSeverityLevel:
              body.failureReport.tblFailureSeverityLevel || undefined,
            tblFailureStatus: body.failureReport.tblFailureStatus || undefined,
            tblFailureGroupFollow:
              body.failureReport?.tblFailureGroupFollow || undefined,

            tblLocation: maintLog.tblComponentUnit?.tblLocation
              ? {
                  connect: {
                    locationId:
                      maintLog.tblComponentUnit?.tblLocation?.locationId,
                  },
                }
              : undefined,
            tblInstallation: {
              connect: {
                instId,
              },
            },
          });
          const failureReport = await tx.tblFailureReport.create({
            data: failureReportData,
            include: {
              tblMaintLog: true,
              tblFailureSeverityLevel: true,
              tblFailureStatus: true,
              tblFailureGroupFollow: true,
              tblLocation: true,
            },
          });

          return failureReport;
        });
      },
      {
        body: CreateFullFailureReportSchema,
        response: buildResponseSchema(TblFailureReportPlain, TblFailureReport),
        tags: ["tblFailureReport"],
        detail: {
          summary: "Create Full",
        },
      },
    );

    /**
     * 🔁 UPDATE FULL
     */
    app.use(authPlugin).put(
      "/:failureReportId/full",
      async ({ params, body, userId }) => {
        const id = Number(params.failureReportId);

        return await prisma.$transaction(async (tx) => {
          const user = await tx.tblUser.findFirst({
            where: {
              userId: Number(userId),
            },
          });

          const existing = await tx.tblFailureReport.findUnique({
            where: { failureReportId: id },
          });

          if (!existing) {
            throw new Error("FailureReport not found");
          }

          if (existing.maintLogId) {
            const maintLogData = removeNulls({
              ...body.maintLog,

              tblEmployee: body.maintLog.tblEmployee,
              tblDiscipline: body.maintLog.tblDiscipline,
              tblMaintClass: body.maintLog.tblMaintClass,
              tblMaintCause: body.maintLog.tblMaintCause,
              tblMaintType: body.maintLog.tblMaintType,

              updatedEmployeeId: user?.employeeId,
            });

            await tx.tblMaintLog.update({
              where: { maintLogId: existing.maintLogId },
              data: maintLogData,
            });
          }

          const failureReportData = removeNulls({
            ...body.failureReport,

            tblFailureSeverityLevel: body.failureReport.tblFailureSeverityLevel,
            tblFailureStatus: body.failureReport.tblFailureStatus,
            tblFailureGroupFollow: body.failureReport?.tblFailureGroupFollow,
          });

          return await tx.tblFailureReport.update({
            where: { failureReportId: id },
            data: failureReportData,
            include: {
              tblMaintLog: true,
              tblFailureSeverityLevel: true,
              tblFailureStatus: true,
              tblFailureGroupFollow: true,
              tblLocation: true,
            },
          });
        });
      },
      {
        query: t.Object({
          include: t.Optional(t.String()),
          select: t.Optional(t.String()),
        }),
        body: CreateFullFailureReportSchema,
        response: buildResponseSchema(TblFailureReportPlain, TblFailureReport),
        tags: ["tblFailureReport"],
        detail: {
          summary: "Update Full",
        },
      },
    );
  },
}).app;

export default ControllerTblFailureReports;
