import { DynamicResponse } from "./dynamicTypes";

export type TypeStatistics = DynamicResponse<"getStatistics">;
export type TypeMaintLogStocksBySpareUnitId =
  DynamicResponse<"getTblMaintLogStocksUniqueSpareUnit">;

export type MaintLogContex = DynamicResponse<"getTblMaintLogContext">;

export interface MaintLogContextParams {
  compId?: number;
  workOrderId?: number;
  maintLogId?: number;
}
