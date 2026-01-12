import { api } from '@/service/axios'

export const logicTblCompTypeJob = {
  effect: (compTypeJobId: number, operation: 0 | 1 | 2) =>
    api.post<{ status: string; message: string }>(
      `/tblCompTypeJob/${compTypeJobId}/effect`,
      { data: { compTypeJobId, operation } }
    ),
}
