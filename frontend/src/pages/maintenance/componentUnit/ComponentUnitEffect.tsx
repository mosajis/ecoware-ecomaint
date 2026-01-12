import { api } from '@/service/axios'

export const logicTblComponentUnit = {
  effect: (componentUnitId: number, userId: number) =>
    api.post<{ status: string; message: string }>(
      `/tblComponentUnit/${componentUnitId}/effect`,
      { data: { componentUnitId, userId } }
    ),
}
