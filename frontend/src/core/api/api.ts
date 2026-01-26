import { api } from "@/service/axios";
import { DynamicResponse } from "./dynamicTypes";

export const logicTblCompTypeJob = {
  effect: (compTypeJobId: number, operation: 0 | 1 | 2) =>
    api.post(`/tblCompTypeJob/${compTypeJobId}/effect`, {
      data: { compTypeJobId, operation },
    }),
};

export const logicTblWorkOrder = {
  effectGenerateWorkOrder: (userId: number) =>
    api.post(`/tblWorkOrder/generate`, {
      data: { userId },
    }),
};

export const logicTblComponentUnit = {
  effect: (componentUnitId: number, userId: number) =>
    api.post(`/tblComponentUnit/${componentUnitId}/effect`, {
      data: { componentUnitId, userId },
    }),
};

export type TypeStatistics = DynamicResponse<"getStatistics">;

export const getStatistics = (): Promise<TypeStatistics> =>
  api.get(`/statistics/`);

export type TypeMaintLogStocksBySpareUnitId =
  DynamicResponse<"getTblMaintLogStocksUniqueSpareUnit">;

export const tblMaintLogStocksBySpareUnitId =
  (): Promise<TypeMaintLogStocksBySpareUnitId> =>
    api.get(`/tblMaintLogStocks/uniqueSpareUnit`);
