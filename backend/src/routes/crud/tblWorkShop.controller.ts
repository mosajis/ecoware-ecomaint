import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { Elysia, t } from "elysia";
import {
  TblWorkShop,
  TblWorkShopInputCreate,
  TblWorkShopInputUpdate,
  TblWorkShopPlain,
} from "orm/generated/prismabox/TblWorkShop";
import { generateDocumentNumber } from "@/helper";

export const ServiceTblWorkShop = new BaseService(prisma.tblWorkShop);

const ControllerTblWorkShop = new BaseController({
  prefix: "/tblWorkShop",
  swagger: {
    tags: ["tblWorkShop"],
  },
  scope: true,

  primaryKey: "workShopId",
  service: ServiceTblWorkShop,
  createSchema: TblWorkShopInputCreate,
  updateSchema: TblWorkShopInputUpdate,
  responseSchema: buildResponseSchema(TblWorkShopPlain, TblWorkShop),

  /* ⭐ Custom endpoint برای create با component */
  extend: (app: Elysia) => {
    app.post(
      "/",
      async ({ userId, body, headers, ...ctx }: any) => {
        const instId = Number(headers["x-inst-id"] || 0);

        const { compId, ...workShopData } = body as any;

        if (!instId) {
          throw new Error("Instance ID is required");
        }
        const workShopNo = await generateDocumentNumber({
          tx: prisma,
          model: "tblWorkShop",
          prefix: "ws",
        });

        const baseData = {
          title: workShopData.title,
          awardingDate: workShopData.awardingDate,
          createdDate: new Date(),
          discId: workShopData?.tblDiscipline?.connect?.discId,
          followDesc: workShopData.followDesc,
          personInChargeApproveId:
            workShopData
              ?.tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee
              ?.connect?.employeeId,
          personInChargeId:
            workShopData?.tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee
              ?.connect?.employeeId,
          repairDescription: workShopData.repairDescription,
          instId,
          workShopNo,
        };
        // ✅ اگر compId ارسال نشده باشد، workshop عادی بساز
        if (!compId) {
          return await ServiceTblWorkShop.create(baseData);
        }

        // ✅ اگر compId ارسال شد، component را lookup کن
        const component = await prisma.tblComponentUnit.findUnique({
          where: { compId },
          include: {
            tblFunctions: {
              orderBy: { orderNo: "asc" },
              take: 1,
            },
          },
        });

        if (!component) {
          throw new Error(`Component با ID ${compId} پیدا نشد`);
        }

        // ✅ ایجاد Workshop
        const workShop = await ServiceTblWorkShop.create(baseData);

        // ✅ ایجاد WorkShopComponent خودکار
        await prisma.tblWorkShopComponent.create({
          data: {
            workShopId: workShop.workShopId,
            compId: component.compId,
            locationId: component.locationId,
            functionId: component.tblFunctions?.[0]?.functionId || null, // 📌 اول function
            instId,
          },
        });

        return workShop;
      },
      {
        tags: ["tblWorkShop"],
        detail: {
          summary: "Create",
        },
        body: t.Composite([
          TblWorkShopInputCreate,
          t.Object({
            compId: t.Optional(t.Number()),
          }),
        ]),
        response: buildResponseSchema(TblWorkShopPlain, TblWorkShop),
      },
    );
  },
}).app;

export default ControllerTblWorkShop;
