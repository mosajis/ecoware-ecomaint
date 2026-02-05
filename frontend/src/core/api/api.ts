import { api } from "@/service/axios";
import { DynamicResponse } from "./dynamicTypes";

// ================= CompType Effects =================

export const logicTblCompTypeJob = {
  effect: (
    compTypeJobId: number,
    operation: 0 | 1 | 2,
    oldCompTypeId?: number,
  ) =>
    api.post(`/tblCompTypeJob/${compTypeJobId}/effect`, {
      data: {
        operation,
        oldCompTypeId,
      },
    }),
};

export const logicTblCompTypeCounter = {
  effect: (
    compTypeCounterId: number,
    operation: 0 | 1 | 2,
    oldCompTypeId?: number,
  ) =>
    api.post(`/tblCompTypeCounter/${compTypeCounterId}/effect`, {
      data: {
        operation,
        oldCompTypeId,
      },
    }),
};

export const logicTblCompTypeAttachment = {
  effect: (compTypeAttachmentId: number, operation: 0 | 1 | 2) =>
    api.post(`/tblCompTypeAttachment/${compTypeAttachmentId}/effect`, {
      data: {
        operation,
      },
    }),
};

export const logicTblCompTypeMeasurePoint = {
  effect: (compTypeMeasurePointId: number, operation: 0 | 1 | 2) =>
    api.post(`/tblCompTypeMeasurePoint/${compTypeMeasurePointId}/effect`, {
      data: {
        operation,
      },
    }),
};

export const logicTblCompTypeJobCounter = {
  effect: (compTypeJobCounterId: number, operation: 0 | 1 | 2) =>
    api.post(`/tblCompTypeJobCounter/${compTypeJobCounterId}/effect`, {
      data: {
        operation,
      },
    }),
};

export const logicTblCompTypeJobTrigger = {
  effect: (compTypeJobTriggerId: number, operation: 0 | 1 | 2) =>
    api.post(`/tblCompTypeJobTrigger/${compTypeJobTriggerId}/effect`, {
      data: {
        operation,
      },
    }),
};

export const logicTblCompTypeJobMeasurePoint = {
  effect: (compTypeJobMeasurePointId: number, operation: 0 | 1 | 2) =>
    api.post(
      `/tblCompTypeJobMeasurePoint/${compTypeJobMeasurePointId}/effect`,
      {
        data: {
          operation,
        },
      },
    ),
};

// ================= Other Logic =================

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

// ================= Statistics & Reports =================

export type TypeStatistics = DynamicResponse<"getStatistics">;

export const getStatistics = (): Promise<TypeStatistics> =>
  api.get(`/statistics/`);

export type TypeMaintLogStocksBySpareUnitId =
  DynamicResponse<"getTblMaintLogStocksUniqueSpareUnit">;

export const tblMaintLogStocksBySpareUnitId =
  (): Promise<TypeMaintLogStocksBySpareUnitId> =>
    api.get(`/tblMaintLogStocks/uniqueSpareUnit`);
