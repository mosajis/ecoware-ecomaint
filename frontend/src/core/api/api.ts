import { api } from "@/service/axios";
import {
  MaintLogContex,
  MaintLogContextParams,
  TypeMaintLogStocksBySpareUnitId,
  TypeStatistics,
} from "./api.types";

export const generateWorkOrder = (userId: number) =>
  api.post(`/tblWorkOrder/generate`, {
    data: { userId },
  });

export const generateJobTrigger = (userId: number, jobTriggerId: number) =>
  api.post(`/tblJobTrigger/${jobTriggerId}/generate`, {
    data: { userId },
  });

export const generateNextWorkORder = async (
  maintLogId: number,
  userId: number,
) =>
  api.post("/tblWorkOrder/generate/next", {
    data: { maintLogId, userId },
  });

export const tblMaintLogStocksBySpareUnitId = (
  compId?: number,
): Promise<TypeMaintLogStocksBySpareUnitId> => {
  const query = compId ? `?compId=${compId}` : "";
  return api.get(`/tblMaintLogStocks/uniqueSpareUnit${query}`);
};

export const getMaintLogContext = async (
  params: MaintLogContextParams,
): Promise<MaintLogContex> => {
  const queryParams: Record<string, any> = {};
  if (params.compId) queryParams.compId = params.compId;
  if (params.workOrderId) queryParams.workOrderId = params.workOrderId;
  if (params.maintLogId) queryParams.maintLogId = params.maintLogId;

  return api.get<MaintLogContex>("/tblMaintLog/context", {
    params: queryParams,
  });
};

export const getStatistics = (): Promise<TypeStatistics> =>
  api.get(`/statistics/`);

export const getCountersAlert = (): Promise<TypeStatistics> =>
  api.get(`/tblCompJobCounter/alert`);
