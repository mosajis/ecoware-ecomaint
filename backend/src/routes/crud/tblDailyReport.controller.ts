import { t } from "elysia";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { authPlugin } from "../auth/auth.guard";
import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblDailyReport,
  TblDailyReportInputCreate,
  TblDailyReportInputUpdate,
  TblDailyReportPlain,
} from "orm/generated/prismabox/TblDailyReport";

export const ServiceTblDailyReport = new BaseService(prisma.tblDailyReport);

export function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
}

export function formatReportDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

const ControllerTblDailyReport = new BaseController({
  prefix: "/tblDailyReport",
  swagger: {
    tags: ["tblDailyReport"],
  },
  primaryKey: "dailyReportId",
  service: ServiceTblDailyReport,
  createSchema: TblDailyReportInputCreate,
  updateSchema: TblDailyReportInputUpdate,
  responseSchema: buildResponseSchema(TblDailyReportPlain, TblDailyReport),
  extend(app) {
    app.use(authPlugin).post(
      "/",
      async ({ body, userId, headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const reportDate = new Date(body.reportDate);

        const { start, end } = getDayRange(reportDate);

        const user = await prisma.tblUser.findFirst({
          where: {
            userId,
          },
          include: {
            tblEmployee: {
              include: {
                tblDiscipline: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error("Employee not found");
        }

        const disciplineId = user.tblEmployee.discId;

        const duplicate = await prisma.tblDailyReport.findFirst({
          where: {
            reportDate: {
              gte: start,
              lte: end,
            },
            instId,
          },
        });

        if (duplicate) {
          throw new Error("Daily report already exists for this date");
        }

        const maintLogs = await prisma.tblMaintLog.findMany({
          where: {
            reportedDate: {
              gte: start,
              lte: end,
            },
            discId: disciplineId,
          },
        });

        const totalwaiting = maintLogs.reduce(
          (sum, item) => sum + (item.downTime ?? 0),
          0,
        );

        const disciplineName =
          user.tblEmployee.tblDiscipline?.name ?? "UNKNOWN";

        const reportTitle = `${disciplineName} - ${disciplineName.charAt(0).toUpperCase()}DR - ${formatReportDate(
          reportDate,
        )}`;

        return prisma.tblDailyReport.create({
          data: {
            reportTitle,
            reportDate,
            userComment: body.userComment,
            totalwaiting,

            createdEmployeeId: user.employeeId,
            createdDate: new Date(),
            lastUpdate: new Date(),
            instId,
          },
        });
      },
      {
        tags: ["tblDailyReport"],
        detail: { summary: "Create" },
        body: t.Object({
          reportDate: t.String(),
          userComment: t.Union([t.Null(), t.String()]),
        }),
        response: buildResponseSchema(TblDailyReportPlain, TblDailyReport),
      },
    );
  },
}).app;

export default ControllerTblDailyReport;
