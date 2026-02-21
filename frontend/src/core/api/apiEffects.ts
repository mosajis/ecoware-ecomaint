import { api } from "@/service/axios";

export const effectTblComponentUnit = (
  componentUnitId: number,
  userId: number,
) =>
  api.post(`/tblComponentUnit/${componentUnitId}/effect`, {
    data: { componentUnitId, userId },
  });

export const effectTblCompTypeJob = (
  compTypeJobId: number,
  operation: 0 | 1 | 2,
  oldCompTypeId?: number,
) =>
  api.post(`/tblCompTypeJob/${compTypeJobId}/effect`, {
    data: {
      operation,
      oldCompTypeId,
    },
  });

export const effectTblCompTypeCounter = (
  compTypeCounterId: number,
  operation: 0 | 1 | 2,
  oldCompTypeId?: number,
) =>
  api.post(`/tblCompTypeCounter/${compTypeCounterId}/effect`, {
    data: {
      operation,
      oldCompTypeId,
    },
  });

export const effectTblCompTypeAttachment = (
  compTypeAttachmentId: number,
  operation: 0 | 1 | 2,
) =>
  api.post(`/tblCompTypeAttachment/${compTypeAttachmentId}/effect`, {
    data: {
      operation,
    },
  });

export const effectTblCompTypeMeasurePoint = (
  compTypeMeasurePointId: number,
  operation: 0 | 1 | 2,
) =>
  api.post(`/tblCompTypeMeasurePoint/${compTypeMeasurePointId}/effect`, {
    data: {
      operation,
    },
  });

export const effectTblCompTypeJobCounter = (
  compTypeJobCounterId: number,
  operation: 0 | 1 | 2,
) =>
  api.post(`/tblCompTypeJobCounter/${compTypeJobCounterId}/effect`, {
    data: {
      operation,
    },
  });

export const effectTblCompTypeJobTrigger = (
  compTypeJobTriggerId: number,
  operation: 0 | 1 | 2,
) =>
  api.post(`/tblCompTypeJobTrigger/${compTypeJobTriggerId}/effect`, {
    data: {
      operation,
    },
  });

export const effectTblCompTypeJobMeasurePoint = (
  compTypeJobMeasurePointId: number,
  operation: 0 | 1 | 2,
) =>
  api.post(`/tblCompTypeJobMeasurePoint/${compTypeJobMeasurePointId}/effect`, {
    data: {
      operation,
    },
  });
