import { DynamicCreate, DynamicResponse, DynamicUpdate } from "./dynamicTypes";
import type { operations } from "./generated/api.types";
import { api } from "@/service/axios";
import {
  MaintLogContex,
  MaintLogContextParams,
  TypeMaintLogSpareBySpareUnitId,
  TypeStatistics,
} from "./api.types";

export type TypeKPIMetric = {
  value: number;
  numerator: number;
  denominator: number;
  percentage: number;
};

export type TypeKPI = {
  pmp: TypeKPIMetric;
  pmc: TypeKPIMetric;
  backlogRatio: TypeKPIMetric;
  backlogRatioWithPend: TypeKPIMetric;
  timestamp: string;
  period: {
    startDate: string;
    endDate: string;
  };
};

export const generateWorkOrder = () => api.post(`/tblWorkOrder/generate`);

export const generateJobTrigger = (jobTriggerId: number) =>
  api.post(`/tblJobTrigger/${jobTriggerId}/generate`);

export const generateNextWorkOrder = async (maintLogId: number) =>
  api.post<DynamicResponse<"postTblWorkOrderGenerate">>(
    "/tblWorkOrder/generate/next",
    {
      data: { maintLogId },
    },
  );

export const tblMaintLogSpareBySpareUnitId = (
  compId?: number,
): Promise<TypeMaintLogSpareBySpareUnitId> => {
  const query = compId ? `?compId=${compId}` : "";
  return api.get(`/tblMaintLogSpare/uniqueSpareUnit${query}`);
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

export const getStatistics = (instId?: number): Promise<TypeStatistics> =>
  api.get(`/statistics`, {
    params: { instId },
  });

export const getStatisticsKpi = (instId?: number): Promise<TypeKPI> =>
  api.get(`/statistics/kpi`, {
    params: { instId },
  });

export const getCountersAlert = () => api.get(`/tblCompJobCounter/alert`);

export const createFailureReport = (
  data: DynamicCreate<"postTblFailureReportFull">,
) =>
  api.post<DynamicResponse<"postTblFailureReportFull">>(
    "/tblFailureReport/full",
    {
      data,
    },
  );

export const updateFailureReport = (
  id: number,
  data: DynamicUpdate<"putTblFailureReportByFailureReportIdFull">,
) =>
  api.put<DynamicResponse<"putTblFailureReportByFailureReportIdFull">>(
    `/tblFailureReport/${id}/full`,
    { data },
  );

export const workOrderReschedule = (
  data: DynamicCreate<"postTblWorkOrderReschedule">,
) =>
  api.post<DynamicResponse<"postTblWorkOrderReschedule">>(
    "/tblWorkOrder/reschedule",
    { data },
  );

export const workOrderIssue = (data: { workOrderIds: number[] }) =>
  api.post<DynamicResponse<"postTblWorkOrderIssue">>("/tblWorkOrder/issue", {
    data,
  });

export const workOrderCancel = (data: { workOrderIds: number[] }) =>
  api.post<DynamicResponse<"postTblWorkOrderCancel">>("/tblWorkOrder/cancel", {
    data,
  });

export const workOrderPostpone = (data: { workOrderIds: number[] }) =>
  api.post<DynamicResponse<"postTblWorkOrderPostpone">>(
    "/tblWorkOrder/postpone",
    { data },
  );

export type MaintLogBatchFollowStatusRequest = {
  maintLogIds: number[];
  followStatusId: number;
};

export type MaintLogBatchFollowStatusResponse = {
  count: number;
};
export const maintLogBatchFollowStatusUpdate = (
  data: MaintLogBatchFollowStatusRequest,
) =>
  api.patch<MaintLogBatchFollowStatusResponse>(
    "/tblMaintLog/follow-status/batch",
    { data },
  );

export type OilSamplingLogContextRequest = {
  maintLogId: number;
};

export type OilSamplingLogContextResponse = {
  maintLogId: number;
  component: {
    compId: number;
    compNo: string | null;
  } | null;

  compOilInfoId: number;

  defaults: {
    compCounterVal: number;
    oilCounterVal: number;

    tankCapacity: number | null;
    samplingPosition: string | null;
    laboratoryCode: string | null;
    oilDesc: string;

    orderNo: number | null;

    changeOilDate: string | null;
    addOilVal: number | null;

    lastSamplingDate: string | null;
    samplerId: number | null;
  };
};

export const getOilSamplingLogContext = (
  params: OilSamplingLogContextRequest,
) =>
  api.get<OilSamplingLogContextResponse>("/tblOilSamplingLog/context", {
    params,
  });

export type TypeWaitingDashboard = {
  summary: {
    totalHours: number;
    totalEvents: number;
    installationsWithWaiting: number;
    daysWithWaiting: number;
    averageDurationHours: number;
  };

  worstInstallation: {
    instId: number;
    name: string;
    hours: number;
    events: number;
  } | null;

  topReason: {
    waitingReasonId: number | null;
    reasonCode: string;
    reasonNameEn: string;
    reasonNameFa: string | null;
    hours: number;
    events: number;
  } | null;

  installations: {
    instId: number;
    name: string;
    caption: string | null;
    hours: number;
    events: number;
    daysWithWaiting: number;
    averageDurationHours: number;
  }[];

  reasonGroups: {
    waitingReasonGroupId: number | null;
    name: string;
    hours: number;
    events: number;
    shareOfHours: number;
  }[];

  rigReasonGroups: {
    instId: number;
    installationName: string;
    reasonGroup: string;
    hours: number;
  }[];

  monthly: {
    month: string;
    hours: number;
    events: number;
  }[];
};

export type TypeWaitingAnalysis = {
  summary: {
    totalEvents: number;
    totalHours: number;
    averageDurationHours: number;
    daysWithWaiting: number;
  };

  reasonGroups: {
    waitingReasonGroupId: number | null;
    name: string;
    events: number;
    hours: number;
    shareOfHours: number;
  }[];

  reasons: {
    waitingReasonId: number | null;
    reasonCode: string;
    reasonNameEn: string;
    reasonNameFa: string | null;
    reasonGroup: string | null;
    events: number;
    hours: number;
    shareOfHours: number;
  }[];

  nptClasses: {
    waitingNptClassId: number | null;
    name: string;
    events: number;
    hours: number;
  }[];

  operationPhases: {
    waitingOperationPhaseId: number | null;
    name: string;
    events: number;
    hours: number;
  }[];

  shifts: {
    waitingShiftId: number | null;
    name: string;
    events: number;
    hours: number;
  }[];

  topEvents: {
    waitingEventId: number;
    eventCode: string | null;
    startDateTime: string;
    endDateTime: string;
    durationHours: number;

    reason: {
      code: string;
      nameEn: string;
      nameFa: string | null;
    } | null;

    reasonGroup: string | null;
    operationPhase: string | null;
    nptClass: string | null;
  }[];
};

type WaitingQuery = {
  instId?: number;
  startDate?: string;
  endDate?: string;
};

export const getWaitingDashboard = (params?: WaitingQuery) =>
  api.get<TypeWaitingDashboard>("/waiting/dashboard", {
    params,
  });

export const getWaitingAnalysis = (params?: WaitingQuery) =>
  api.get<TypeWaitingAnalysis>("/waiting/analysis", {
    params,
  });
