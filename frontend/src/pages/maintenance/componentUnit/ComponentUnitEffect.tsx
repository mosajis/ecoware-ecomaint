import { api } from '@/service/axios'

export const logicTblComponentUnit = {
  effect: (componentUnitId: number, operation: 0 | 2) =>
    api.post<{ status: string; message: string }>(
      `/tblComponentUnit/${componentUnitId}/effect`,
      { data: { componentUnitId, operation } }
    ),
}
