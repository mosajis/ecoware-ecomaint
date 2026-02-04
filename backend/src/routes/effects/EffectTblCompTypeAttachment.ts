import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeAttachment({
  compTypeAttachmentId,
  operation,
}: {
  compTypeAttachmentId: number;
  operation: OperationType;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeAttachment =================
    const cta = await tx.tblCompTypeAttachment.findUnique({
      where: { compTypeAttachmentId },
    });

    if (!cta) {
      throw new Error("CompTypeAttachment not found.");
    }

    const { compTypeId, attachmentId, orderNo, createdUserId } = cta;

    if (!compTypeId || !attachmentId) {
      throw new Error("Invalid CompTypeAttachment data.");
    }

    // ================= Fetch Component Units =================
    const compIds = await tx.tblComponentUnit
      .findMany({
        where: { compTypeId },
        select: { compId: true },
      })
      .then((rows) => rows.map((r) => r.compId));

    if (!compIds.length) {
      return { status: "OK", message: "No component units found." };
    }

    // ================= Shared payload =================
    const baseData = {
      attachmentId,
      orderNo,
      createdUserId,
    };

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblComponentUnitAttachment.findMany({
          where: {
            attachmentId,
            compId: { in: compIds },
          },
          select: { compId: true },
        });

        const existingSet = new Set(existing.map((e) => e.compId));

        const data = compIds
          .filter((compId) => !existingSet.has(compId))
          .map((compId) => ({
            compId,
            ...baseData,
          }));

        if (data.length) {
          await tx.tblComponentUnitAttachment.createMany({
            data,
          });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} ComponentUnitAttachment records.`,
        };
      }

      // ========= UPDATE =========
      case 1: {
        const result = await tx.tblComponentUnitAttachment.updateMany({
          where: {
            attachmentId,
            compId: { in: compIds },
          },
          data: {
            orderNo,
          },
        });

        return {
          status: "OK",
          message: `Updated ${result.count} ComponentUnitAttachment records.`,
        };
      }

      // ========= DELETE =========
      case 2: {
        const result = await tx.tblComponentUnitAttachment.deleteMany({
          where: {
            attachmentId,
            compId: { in: compIds },
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} ComponentUnitAttachment records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
