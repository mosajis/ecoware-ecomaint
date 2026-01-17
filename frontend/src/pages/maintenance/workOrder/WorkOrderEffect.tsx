import { api } from '@/service/axios'

export const logicTblWorkOrder = {
  effectGenerateWorkOrder: (userId: number) =>
    api.post<{ status: string; message: string }>(`/tblWorkOrder/generate`, {
      data: { userId },
    }),
}
