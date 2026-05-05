import type { PrismaClient } from "orm/generated/prisma/client";
import type { BaseControllerOptions } from "./utils/base.controller";

export const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const periodToDays = (periodId: number): number => {
  const map: Record<number, number> = {
    1: 1, // Day
    2: 7, // Week
    3: 30, // Month
    4: 365, // Year
  };
  return map[periodId] || 1;
};

export const diffHours = (d1: any, d2: any) => {
  const dm = new Date(d2).getTime() - new Date(d1).getTime();
  return dm / (1000 * 60 * 60);
};

type GenerateNumberOptions = {
  tx: PrismaClient | any;
  model: string;
  prefix: string;
  useYear?: boolean;
  padSize?: number;
  useRandomSuffix?: boolean;
};

export const generateDocumentNumber = async ({
  tx,
  model,
  prefix,
  useYear = true,
  padSize = 6,
  useRandomSuffix = true,
}: GenerateNumberOptions) => {
  const now = new Date();
  const year = now.getFullYear();

  const repo = (tx as any)[model];

  const where = useYear
    ? {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      }
    : undefined;

  const count = await repo.count({ where });

  const padded = String(count + 1).padStart(padSize, "0");

  const suffix = useRandomSuffix ? `-${Date.now().toString().slice(-3)}` : "";

  return useYear
    ? `${prefix}-${year}-${padded}${suffix}`
    : `${prefix}-${padded}${suffix}`;
};

export const removeNulls = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined),
  );
};
