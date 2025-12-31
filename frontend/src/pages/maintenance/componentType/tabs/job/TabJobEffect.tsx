import { api } from "@/service/axios";

export const logicTblCompTypeJob = {
  /**
   * اعمال Effect روی یک CompTypeJob
   * @param compTypeJobId شناسه CompTypeJob
   * @param operation 0 = Insert, 1 = Update, 2 = Delete
   */
  effect: (compTypeJobId: number, operation: 0 | 1 | 2) =>
    api.post<{ status: string; message: string }>(
      `/tblCompTypeJob/${compTypeJobId}/effect`,
      { data: { compTypeJobId, operation } }
    ),
};
