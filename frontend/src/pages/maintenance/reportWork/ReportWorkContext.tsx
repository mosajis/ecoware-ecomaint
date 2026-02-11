import { api } from "@/service/axios";

export interface MaintLogContext {
  isPlanned: boolean;
  isCounter: boolean;
  counterData: {
    lastDate: string | null;
    lastValue: number | null;
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

/**
 * دریافت context برای ساخت یا ویرایش maintenance log
 */
export const getMaintLogContext = async (
  params: MaintLogContextParams,
): Promise<MaintLogContext> => {
  // فقط پارامترهای موجود رو ارسال می‌کنیم
  const queryParams: Record<string, any> = {};
  if (params.compId) queryParams.compId = params.compId;
  if (params.workOrderId) queryParams.workOrderId = params.workOrderId;
  if (params.maintLogId) queryParams.maintLogId = params.maintLogId;

  return api.get<MaintLogContext>("/tblMaintLog/context", {
    params: queryParams,
  });
};
