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
      const res = await api.post("/tblWorkOrder/generate/next", {
        data: { maintLogId, userId },
      });

      if (res.success) {
        toast.success(res.message || "Next WorkOrder generated!");
      } else {
        toast.error(res.message || "Failed to generate next WorkOrder");
      }

      return res;
    } catch (error: any) {
      console.error("Error generating next WorkOrder:", error);
      toast.error(error?.response?.message || "Server Error");
      throw error;
    }
  },
};

export interface MaintLogContext {
  isPlanned: boolean;
  isCounter: boolean;
  counterData: {
    lastDate: string;
    lastValue: number;
  };
  reportedCount: number;
  jobDescription: {
    title: string | null;
    content: string | null;
  };
  frequency: {
    value: number | null;
    period: {
      periodId: number;
      name: string | null;
    } | null;
  };
  maintLog: any;
}

export interface MaintLogContextParams {
  compId?: number;
  workOrderId?: number;
  maintLogId?: number;
}

export const getMaintLogContext = async (
  params: MaintLogContextParams,
): Promise<MaintLogContext> => {
  const queryParams: Record<string, any> = {};
  if (params.compId) queryParams.compId = params.compId;
  if (params.workOrderId) queryParams.workOrderId = params.workOrderId;
  if (params.maintLogId) queryParams.maintLogId = params.maintLogId;

  return api.get<MaintLogContext>("/tblMaintLog/context", {
    params: queryParams,
  });
};
