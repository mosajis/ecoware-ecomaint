import { api } from "@/service/axios";
import { DynamicResponse } from "./dynamicTypes";
import { toast } from "sonner";

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

export const logicTblJobTrigger = {
  effectFireTrigger: (userId: number, jobTriggerId: number) =>
    api.post(`/tblJobTrigger/${jobTriggerId}/generate`, {
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

export const logicTblMaintLog = {
  /**
   * Generate next WorkOrder from MaintLog
   */
  generateNextWorkOrder: async (maintLogId: number, userId: number) => {
    try {
      const res = await api.post("/generate/next", {
        data: { maintLogId, userId },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Next WorkOrder generated!");
      } else {
        toast.error(res.data.message || "Failed to generate next WorkOrder");
      }

      return res.data;
    } catch (error: any) {
      console.error("Error generating next WorkOrder:", error);
      toast.error(error?.response?.data?.message || "Server Error");
      throw error;
    }
  },
};
