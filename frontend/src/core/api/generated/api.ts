// ⚠️ Auto-generated file. Do not edit manually.
import { api } from "@/service/axios";
import type {
  DynamicResponse,
  DynamicQuery,
  DynamicCreate,
  DynamicUpdate,
} from "../dynamicTypes";

// 🔥 Utility برای stringify خودکار query
function stringifyQuery<Q extends Record<string, any>>(query?: Q) {
  if (!query) return query;
  const result: Record<string, any> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && typeof value === "object") {
      result[key] = JSON.stringify(value);
    } else {
      result[key] = value;
    }
  });
  return result as Q;
}

export type TypeTblAddress = DynamicResponse<"getTblAddress">["items"][0];
export const tblAddress = {
  getAll: (query?: DynamicQuery<"getTblAddress">) =>
    api.get<DynamicResponse<"getTblAddress">>("/tblAddress", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblAddressByAddressId">) =>
    api.get<DynamicResponse<"getTblAddressByAddressId">>(`/tblAddress/${id}`, {
      params: stringifyQuery(query),
    }),
  count: (query?: DynamicQuery<"getTblAddressCount">) =>
    api.get<DynamicResponse<"getTblAddressCount">>("/tblAddress/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblAddress">) =>
    api.post<DynamicResponse<"postTblAddress">>("/tblAddress", { data }),
  update: (id: number, data: DynamicUpdate<"putTblAddressByAddressId">) =>
    api.put<DynamicResponse<"putTblAddressByAddressId">>(`/tblAddress/${id}`, {
      data,
    }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblAddressByAddressId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblAddressByAddressId">>(
      `/tblAddress/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblAddress">) =>
    api.delete<DynamicResponse<"deleteTblAddress">>("/tblAddress", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblAttachment = DynamicResponse<"getTblAttachment">["items"][0];
export const tblAttachment = {
  getAll: (query?: DynamicQuery<"getTblAttachment">) =>
    api.get<DynamicResponse<"getTblAttachment">>("/tblAttachment", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblAttachmentByAttachmentId">,
  ) =>
    api.get<DynamicResponse<"getTblAttachmentByAttachmentId">>(
      `/tblAttachment/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblAttachmentCount">) =>
    api.get<DynamicResponse<"getTblAttachmentCount">>("/tblAttachment/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblAttachment">) =>
    api.post<DynamicResponse<"postTblAttachment">>("/tblAttachment", { data }),
  update: (id: number, data: DynamicUpdate<"putTblAttachmentByAttachmentId">) =>
    api.put<DynamicResponse<"putTblAttachmentByAttachmentId">>(
      `/tblAttachment/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblAttachmentByAttachmentId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblAttachmentByAttachmentId">>(
      `/tblAttachment/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblAttachment">) =>
    api.delete<DynamicResponse<"deleteTblAttachment">>("/tblAttachment", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblAttachmentType =
  DynamicResponse<"getTblAttachmentType">["items"][0];
export const tblAttachmentType = {
  getAll: (query?: DynamicQuery<"getTblAttachmentType">) =>
    api.get<DynamicResponse<"getTblAttachmentType">>("/tblAttachmentType", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblAttachmentTypeByAttachmentTypeId">,
  ) =>
    api.get<DynamicResponse<"getTblAttachmentTypeByAttachmentTypeId">>(
      `/tblAttachmentType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblAttachmentTypeCount">) =>
    api.get<DynamicResponse<"getTblAttachmentTypeCount">>(
      "/tblAttachmentType/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblAttachmentType">) =>
    api.post<DynamicResponse<"postTblAttachmentType">>("/tblAttachmentType", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblAttachmentTypeByAttachmentTypeId">,
  ) =>
    api.put<DynamicResponse<"putTblAttachmentTypeByAttachmentTypeId">>(
      `/tblAttachmentType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblAttachmentTypeByAttachmentTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblAttachmentTypeByAttachmentTypeId">>(
      `/tblAttachmentType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblAttachmentType">) =>
    api.delete<DynamicResponse<"deleteTblAttachmentType">>(
      "/tblAttachmentType",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompCounter =
  DynamicResponse<"getTblCompCounter">["items"][0];
export const tblCompCounter = {
  getAll: (query?: DynamicQuery<"getTblCompCounter">) =>
    api.get<DynamicResponse<"getTblCompCounter">>("/tblCompCounter", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompCounterByCompCounterId">,
  ) =>
    api.get<DynamicResponse<"getTblCompCounterByCompCounterId">>(
      `/tblCompCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompCounter">) =>
    api.get<DynamicResponse<"getTblCompCounter">>("/tblCompCounter/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblCompCounter">) =>
    api.post<DynamicResponse<"postTblCompCounter">>("/tblCompCounter", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompCounterByCompCounterId">,
  ) =>
    api.put<DynamicResponse<"putTblCompCounterByCompCounterId">>(
      `/tblCompCounter/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompCounterByCompCounterId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompCounterByCompCounterId">>(
      `/tblCompCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompCounter">>("/tblCompCounter", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompCounterLog =
  DynamicResponse<"getTblCompCounterLog">["items"][0];
export const tblCompCounterLog = {
  getAll: (query?: DynamicQuery<"getTblCompCounterLog">) =>
    api.get<DynamicResponse<"getTblCompCounterLog">>("/tblCompCounterLog", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompCounterLogByCompCounterLogId">,
  ) =>
    api.get<DynamicResponse<"getTblCompCounterLogByCompCounterLogId">>(
      `/tblCompCounterLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompCounterLog">) =>
    api.get<DynamicResponse<"getTblCompCounterLog">>(
      "/tblCompCounterLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompCounterLog">) =>
    api.post<DynamicResponse<"postTblCompCounterLog">>("/tblCompCounterLog", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompCounterLogByCompCounterLogId">,
  ) =>
    api.put<DynamicResponse<"putTblCompCounterLogByCompCounterLogId">>(
      `/tblCompCounterLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompCounterLogByCompCounterLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompCounterLogByCompCounterLogId">>(
      `/tblCompCounterLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompCounterLog">) =>
    api.delete<DynamicResponse<"deleteTblCompCounterLog">>(
      "/tblCompCounterLog",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompJob = DynamicResponse<"getTblCompJob">["items"][0];
export const tblCompJob = {
  getAll: (query?: DynamicQuery<"getTblCompJob">) =>
    api.get<DynamicResponse<"getTblCompJob">>("/tblCompJob", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompJobByCompJobId">) =>
    api.get<DynamicResponse<"getTblCompJobByCompJobId">>(`/tblCompJob/${id}`, {
      params: stringifyQuery(query),
    }),
  count: (query?: DynamicQuery<"getTblCompJobCount">) =>
    api.get<DynamicResponse<"getTblCompJobCount">>("/tblCompJob/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblCompJob">) =>
    api.post<DynamicResponse<"postTblCompJob">>("/tblCompJob", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompJobByCompJobId">) =>
    api.put<DynamicResponse<"putTblCompJobByCompJobId">>(`/tblCompJob/${id}`, {
      data,
    }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobByCompJobId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobByCompJobId">>(
      `/tblCompJob/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJob">) =>
    api.delete<DynamicResponse<"deleteTblCompJob">>("/tblCompJob", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompJobCounter =
  DynamicResponse<"getTblCompJobCounter">["items"][0];
export const tblCompJobCounter = {
  getAll: (query?: DynamicQuery<"getTblCompJobCounter">) =>
    api.get<DynamicResponse<"getTblCompJobCounter">>("/tblCompJobCounter", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompJobCounterByCompJobCounterId">,
  ) =>
    api.get<DynamicResponse<"getTblCompJobCounterByCompJobCounterId">>(
      `/tblCompJobCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompJobCounter">) =>
    api.get<DynamicResponse<"getTblCompJobCounter">>(
      "/tblCompJobCounter/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompJobCounter">) =>
    api.post<DynamicResponse<"postTblCompJobCounter">>("/tblCompJobCounter", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompJobCounterByCompJobCounterId">,
  ) =>
    api.put<DynamicResponse<"putTblCompJobCounterByCompJobCounterId">>(
      `/tblCompJobCounter/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobCounterByCompJobCounterId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobCounterByCompJobCounterId">>(
      `/tblCompJobCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompJobCounter">>(
      "/tblCompJobCounter",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompJobMeasurePoint =
  DynamicResponse<"getTblCompJobMeasurePoint">["items"][0];
export const tblCompJobMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompJobMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompJobMeasurePoint">>(
      "/tblCompJobMeasurePoint",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompJobMeasurePointByCompJobMeasurePointId">,
  ) =>
    api.get<
      DynamicResponse<"getTblCompJobMeasurePointByCompJobMeasurePointId">
    >(`/tblCompJobMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblCompJobMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompJobMeasurePointCount">>(
      "/tblCompJobMeasurePoint/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompJobMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompJobMeasurePoint">>(
      "/tblCompJobMeasurePoint",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompJobMeasurePointByCompJobMeasurePointId">,
  ) =>
    api.put<
      DynamicResponse<"putTblCompJobMeasurePointByCompJobMeasurePointId">
    >(`/tblCompJobMeasurePoint/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobMeasurePointByCompJobMeasurePointId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompJobMeasurePointByCompJobMeasurePointId">
    >(`/tblCompJobMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompJobMeasurePoint">>(
      "/tblCompJobMeasurePoint",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompJobTrigger =
  DynamicResponse<"getTblCompJobTrigger">["items"][0];
export const tblCompJobTrigger = {
  getAll: (query?: DynamicQuery<"getTblCompJobTrigger">) =>
    api.get<DynamicResponse<"getTblCompJobTrigger">>("/tblCompJobTrigger", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompJobTriggerByCompJobTriggerId">,
  ) =>
    api.get<DynamicResponse<"getTblCompJobTriggerByCompJobTriggerId">>(
      `/tblCompJobTrigger/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompJobTriggerCount">) =>
    api.get<DynamicResponse<"getTblCompJobTriggerCount">>(
      "/tblCompJobTrigger/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompJobTrigger">) =>
    api.post<DynamicResponse<"postTblCompJobTrigger">>("/tblCompJobTrigger", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompJobTriggerByCompJobTriggerId">,
  ) =>
    api.put<DynamicResponse<"putTblCompJobTriggerByCompJobTriggerId">>(
      `/tblCompJobTrigger/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobTriggerByCompJobTriggerId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobTriggerByCompJobTriggerId">>(
      `/tblCompJobTrigger/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobTrigger">) =>
    api.delete<DynamicResponse<"deleteTblCompJobTrigger">>(
      "/tblCompJobTrigger",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompMeasurePoint =
  DynamicResponse<"getTblCompMeasurePoint">["items"][0];
export const tblCompMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompMeasurePoint">>("/tblCompMeasurePoint", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompMeasurePointByCompMeasurePointId">,
  ) =>
    api.get<DynamicResponse<"getTblCompMeasurePointByCompMeasurePointId">>(
      `/tblCompMeasurePoint/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointCount">>(
      "/tblCompMeasurePoint/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompMeasurePoint">>(
      "/tblCompMeasurePoint",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompMeasurePointByCompMeasurePointId">,
  ) =>
    api.put<DynamicResponse<"putTblCompMeasurePointByCompMeasurePointId">>(
      `/tblCompMeasurePoint/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompMeasurePointByCompMeasurePointId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompMeasurePointByCompMeasurePointId">
    >(`/tblCompMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompMeasurePoint">>(
      "/tblCompMeasurePoint",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompMeasurePointLog =
  DynamicResponse<"getTblCompMeasurePointLog">["items"][0];
export const tblCompMeasurePointLog = {
  getAll: (query?: DynamicQuery<"getTblCompMeasurePointLog">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointLog">>(
      "/tblCompMeasurePointLog",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompMeasurePointLogByCompMeasurePointLogId">,
  ) =>
    api.get<
      DynamicResponse<"getTblCompMeasurePointLogByCompMeasurePointLogId">
    >(`/tblCompMeasurePointLog/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblCompMeasurePointLogCount">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointLogCount">>(
      "/tblCompMeasurePointLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompMeasurePointLog">) =>
    api.post<DynamicResponse<"postTblCompMeasurePointLog">>(
      "/tblCompMeasurePointLog",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompMeasurePointLogByCompMeasurePointLogId">,
  ) =>
    api.put<
      DynamicResponse<"putTblCompMeasurePointLogByCompMeasurePointLogId">
    >(`/tblCompMeasurePointLog/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompMeasurePointLogByCompMeasurePointLogId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompMeasurePointLogByCompMeasurePointLogId">
    >(`/tblCompMeasurePointLog/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompMeasurePointLog">) =>
    api.delete<DynamicResponse<"deleteTblCompMeasurePointLog">>(
      "/tblCompMeasurePointLog",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompOilInfo =
  DynamicResponse<"getTblCompOilInfo">["items"][0];
export const tblCompOilInfo = {
  getAll: (query?: DynamicQuery<"getTblCompOilInfo">) =>
    api.get<DynamicResponse<"getTblCompOilInfo">>("/tblCompOilInfo", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompOilInfoByCompOilInfoId">,
  ) =>
    api.get<DynamicResponse<"getTblCompOilInfoByCompOilInfoId">>(
      `/tblCompOilInfo/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompOilInfoCount">) =>
    api.get<DynamicResponse<"getTblCompOilInfoCount">>(
      "/tblCompOilInfo/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompOilInfo">) =>
    api.post<DynamicResponse<"postTblCompOilInfo">>("/tblCompOilInfo", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompOilInfoByCompOilInfoId">,
  ) =>
    api.put<DynamicResponse<"putTblCompOilInfoByCompOilInfoId">>(
      `/tblCompOilInfo/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompOilInfoByCompOilInfoId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompOilInfoByCompOilInfoId">>(
      `/tblCompOilInfo/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompOilInfo">) =>
    api.delete<DynamicResponse<"deleteTblCompOilInfo">>("/tblCompOilInfo", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompSpare = DynamicResponse<"getTblCompSpare">["items"][0];
export const tblCompSpare = {
  getAll: (query?: DynamicQuery<"getTblCompSpare">) =>
    api.get<DynamicResponse<"getTblCompSpare">>("/tblCompSpare", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompSpareByCompSpareId">) =>
    api.get<DynamicResponse<"getTblCompSpareByCompSpareId">>(
      `/tblCompSpare/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompSpareCount">) =>
    api.get<DynamicResponse<"getTblCompSpareCount">>("/tblCompSpare/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblCompSpare">) =>
    api.post<DynamicResponse<"postTblCompSpare">>("/tblCompSpare", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompSpareByCompSpareId">) =>
    api.put<DynamicResponse<"putTblCompSpareByCompSpareId">>(
      `/tblCompSpare/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompSpareByCompSpareId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompSpareByCompSpareId">>(
      `/tblCompSpare/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompSpare">) =>
    api.delete<DynamicResponse<"deleteTblCompSpare">>("/tblCompSpare", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompStatus = DynamicResponse<"getTblCompStatus">["items"][0];
export const tblCompStatus = {
  getAll: (query?: DynamicQuery<"getTblCompStatus">) =>
    api.get<DynamicResponse<"getTblCompStatus">>("/tblCompStatus", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompStatusByCompStatusId">,
  ) =>
    api.get<DynamicResponse<"getTblCompStatusByCompStatusId">>(
      `/tblCompStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompStatusCount">) =>
    api.get<DynamicResponse<"getTblCompStatusCount">>("/tblCompStatus/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblCompStatus">) =>
    api.post<DynamicResponse<"postTblCompStatus">>("/tblCompStatus", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompStatusByCompStatusId">) =>
    api.put<DynamicResponse<"putTblCompStatusByCompStatusId">>(
      `/tblCompStatus/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompStatusByCompStatusId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompStatusByCompStatusId">>(
      `/tblCompStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompStatus">) =>
    api.delete<DynamicResponse<"deleteTblCompStatus">>("/tblCompStatus", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompStatusLog =
  DynamicResponse<"getTblCompStatusLog">["items"][0];
export const tblCompStatusLog = {
  getAll: (query?: DynamicQuery<"getTblCompStatusLog">) =>
    api.get<DynamicResponse<"getTblCompStatusLog">>("/tblCompStatusLog", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompStatusLogByCompStatusLogId">,
  ) =>
    api.get<DynamicResponse<"getTblCompStatusLogByCompStatusLogId">>(
      `/tblCompStatusLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompStatusLogCount">) =>
    api.get<DynamicResponse<"getTblCompStatusLogCount">>(
      "/tblCompStatusLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompStatusLog">) =>
    api.post<DynamicResponse<"postTblCompStatusLog">>("/tblCompStatusLog", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompStatusLogByCompStatusLogId">,
  ) =>
    api.put<DynamicResponse<"putTblCompStatusLogByCompStatusLogId">>(
      `/tblCompStatusLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompStatusLogByCompStatusLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompStatusLogByCompStatusLogId">>(
      `/tblCompStatusLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompStatusLog">) =>
    api.delete<DynamicResponse<"deleteTblCompStatusLog">>("/tblCompStatusLog", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompType = DynamicResponse<"getTblCompType">["items"][0];
export const tblCompType = {
  getAll: (query?: DynamicQuery<"getTblCompType">) =>
    api.get<DynamicResponse<"getTblCompType">>("/tblCompType", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeByCompTypeId">) =>
    api.get<DynamicResponse<"getTblCompTypeByCompTypeId">>(
      `/tblCompType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompTypeCount">) =>
    api.get<DynamicResponse<"getTblCompTypeCount">>("/tblCompType/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblCompType">) =>
    api.post<DynamicResponse<"postTblCompType">>("/tblCompType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeByCompTypeId">) =>
    api.put<DynamicResponse<"putTblCompTypeByCompTypeId">>(
      `/tblCompType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeByCompTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeByCompTypeId">>(
      `/tblCompType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompType">) =>
    api.delete<DynamicResponse<"deleteTblCompType">>("/tblCompType", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblCompTypeAttachment =
  DynamicResponse<"getTblCompTypeAttachment">["items"][0];
export const tblCompTypeAttachment = {
  getAll: (query?: DynamicQuery<"getTblCompTypeAttachment">) =>
    api.get<DynamicResponse<"getTblCompTypeAttachment">>(
      "/tblCompTypeAttachment",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeAttachmentByCompTypeAttachmentId">,
  ) =>
    api.get<DynamicResponse<"getTblCompTypeAttachmentByCompTypeAttachmentId">>(
      `/tblCompTypeAttachment/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompTypeAttachmentCount">) =>
    api.get<DynamicResponse<"getTblCompTypeAttachmentCount">>(
      "/tblCompTypeAttachment/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeAttachment">) =>
    api.post<DynamicResponse<"postTblCompTypeAttachment">>(
      "/tblCompTypeAttachment",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeAttachmentByCompTypeAttachmentId">,
  ) =>
    api.put<DynamicResponse<"putTblCompTypeAttachmentByCompTypeAttachmentId">>(
      `/tblCompTypeAttachment/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeAttachmentByCompTypeAttachmentId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompTypeAttachmentByCompTypeAttachmentId">
    >(`/tblCompTypeAttachment/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeAttachment">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeAttachment">>(
      "/tblCompTypeAttachment",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompTypeCounter =
  DynamicResponse<"getTblCompTypeCounter">["items"][0];
export const tblCompTypeCounter = {
  getAll: (query?: DynamicQuery<"getTblCompTypeCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeCounter">>("/tblCompTypeCounter", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeCounterByCompTypeCounterId">,
  ) =>
    api.get<DynamicResponse<"getTblCompTypeCounterByCompTypeCounterId">>(
      `/tblCompTypeCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompTypeCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeCounter">>(
      "/tblCompTypeCounter/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeCounter">) =>
    api.post<DynamicResponse<"postTblCompTypeCounter">>("/tblCompTypeCounter", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeCounterByCompTypeCounterId">,
  ) =>
    api.put<DynamicResponse<"putTblCompTypeCounterByCompTypeCounterId">>(
      `/tblCompTypeCounter/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeCounterByCompTypeCounterId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeCounterByCompTypeCounterId">>(
      `/tblCompTypeCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeCounter">>(
      "/tblCompTypeCounter",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompTypeJob =
  DynamicResponse<"getTblCompTypeJob">["items"][0];
export const tblCompTypeJob = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJob">) =>
    api.get<DynamicResponse<"getTblCompTypeJob">>("/tblCompTypeJob", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeJobByCompTypeJobId">,
  ) =>
    api.get<DynamicResponse<"getTblCompTypeJobByCompTypeJobId">>(
      `/tblCompTypeJob/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompTypeJobCount">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCount">>(
      "/tblCompTypeJob/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeJob">) =>
    api.post<DynamicResponse<"postTblCompTypeJob">>("/tblCompTypeJob", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeJobByCompTypeJobId">,
  ) =>
    api.put<DynamicResponse<"putTblCompTypeJobByCompTypeJobId">>(
      `/tblCompTypeJob/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobByCompTypeJobId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobByCompTypeJobId">>(
      `/tblCompTypeJob/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJob">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJob">>("/tblCompTypeJob", {
      params: stringifyQuery(query),
    }),
};

export const tblCompTypeJobByCompTypeJobIdEffect = {
  create: (data: DynamicCreate<"postTblCompTypeJobByCompTypeJobIdEffect">) =>
    api.post<DynamicResponse<"postTblCompTypeJobByCompTypeJobIdEffect">>(
      "/tblCompTypeJobByCompTypeJobIdEffect",
      { data },
    ),
};

export type TypeTblCompTypeJobCounter =
  DynamicResponse<"getTblCompTypeJobCounter">["items"][0];
export const tblCompTypeJobCounter = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJobCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeJobCounterByCompTypeJobCounterId">,
  ) =>
    api.get<DynamicResponse<"getTblCompTypeJobCounterByCompTypeJobCounterId">>(
      `/tblCompTypeJobCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompTypeJobCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeJobCounter">) =>
    api.post<DynamicResponse<"postTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeJobCounterByCompTypeJobCounterId">,
  ) =>
    api.put<DynamicResponse<"putTblCompTypeJobCounterByCompTypeJobCounterId">>(
      `/tblCompTypeJobCounter/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobCounterByCompTypeJobCounterId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompTypeJobCounterByCompTypeJobCounterId">
    >(`/tblCompTypeJobCounter/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJobCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompTypeJobMeasurePoint =
  DynamicResponse<"getTblCompTypeJobMeasurePoint">["items"][0];
export const tblCompTypeJobMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJobMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompTypeJobMeasurePoint">>(
      "/tblCompTypeJobMeasurePoint",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeJobMeasurePointByCompTypeJobMeasurePointId">,
  ) =>
    api.get<
      DynamicResponse<"getTblCompTypeJobMeasurePointByCompTypeJobMeasurePointId">
    >(`/tblCompTypeJobMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblCompTypeJobMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompTypeJobMeasurePointCount">>(
      "/tblCompTypeJobMeasurePoint/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeJobMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompTypeJobMeasurePoint">>(
      "/tblCompTypeJobMeasurePoint",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeJobMeasurePointByCompTypeJobMeasurePointId">,
  ) =>
    api.put<
      DynamicResponse<"putTblCompTypeJobMeasurePointByCompTypeJobMeasurePointId">
    >(`/tblCompTypeJobMeasurePoint/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobMeasurePointByCompTypeJobMeasurePointId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompTypeJobMeasurePointByCompTypeJobMeasurePointId">
    >(`/tblCompTypeJobMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJobMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobMeasurePoint">>(
      "/tblCompTypeJobMeasurePoint",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompTypeJobTrigger =
  DynamicResponse<"getTblCompTypeJobTrigger">["items"][0];
export const tblCompTypeJobTrigger = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJobTrigger">) =>
    api.get<DynamicResponse<"getTblCompTypeJobTrigger">>(
      "/tblCompTypeJobTrigger",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeJobTriggerByCompTypeJobTriggerId">,
  ) =>
    api.get<DynamicResponse<"getTblCompTypeJobTriggerByCompTypeJobTriggerId">>(
      `/tblCompTypeJobTrigger/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCompTypeJobTriggerCount">) =>
    api.get<DynamicResponse<"getTblCompTypeJobTriggerCount">>(
      "/tblCompTypeJobTrigger/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeJobTrigger">) =>
    api.post<DynamicResponse<"postTblCompTypeJobTrigger">>(
      "/tblCompTypeJobTrigger",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeJobTriggerByCompTypeJobTriggerId">,
  ) =>
    api.put<DynamicResponse<"putTblCompTypeJobTriggerByCompTypeJobTriggerId">>(
      `/tblCompTypeJobTrigger/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobTriggerByCompTypeJobTriggerId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompTypeJobTriggerByCompTypeJobTriggerId">
    >(`/tblCompTypeJobTrigger/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJobTrigger">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobTrigger">>(
      "/tblCompTypeJobTrigger",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCompTypeMeasurePoint =
  DynamicResponse<"getTblCompTypeMeasurePoint">["items"][0];
export const tblCompTypeMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompTypeMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompTypeMeasurePoint">>(
      "/tblCompTypeMeasurePoint",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeMeasurePointByCompTypeMeasurePointId">,
  ) =>
    api.get<
      DynamicResponse<"getTblCompTypeMeasurePointByCompTypeMeasurePointId">
    >(`/tblCompTypeMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblCompTypeMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompTypeMeasurePointCount">>(
      "/tblCompTypeMeasurePoint/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblCompTypeMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompTypeMeasurePoint">>(
      "/tblCompTypeMeasurePoint",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeMeasurePointByCompTypeMeasurePointId">,
  ) =>
    api.put<
      DynamicResponse<"putTblCompTypeMeasurePointByCompTypeMeasurePointId">
    >(`/tblCompTypeMeasurePoint/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeMeasurePointByCompTypeMeasurePointId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblCompTypeMeasurePointByCompTypeMeasurePointId">
    >(`/tblCompTypeMeasurePoint/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeMeasurePoint">>(
      "/tblCompTypeMeasurePoint",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblComponentUnit =
  DynamicResponse<"getTblComponentUnit">["items"][0];
export const tblComponentUnit = {
  getAll: (query?: DynamicQuery<"getTblComponentUnit">) =>
    api.get<DynamicResponse<"getTblComponentUnit">>("/tblComponentUnit", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblComponentUnitByCompId">) =>
    api.get<DynamicResponse<"getTblComponentUnitByCompId">>(
      `/tblComponentUnit/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblComponentUnitCount">) =>
    api.get<DynamicResponse<"getTblComponentUnitCount">>(
      "/tblComponentUnit/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblComponentUnit">) =>
    api.post<DynamicResponse<"postTblComponentUnit">>("/tblComponentUnit", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblComponentUnitByCompId">) =>
    api.put<DynamicResponse<"putTblComponentUnitByCompId">>(
      `/tblComponentUnit/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblComponentUnitByCompId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblComponentUnitByCompId">>(
      `/tblComponentUnit/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblComponentUnit">) =>
    api.delete<DynamicResponse<"deleteTblComponentUnit">>("/tblComponentUnit", {
      params: stringifyQuery(query),
    }),
};

export const tblComponentUnitByComponentUnitIdEffect = {
  create: (
    data: DynamicCreate<"postTblComponentUnitByComponentUnitIdEffect">,
  ) =>
    api.post<DynamicResponse<"postTblComponentUnitByComponentUnitIdEffect">>(
      "/tblComponentUnitByComponentUnitIdEffect",
      { data },
    ),
};

export type TypeTblComponentUnitAttachment =
  DynamicResponse<"getTblComponentUnitAttachment">["items"][0];
export const tblComponentUnitAttachment = {
  getAll: (query?: DynamicQuery<"getTblComponentUnitAttachment">) =>
    api.get<DynamicResponse<"getTblComponentUnitAttachment">>(
      "/tblComponentUnitAttachment",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblComponentUnitAttachmentByComponentUnitAttachmentId">,
  ) =>
    api.get<
      DynamicResponse<"getTblComponentUnitAttachmentByComponentUnitAttachmentId">
    >(`/tblComponentUnitAttachment/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblComponentUnitAttachmentCount">) =>
    api.get<DynamicResponse<"getTblComponentUnitAttachmentCount">>(
      "/tblComponentUnitAttachment/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblComponentUnitAttachment">) =>
    api.post<DynamicResponse<"postTblComponentUnitAttachment">>(
      "/tblComponentUnitAttachment",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblComponentUnitAttachmentByComponentUnitAttachmentId">,
  ) =>
    api.put<
      DynamicResponse<"putTblComponentUnitAttachmentByComponentUnitAttachmentId">
    >(`/tblComponentUnitAttachment/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblComponentUnitAttachmentByComponentUnitAttachmentId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblComponentUnitAttachmentByComponentUnitAttachmentId">
    >(`/tblComponentUnitAttachment/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblComponentUnitAttachment">) =>
    api.delete<DynamicResponse<"deleteTblComponentUnitAttachment">>(
      "/tblComponentUnitAttachment",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblCounterType =
  DynamicResponse<"getTblCounterType">["items"][0];
export const tblCounterType = {
  getAll: (query?: DynamicQuery<"getTblCounterType">) =>
    api.get<DynamicResponse<"getTblCounterType">>("/tblCounterType", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCounterTypeByCounterTypeId">,
  ) =>
    api.get<DynamicResponse<"getTblCounterTypeByCounterTypeId">>(
      `/tblCounterType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblCounterType">) =>
    api.get<DynamicResponse<"getTblCounterType">>("/tblCounterType/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblCounterType">) =>
    api.post<DynamicResponse<"postTblCounterType">>("/tblCounterType", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCounterTypeByCounterTypeId">,
  ) =>
    api.put<DynamicResponse<"putTblCounterTypeByCounterTypeId">>(
      `/tblCounterType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCounterTypeByCounterTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblCounterTypeByCounterTypeId">>(
      `/tblCounterType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCounterType">) =>
    api.delete<DynamicResponse<"deleteTblCounterType">>("/tblCounterType", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblDepartment = DynamicResponse<"getTblDepartment">["items"][0];
export const tblDepartment = {
  getAll: (query?: DynamicQuery<"getTblDepartment">) =>
    api.get<DynamicResponse<"getTblDepartment">>("/tblDepartment", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDepartmentByDeptId">) =>
    api.get<DynamicResponse<"getTblDepartmentByDeptId">>(
      `/tblDepartment/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblDepartmentCount">) =>
    api.get<DynamicResponse<"getTblDepartmentCount">>("/tblDepartment/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblDepartment">) =>
    api.post<DynamicResponse<"postTblDepartment">>("/tblDepartment", { data }),
  update: (id: number, data: DynamicUpdate<"putTblDepartmentByDeptId">) =>
    api.put<DynamicResponse<"putTblDepartmentByDeptId">>(
      `/tblDepartment/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDepartmentByDeptId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblDepartmentByDeptId">>(
      `/tblDepartment/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDepartment">) =>
    api.delete<DynamicResponse<"deleteTblDepartment">>("/tblDepartment", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblDiscipline = DynamicResponse<"getTblDiscipline">["items"][0];
export const tblDiscipline = {
  getAll: (query?: DynamicQuery<"getTblDiscipline">) =>
    api.get<DynamicResponse<"getTblDiscipline">>("/tblDiscipline", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDisciplineByDiscId">) =>
    api.get<DynamicResponse<"getTblDisciplineByDiscId">>(
      `/tblDiscipline/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblDisciplineCount">) =>
    api.get<DynamicResponse<"getTblDisciplineCount">>("/tblDiscipline/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblDiscipline">) =>
    api.post<DynamicResponse<"postTblDiscipline">>("/tblDiscipline", { data }),
  update: (id: number, data: DynamicUpdate<"putTblDisciplineByDiscId">) =>
    api.put<DynamicResponse<"putTblDisciplineByDiscId">>(
      `/tblDiscipline/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDisciplineByDiscId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblDisciplineByDiscId">>(
      `/tblDiscipline/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDiscipline">) =>
    api.delete<DynamicResponse<"deleteTblDiscipline">>("/tblDiscipline", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblEmployee = DynamicResponse<"getTblEmployee">["items"][0];
export const tblEmployee = {
  getAll: (query?: DynamicQuery<"getTblEmployee">) =>
    api.get<DynamicResponse<"getTblEmployee">>("/tblEmployee", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblEmployeeByEmployeeId">) =>
    api.get<DynamicResponse<"getTblEmployeeByEmployeeId">>(
      `/tblEmployee/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblEmployeeCount">) =>
    api.get<DynamicResponse<"getTblEmployeeCount">>("/tblEmployee/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblEmployee">) =>
    api.post<DynamicResponse<"postTblEmployee">>("/tblEmployee", { data }),
  update: (id: number, data: DynamicUpdate<"putTblEmployeeByEmployeeId">) =>
    api.put<DynamicResponse<"putTblEmployeeByEmployeeId">>(
      `/tblEmployee/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblEmployeeByEmployeeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblEmployeeByEmployeeId">>(
      `/tblEmployee/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblEmployee">) =>
    api.delete<DynamicResponse<"deleteTblEmployee">>("/tblEmployee", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblFailureGroupFollow =
  DynamicResponse<"getTblFailureGroupFollow">["items"][0];
export const tblFailureGroupFollow = {
  getAll: (query?: DynamicQuery<"getTblFailureGroupFollow">) =>
    api.get<DynamicResponse<"getTblFailureGroupFollow">>(
      "/tblFailureGroupFollow",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblFailureGroupFollowByFailureGroupFollowId">,
  ) =>
    api.get<DynamicResponse<"getTblFailureGroupFollowByFailureGroupFollowId">>(
      `/tblFailureGroupFollow/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblFailureGroupFollowCount">) =>
    api.get<DynamicResponse<"getTblFailureGroupFollowCount">>(
      "/tblFailureGroupFollow/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblFailureGroupFollow">) =>
    api.post<DynamicResponse<"postTblFailureGroupFollow">>(
      "/tblFailureGroupFollow",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblFailureGroupFollowByFailureGroupFollowId">,
  ) =>
    api.put<DynamicResponse<"putTblFailureGroupFollowByFailureGroupFollowId">>(
      `/tblFailureGroupFollow/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFailureGroupFollowByFailureGroupFollowId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblFailureGroupFollowByFailureGroupFollowId">
    >(`/tblFailureGroupFollow/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblFailureGroupFollow">) =>
    api.delete<DynamicResponse<"deleteTblFailureGroupFollow">>(
      "/tblFailureGroupFollow",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblFailureReportAttachment =
  DynamicResponse<"getTblFailureReportAttachment">["items"][0];
export const tblFailureReportAttachment = {
  getAll: (query?: DynamicQuery<"getTblFailureReportAttachment">) =>
    api.get<DynamicResponse<"getTblFailureReportAttachment">>(
      "/tblFailureReportAttachment",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblFailureReportAttachmentByFailureReportAttachmentId">,
  ) =>
    api.get<
      DynamicResponse<"getTblFailureReportAttachmentByFailureReportAttachmentId">
    >(`/tblFailureReportAttachment/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblFailureReportAttachmentCount">) =>
    api.get<DynamicResponse<"getTblFailureReportAttachmentCount">>(
      "/tblFailureReportAttachment/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblFailureReportAttachment">) =>
    api.post<DynamicResponse<"postTblFailureReportAttachment">>(
      "/tblFailureReportAttachment",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblFailureReportAttachmentByFailureReportAttachmentId">,
  ) =>
    api.put<
      DynamicResponse<"putTblFailureReportAttachmentByFailureReportAttachmentId">
    >(`/tblFailureReportAttachment/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFailureReportAttachmentByFailureReportAttachmentId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblFailureReportAttachmentByFailureReportAttachmentId">
    >(`/tblFailureReportAttachment/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblFailureReportAttachment">) =>
    api.delete<DynamicResponse<"deleteTblFailureReportAttachment">>(
      "/tblFailureReportAttachment",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblFailureReports =
  DynamicResponse<"getTblFailureReports">["items"][0];
export const tblFailureReports = {
  getAll: (query?: DynamicQuery<"getTblFailureReports">) =>
    api.get<DynamicResponse<"getTblFailureReports">>("/tblFailureReports", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblFailureReportsByFailureReportId">,
  ) =>
    api.get<DynamicResponse<"getTblFailureReportsByFailureReportId">>(
      `/tblFailureReports/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblFailureReportsCount">) =>
    api.get<DynamicResponse<"getTblFailureReportsCount">>(
      "/tblFailureReports/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblFailureReports">) =>
    api.post<DynamicResponse<"postTblFailureReports">>("/tblFailureReports", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblFailureReportsByFailureReportId">,
  ) =>
    api.put<DynamicResponse<"putTblFailureReportsByFailureReportId">>(
      `/tblFailureReports/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFailureReportsByFailureReportId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblFailureReportsByFailureReportId">>(
      `/tblFailureReports/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFailureReports">) =>
    api.delete<DynamicResponse<"deleteTblFailureReports">>(
      "/tblFailureReports",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblFailureSeverityLevel =
  DynamicResponse<"getTblFailureSeverityLevel">["items"][0];
export const tblFailureSeverityLevel = {
  getAll: (query?: DynamicQuery<"getTblFailureSeverityLevel">) =>
    api.get<DynamicResponse<"getTblFailureSeverityLevel">>(
      "/tblFailureSeverityLevel",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblFailureSeverityLevelByFailureSeverityLevelId">,
  ) =>
    api.get<
      DynamicResponse<"getTblFailureSeverityLevelByFailureSeverityLevelId">
    >(`/tblFailureSeverityLevel/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblFailureSeverityLevelCount">) =>
    api.get<DynamicResponse<"getTblFailureSeverityLevelCount">>(
      "/tblFailureSeverityLevel/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblFailureSeverityLevel">) =>
    api.post<DynamicResponse<"postTblFailureSeverityLevel">>(
      "/tblFailureSeverityLevel",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblFailureSeverityLevelByFailureSeverityLevelId">,
  ) =>
    api.put<
      DynamicResponse<"putTblFailureSeverityLevelByFailureSeverityLevelId">
    >(`/tblFailureSeverityLevel/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFailureSeverityLevelByFailureSeverityLevelId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblFailureSeverityLevelByFailureSeverityLevelId">
    >(`/tblFailureSeverityLevel/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblFailureSeverityLevel">) =>
    api.delete<DynamicResponse<"deleteTblFailureSeverityLevel">>(
      "/tblFailureSeverityLevel",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblFailureStatus =
  DynamicResponse<"getTblFailureStatus">["items"][0];
export const tblFailureStatus = {
  getAll: (query?: DynamicQuery<"getTblFailureStatus">) =>
    api.get<DynamicResponse<"getTblFailureStatus">>("/tblFailureStatus", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblFailureStatusByFailureStatusId">,
  ) =>
    api.get<DynamicResponse<"getTblFailureStatusByFailureStatusId">>(
      `/tblFailureStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblFailureStatusCount">) =>
    api.get<DynamicResponse<"getTblFailureStatusCount">>(
      "/tblFailureStatus/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblFailureStatus">) =>
    api.post<DynamicResponse<"postTblFailureStatus">>("/tblFailureStatus", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblFailureStatusByFailureStatusId">,
  ) =>
    api.put<DynamicResponse<"putTblFailureStatusByFailureStatusId">>(
      `/tblFailureStatus/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFailureStatusByFailureStatusId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblFailureStatusByFailureStatusId">>(
      `/tblFailureStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFailureStatus">) =>
    api.delete<DynamicResponse<"deleteTblFailureStatus">>("/tblFailureStatus", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblFollowStatus =
  DynamicResponse<"getTblFollowStatus">["items"][0];
export const tblFollowStatus = {
  getAll: (query?: DynamicQuery<"getTblFollowStatus">) =>
    api.get<DynamicResponse<"getTblFollowStatus">>("/tblFollowStatus", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblFollowStatusByFollowStatusId">,
  ) =>
    api.get<DynamicResponse<"getTblFollowStatusByFollowStatusId">>(
      `/tblFollowStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblFollowStatusCount">) =>
    api.get<DynamicResponse<"getTblFollowStatusCount">>(
      "/tblFollowStatus/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblFollowStatus">) =>
    api.post<DynamicResponse<"postTblFollowStatus">>("/tblFollowStatus", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblFollowStatusByFollowStatusId">,
  ) =>
    api.put<DynamicResponse<"putTblFollowStatusByFollowStatusId">>(
      `/tblFollowStatus/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFollowStatusByFollowStatusId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblFollowStatusByFollowStatusId">>(
      `/tblFollowStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFollowStatus">) =>
    api.delete<DynamicResponse<"deleteTblFollowStatus">>("/tblFollowStatus", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblFunctions = DynamicResponse<"getTblFunctions">["items"][0];
export const tblFunctions = {
  getAll: (query?: DynamicQuery<"getTblFunctions">) =>
    api.get<DynamicResponse<"getTblFunctions">>("/tblFunctions", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblFunctionsByFunctionId">) =>
    api.get<DynamicResponse<"getTblFunctionsByFunctionId">>(
      `/tblFunctions/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblFunctionsCount">) =>
    api.get<DynamicResponse<"getTblFunctionsCount">>("/tblFunctions/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblFunctions">) =>
    api.post<DynamicResponse<"postTblFunctions">>("/tblFunctions", { data }),
  update: (id: number, data: DynamicUpdate<"putTblFunctionsByFunctionId">) =>
    api.put<DynamicResponse<"putTblFunctionsByFunctionId">>(
      `/tblFunctions/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFunctionsByFunctionId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblFunctionsByFunctionId">>(
      `/tblFunctions/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFunctions">) =>
    api.delete<DynamicResponse<"deleteTblFunctions">>("/tblFunctions", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblJobClass = DynamicResponse<"getTblJobClass">["items"][0];
export const tblJobClass = {
  getAll: (query?: DynamicQuery<"getTblJobClass">) =>
    api.get<DynamicResponse<"getTblJobClass">>("/tblJobClass", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobClassByJobClassId">) =>
    api.get<DynamicResponse<"getTblJobClassByJobClassId">>(
      `/tblJobClass/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblJobClassCount">) =>
    api.get<DynamicResponse<"getTblJobClassCount">>("/tblJobClass/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblJobClass">) =>
    api.post<DynamicResponse<"postTblJobClass">>("/tblJobClass", { data }),
  update: (id: number, data: DynamicUpdate<"putTblJobClassByJobClassId">) =>
    api.put<DynamicResponse<"putTblJobClassByJobClassId">>(
      `/tblJobClass/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobClassByJobClassId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblJobClassByJobClassId">>(
      `/tblJobClass/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobClass">) =>
    api.delete<DynamicResponse<"deleteTblJobClass">>("/tblJobClass", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblJobDescription =
  DynamicResponse<"getTblJobDescription">["items"][0];
export const tblJobDescription = {
  getAll: (query?: DynamicQuery<"getTblJobDescription">) =>
    api.get<DynamicResponse<"getTblJobDescription">>("/tblJobDescription", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblJobDescriptionByJobDescId">,
  ) =>
    api.get<DynamicResponse<"getTblJobDescriptionByJobDescId">>(
      `/tblJobDescription/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblJobDescriptionCount">) =>
    api.get<DynamicResponse<"getTblJobDescriptionCount">>(
      "/tblJobDescription/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblJobDescription">) =>
    api.post<DynamicResponse<"postTblJobDescription">>("/tblJobDescription", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblJobDescriptionByJobDescId">,
  ) =>
    api.put<DynamicResponse<"putTblJobDescriptionByJobDescId">>(
      `/tblJobDescription/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobDescriptionByJobDescId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblJobDescriptionByJobDescId">>(
      `/tblJobDescription/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobDescription">) =>
    api.delete<DynamicResponse<"deleteTblJobDescription">>(
      "/tblJobDescription",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblJobDescriptionAttachment =
  DynamicResponse<"getTblJobDescriptionAttachment">["items"][0];
export const tblJobDescriptionAttachment = {
  getAll: (query?: DynamicQuery<"getTblJobDescriptionAttachment">) =>
    api.get<DynamicResponse<"getTblJobDescriptionAttachment">>(
      "/tblJobDescriptionAttachment",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblJobDescriptionAttachmentByJobDescriptionAttachmentId">,
  ) =>
    api.get<
      DynamicResponse<"getTblJobDescriptionAttachmentByJobDescriptionAttachmentId">
    >(`/tblJobDescriptionAttachment/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblJobDescriptionAttachmentCount">) =>
    api.get<DynamicResponse<"getTblJobDescriptionAttachmentCount">>(
      "/tblJobDescriptionAttachment/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblJobDescriptionAttachment">) =>
    api.post<DynamicResponse<"postTblJobDescriptionAttachment">>(
      "/tblJobDescriptionAttachment",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblJobDescriptionAttachmentByJobDescriptionAttachmentId">,
  ) =>
    api.put<
      DynamicResponse<"putTblJobDescriptionAttachmentByJobDescriptionAttachmentId">
    >(`/tblJobDescriptionAttachment/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobDescriptionAttachmentByJobDescriptionAttachmentId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblJobDescriptionAttachmentByJobDescriptionAttachmentId">
    >(`/tblJobDescriptionAttachment/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblJobDescriptionAttachment">) =>
    api.delete<DynamicResponse<"deleteTblJobDescriptionAttachment">>(
      "/tblJobDescriptionAttachment",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblJobTrigger = DynamicResponse<"getTblJobTrigger">["items"][0];
export const tblJobTrigger = {
  getAll: (query?: DynamicQuery<"getTblJobTrigger">) =>
    api.get<DynamicResponse<"getTblJobTrigger">>("/tblJobTrigger", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblJobTriggerByJobTriggerId">,
  ) =>
    api.get<DynamicResponse<"getTblJobTriggerByJobTriggerId">>(
      `/tblJobTrigger/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblJobTriggerCount">) =>
    api.get<DynamicResponse<"getTblJobTriggerCount">>("/tblJobTrigger/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblJobTrigger">) =>
    api.post<DynamicResponse<"postTblJobTrigger">>("/tblJobTrigger", { data }),
  update: (id: number, data: DynamicUpdate<"putTblJobTriggerByJobTriggerId">) =>
    api.put<DynamicResponse<"putTblJobTriggerByJobTriggerId">>(
      `/tblJobTrigger/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobTriggerByJobTriggerId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblJobTriggerByJobTriggerId">>(
      `/tblJobTrigger/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobTrigger">) =>
    api.delete<DynamicResponse<"deleteTblJobTrigger">>("/tblJobTrigger", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblJobTriggerLog =
  DynamicResponse<"getTblJobTriggerLog">["items"][0];
export const tblJobTriggerLog = {
  getAll: (query?: DynamicQuery<"getTblJobTriggerLog">) =>
    api.get<DynamicResponse<"getTblJobTriggerLog">>("/tblJobTriggerLog", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblJobTriggerLogByJobTriggerLogId">,
  ) =>
    api.get<DynamicResponse<"getTblJobTriggerLogByJobTriggerLogId">>(
      `/tblJobTriggerLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblJobTriggerLogCount">) =>
    api.get<DynamicResponse<"getTblJobTriggerLogCount">>(
      "/tblJobTriggerLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblJobTriggerLog">) =>
    api.post<DynamicResponse<"postTblJobTriggerLog">>("/tblJobTriggerLog", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblJobTriggerLogByJobTriggerLogId">,
  ) =>
    api.put<DynamicResponse<"putTblJobTriggerLogByJobTriggerLogId">>(
      `/tblJobTriggerLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobTriggerLogByJobTriggerLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblJobTriggerLogByJobTriggerLogId">>(
      `/tblJobTriggerLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobTriggerLog">) =>
    api.delete<DynamicResponse<"deleteTblJobTriggerLog">>("/tblJobTriggerLog", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblJobVersion = DynamicResponse<"getTblJobVersion">["items"][0];
export const tblJobVersion = {
  getAll: (query?: DynamicQuery<"getTblJobVersion">) =>
    api.get<DynamicResponse<"getTblJobVersion">>("/tblJobVersion", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblJobVersionByJobVersionId">,
  ) =>
    api.get<DynamicResponse<"getTblJobVersionByJobVersionId">>(
      `/tblJobVersion/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblJobVersionCount">) =>
    api.get<DynamicResponse<"getTblJobVersionCount">>("/tblJobVersion/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblJobVersion">) =>
    api.post<DynamicResponse<"postTblJobVersion">>("/tblJobVersion", { data }),
  update: (id: number, data: DynamicUpdate<"putTblJobVersionByJobVersionId">) =>
    api.put<DynamicResponse<"putTblJobVersionByJobVersionId">>(
      `/tblJobVersion/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobVersionByJobVersionId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblJobVersionByJobVersionId">>(
      `/tblJobVersion/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobVersion">) =>
    api.delete<DynamicResponse<"deleteTblJobVersion">>("/tblJobVersion", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblLocation = DynamicResponse<"getTblLocation">["items"][0];
export const tblLocation = {
  getAll: (query?: DynamicQuery<"getTblLocation">) =>
    api.get<DynamicResponse<"getTblLocation">>("/tblLocation", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblLocationByLocationId">) =>
    api.get<DynamicResponse<"getTblLocationByLocationId">>(
      `/tblLocation/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblLocationCount">) =>
    api.get<DynamicResponse<"getTblLocationCount">>("/tblLocation/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblLocation">) =>
    api.post<DynamicResponse<"postTblLocation">>("/tblLocation", { data }),
  update: (id: number, data: DynamicUpdate<"putTblLocationByLocationId">) =>
    api.put<DynamicResponse<"putTblLocationByLocationId">>(
      `/tblLocation/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblLocationByLocationId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblLocationByLocationId">>(
      `/tblLocation/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLocation">) =>
    api.delete<DynamicResponse<"deleteTblLocation">>("/tblLocation", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblLogCounter = DynamicResponse<"getTblLogCounter">["items"][0];
export const tblLogCounter = {
  getAll: (query?: DynamicQuery<"getTblLogCounter">) =>
    api.get<DynamicResponse<"getTblLogCounter">>("/tblLogCounter", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblLogCounterByLogCounterId">,
  ) =>
    api.get<DynamicResponse<"getTblLogCounterByLogCounterId">>(
      `/tblLogCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblLogCounter">) =>
    api.get<DynamicResponse<"getTblLogCounter">>("/tblLogCounter/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblLogCounter">) =>
    api.post<DynamicResponse<"postTblLogCounter">>("/tblLogCounter", { data }),
  update: (id: number, data: DynamicUpdate<"putTblLogCounterByLogCounterId">) =>
    api.put<DynamicResponse<"putTblLogCounterByLogCounterId">>(
      `/tblLogCounter/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblLogCounterByLogCounterId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblLogCounterByLogCounterId">>(
      `/tblLogCounter/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLogCounter">) =>
    api.delete<DynamicResponse<"deleteTblLogCounter">>("/tblLogCounter", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblLogDiscipline =
  DynamicResponse<"getTblLogDiscipline">["items"][0];
export const tblLogDiscipline = {
  getAll: (query?: DynamicQuery<"getTblLogDiscipline">) =>
    api.get<DynamicResponse<"getTblLogDiscipline">>("/tblLogDiscipline", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblLogDisciplineByLogDiscId">,
  ) =>
    api.get<DynamicResponse<"getTblLogDisciplineByLogDiscId">>(
      `/tblLogDiscipline/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblLogDisciplineCount">) =>
    api.get<DynamicResponse<"getTblLogDisciplineCount">>(
      "/tblLogDiscipline/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblLogDiscipline">) =>
    api.post<DynamicResponse<"postTblLogDiscipline">>("/tblLogDiscipline", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblLogDisciplineByLogDiscId">) =>
    api.put<DynamicResponse<"putTblLogDisciplineByLogDiscId">>(
      `/tblLogDiscipline/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblLogDisciplineByLogDiscId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblLogDisciplineByLogDiscId">>(
      `/tblLogDiscipline/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLogDiscipline">) =>
    api.delete<DynamicResponse<"deleteTblLogDiscipline">>("/tblLogDiscipline", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblLoginAudit = DynamicResponse<"getTblLoginAudit">["items"][0];
export const tblLoginAudit = {
  getAll: (query?: DynamicQuery<"getTblLoginAudit">) =>
    api.get<DynamicResponse<"getTblLoginAudit">>("/tblLoginAudit", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblLoginAuditByLoginAuditId">,
  ) =>
    api.get<DynamicResponse<"getTblLoginAuditByLoginAuditId">>(
      `/tblLoginAudit/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblLoginAuditCount">) =>
    api.get<DynamicResponse<"getTblLoginAuditCount">>("/tblLoginAudit/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblLoginAudit">) =>
    api.post<DynamicResponse<"postTblLoginAudit">>("/tblLoginAudit", { data }),
  update: (id: number, data: DynamicUpdate<"putTblLoginAuditByLoginAuditId">) =>
    api.put<DynamicResponse<"putTblLoginAuditByLoginAuditId">>(
      `/tblLoginAudit/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblLoginAuditByLoginAuditId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblLoginAuditByLoginAuditId">>(
      `/tblLoginAudit/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLoginAudit">) =>
    api.delete<DynamicResponse<"deleteTblLoginAudit">>("/tblLoginAudit", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblMaintCause = DynamicResponse<"getTblMaintCause">["items"][0];
export const tblMaintCause = {
  getAll: (query?: DynamicQuery<"getTblMaintCause">) =>
    api.get<DynamicResponse<"getTblMaintCause">>("/tblMaintCause", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblMaintCauseByMaintCauseId">,
  ) =>
    api.get<DynamicResponse<"getTblMaintCauseByMaintCauseId">>(
      `/tblMaintCause/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintCauseCount">) =>
    api.get<DynamicResponse<"getTblMaintCauseCount">>("/tblMaintCause/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblMaintCause">) =>
    api.post<DynamicResponse<"postTblMaintCause">>("/tblMaintCause", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintCauseByMaintCauseId">) =>
    api.put<DynamicResponse<"putTblMaintCauseByMaintCauseId">>(
      `/tblMaintCause/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintCauseByMaintCauseId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintCauseByMaintCauseId">>(
      `/tblMaintCause/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintCause">) =>
    api.delete<DynamicResponse<"deleteTblMaintCause">>("/tblMaintCause", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblMaintClass = DynamicResponse<"getTblMaintClass">["items"][0];
export const tblMaintClass = {
  getAll: (query?: DynamicQuery<"getTblMaintClass">) =>
    api.get<DynamicResponse<"getTblMaintClass">>("/tblMaintClass", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblMaintClassByMaintClassId">,
  ) =>
    api.get<DynamicResponse<"getTblMaintClassByMaintClassId">>(
      `/tblMaintClass/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintClassCount">) =>
    api.get<DynamicResponse<"getTblMaintClassCount">>("/tblMaintClass/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblMaintClass">) =>
    api.post<DynamicResponse<"postTblMaintClass">>("/tblMaintClass", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintClassByMaintClassId">) =>
    api.put<DynamicResponse<"putTblMaintClassByMaintClassId">>(
      `/tblMaintClass/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintClassByMaintClassId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintClassByMaintClassId">>(
      `/tblMaintClass/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintClass">) =>
    api.delete<DynamicResponse<"deleteTblMaintClass">>("/tblMaintClass", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblMaintLog = DynamicResponse<"getTblMaintLog">["items"][0];
export const tblMaintLog = {
  getAll: (query?: DynamicQuery<"getTblMaintLog">) =>
    api.get<DynamicResponse<"getTblMaintLog">>("/tblMaintLog", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintLogByMaintLogId">) =>
    api.get<DynamicResponse<"getTblMaintLogByMaintLogId">>(
      `/tblMaintLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintLogCount">) =>
    api.get<DynamicResponse<"getTblMaintLogCount">>("/tblMaintLog/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblMaintLog">) =>
    api.post<DynamicResponse<"postTblMaintLog">>("/tblMaintLog", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintLogByMaintLogId">) =>
    api.put<DynamicResponse<"putTblMaintLogByMaintLogId">>(
      `/tblMaintLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogByMaintLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintLogByMaintLogId">>(
      `/tblMaintLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLog">) =>
    api.delete<DynamicResponse<"deleteTblMaintLog">>("/tblMaintLog", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblMaintLogAttachment =
  DynamicResponse<"getTblMaintLogAttachment">["items"][0];
export const tblMaintLogAttachment = {
  getAll: (query?: DynamicQuery<"getTblMaintLogAttachment">) =>
    api.get<DynamicResponse<"getTblMaintLogAttachment">>(
      "/tblMaintLogAttachment",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblMaintLogAttachmentByMaintLogAttachmentId">,
  ) =>
    api.get<DynamicResponse<"getTblMaintLogAttachmentByMaintLogAttachmentId">>(
      `/tblMaintLogAttachment/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintLogAttachmentCount">) =>
    api.get<DynamicResponse<"getTblMaintLogAttachmentCount">>(
      "/tblMaintLogAttachment/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblMaintLogAttachment">) =>
    api.post<DynamicResponse<"postTblMaintLogAttachment">>(
      "/tblMaintLogAttachment",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblMaintLogAttachmentByMaintLogAttachmentId">,
  ) =>
    api.put<DynamicResponse<"putTblMaintLogAttachmentByMaintLogAttachmentId">>(
      `/tblMaintLogAttachment/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogAttachmentByMaintLogAttachmentId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblMaintLogAttachmentByMaintLogAttachmentId">
    >(`/tblMaintLogAttachment/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLogAttachment">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogAttachment">>(
      "/tblMaintLogAttachment",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblMaintLogFollow =
  DynamicResponse<"getTblMaintLogFollow">["items"][0];
export const tblMaintLogFollow = {
  getAll: (query?: DynamicQuery<"getTblMaintLogFollow">) =>
    api.get<DynamicResponse<"getTblMaintLogFollow">>("/tblMaintLogFollow", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblMaintLogFollowByFollowId">,
  ) =>
    api.get<DynamicResponse<"getTblMaintLogFollowByFollowId">>(
      `/tblMaintLogFollow/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintLogFollowCount">) =>
    api.get<DynamicResponse<"getTblMaintLogFollowCount">>(
      "/tblMaintLogFollow/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblMaintLogFollow">) =>
    api.post<DynamicResponse<"postTblMaintLogFollow">>("/tblMaintLogFollow", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblMaintLogFollowByFollowId">) =>
    api.put<DynamicResponse<"putTblMaintLogFollowByFollowId">>(
      `/tblMaintLogFollow/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogFollowByFollowId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintLogFollowByFollowId">>(
      `/tblMaintLogFollow/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLogFollow">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogFollow">>(
      "/tblMaintLogFollow",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblMaintLogStocks =
  DynamicResponse<"getTblMaintLogStocks">["items"][0];
export const tblMaintLogStocks = {
  getAll: (query?: DynamicQuery<"getTblMaintLogStocks">) =>
    api.get<DynamicResponse<"getTblMaintLogStocks">>("/tblMaintLogStocks", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblMaintLogStocksByMaintLogStockId">,
  ) =>
    api.get<DynamicResponse<"getTblMaintLogStocksByMaintLogStockId">>(
      `/tblMaintLogStocks/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintLogStocksCount">) =>
    api.get<DynamicResponse<"getTblMaintLogStocksCount">>(
      "/tblMaintLogStocks/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblMaintLogStocks">) =>
    api.post<DynamicResponse<"postTblMaintLogStocks">>("/tblMaintLogStocks", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblMaintLogStocksByMaintLogStockId">,
  ) =>
    api.put<DynamicResponse<"putTblMaintLogStocksByMaintLogStockId">>(
      `/tblMaintLogStocks/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogStocksByMaintLogStockId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintLogStocksByMaintLogStockId">>(
      `/tblMaintLogStocks/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLogStocks">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogStocks">>(
      "/tblMaintLogStocks",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblMaintType = DynamicResponse<"getTblMaintType">["items"][0];
export const tblMaintType = {
  getAll: (query?: DynamicQuery<"getTblMaintType">) =>
    api.get<DynamicResponse<"getTblMaintType">>("/tblMaintType", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintTypeByMaintTypeId">) =>
    api.get<DynamicResponse<"getTblMaintTypeByMaintTypeId">>(
      `/tblMaintType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblMaintTypeCount">) =>
    api.get<DynamicResponse<"getTblMaintTypeCount">>("/tblMaintType/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblMaintType">) =>
    api.post<DynamicResponse<"postTblMaintType">>("/tblMaintType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintTypeByMaintTypeId">) =>
    api.put<DynamicResponse<"putTblMaintTypeByMaintTypeId">>(
      `/tblMaintType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintTypeByMaintTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintTypeByMaintTypeId">>(
      `/tblMaintType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintType">) =>
    api.delete<DynamicResponse<"deleteTblMaintType">>("/tblMaintType", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblOilSamplingLog =
  DynamicResponse<"getTblOilSamplingLog">["items"][0];
export const tblOilSamplingLog = {
  getAll: (query?: DynamicQuery<"getTblOilSamplingLog">) =>
    api.get<DynamicResponse<"getTblOilSamplingLog">>("/tblOilSamplingLog", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblOilSamplingLogByOilSamplingLogId">,
  ) =>
    api.get<DynamicResponse<"getTblOilSamplingLogByOilSamplingLogId">>(
      `/tblOilSamplingLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblOilSamplingLogCount">) =>
    api.get<DynamicResponse<"getTblOilSamplingLogCount">>(
      "/tblOilSamplingLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblOilSamplingLog">) =>
    api.post<DynamicResponse<"postTblOilSamplingLog">>("/tblOilSamplingLog", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblOilSamplingLogByOilSamplingLogId">,
  ) =>
    api.put<DynamicResponse<"putTblOilSamplingLogByOilSamplingLogId">>(
      `/tblOilSamplingLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblOilSamplingLogByOilSamplingLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblOilSamplingLogByOilSamplingLogId">>(
      `/tblOilSamplingLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblOilSamplingLog">) =>
    api.delete<DynamicResponse<"deleteTblOilSamplingLog">>(
      "/tblOilSamplingLog",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblParameters = DynamicResponse<"getTblParameters">["items"][0];
export const tblParameters = {
  getAll: (query?: DynamicQuery<"getTblParameters">) =>
    api.get<DynamicResponse<"getTblParameters">>("/tblParameters", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblParametersByParameterId">,
  ) =>
    api.get<DynamicResponse<"getTblParametersByParameterId">>(
      `/tblParameters/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblParametersCount">) =>
    api.get<DynamicResponse<"getTblParametersCount">>("/tblParameters/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblParameters">) =>
    api.post<DynamicResponse<"postTblParameters">>("/tblParameters", { data }),
  update: (id: number, data: DynamicUpdate<"putTblParametersByParameterId">) =>
    api.put<DynamicResponse<"putTblParametersByParameterId">>(
      `/tblParameters/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblParametersByParameterId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblParametersByParameterId">>(
      `/tblParameters/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblParameters">) =>
    api.delete<DynamicResponse<"deleteTblParameters">>("/tblParameters", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblPendingType =
  DynamicResponse<"getTblPendingType">["items"][0];
export const tblPendingType = {
  getAll: (query?: DynamicQuery<"getTblPendingType">) =>
    api.get<DynamicResponse<"getTblPendingType">>("/tblPendingType", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblPendingTypeByPendTypeId">,
  ) =>
    api.get<DynamicResponse<"getTblPendingTypeByPendTypeId">>(
      `/tblPendingType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblPendingTypeCount">) =>
    api.get<DynamicResponse<"getTblPendingTypeCount">>(
      "/tblPendingType/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblPendingType">) =>
    api.post<DynamicResponse<"postTblPendingType">>("/tblPendingType", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblPendingTypeByPendTypeId">) =>
    api.put<DynamicResponse<"putTblPendingTypeByPendTypeId">>(
      `/tblPendingType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblPendingTypeByPendTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblPendingTypeByPendTypeId">>(
      `/tblPendingType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblPendingType">) =>
    api.delete<DynamicResponse<"deleteTblPendingType">>("/tblPendingType", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblPeriod = DynamicResponse<"getTblPeriod">["items"][0];
export const tblPeriod = {
  getAll: (query?: DynamicQuery<"getTblPeriod">) =>
    api.get<DynamicResponse<"getTblPeriod">>("/tblPeriod", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblPeriodByPeriodId">) =>
    api.get<DynamicResponse<"getTblPeriodByPeriodId">>(`/tblPeriod/${id}`, {
      params: stringifyQuery(query),
    }),
  count: (query?: DynamicQuery<"getTblPeriodCount">) =>
    api.get<DynamicResponse<"getTblPeriodCount">>("/tblPeriod/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblPeriod">) =>
    api.post<DynamicResponse<"postTblPeriod">>("/tblPeriod", { data }),
  update: (id: number, data: DynamicUpdate<"putTblPeriodByPeriodId">) =>
    api.put<DynamicResponse<"putTblPeriodByPeriodId">>(`/tblPeriod/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblPeriodByPeriodId">) =>
    api.delete<DynamicResponse<"deleteTblPeriodByPeriodId">>(
      `/tblPeriod/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblPeriod">) =>
    api.delete<DynamicResponse<"deleteTblPeriod">>("/tblPeriod", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblReScheduleLog =
  DynamicResponse<"getTblReScheduleLog">["items"][0];
export const tblReScheduleLog = {
  getAll: (query?: DynamicQuery<"getTblReScheduleLog">) =>
    api.get<DynamicResponse<"getTblReScheduleLog">>("/tblReScheduleLog", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblReScheduleLogByRescheduleLogId">,
  ) =>
    api.get<DynamicResponse<"getTblReScheduleLogByRescheduleLogId">>(
      `/tblReScheduleLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblReScheduleLogCount">) =>
    api.get<DynamicResponse<"getTblReScheduleLogCount">>(
      "/tblReScheduleLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblReScheduleLog">) =>
    api.post<DynamicResponse<"postTblReScheduleLog">>("/tblReScheduleLog", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblReScheduleLogByRescheduleLogId">,
  ) =>
    api.put<DynamicResponse<"putTblReScheduleLogByRescheduleLogId">>(
      `/tblReScheduleLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblReScheduleLogByRescheduleLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblReScheduleLogByRescheduleLogId">>(
      `/tblReScheduleLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblReScheduleLog">) =>
    api.delete<DynamicResponse<"deleteTblReScheduleLog">>("/tblReScheduleLog", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblRotationLog =
  DynamicResponse<"getTblRotationLog">["items"][0];
export const tblRotationLog = {
  getAll: (query?: DynamicQuery<"getTblRotationLog">) =>
    api.get<DynamicResponse<"getTblRotationLog">>("/tblRotationLog", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblRotationLogByRotationLogId">,
  ) =>
    api.get<DynamicResponse<"getTblRotationLogByRotationLogId">>(
      `/tblRotationLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblRotationLogCount">) =>
    api.get<DynamicResponse<"getTblRotationLogCount">>(
      "/tblRotationLog/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblRotationLog">) =>
    api.post<DynamicResponse<"postTblRotationLog">>("/tblRotationLog", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblRotationLogByRotationLogId">,
  ) =>
    api.put<DynamicResponse<"putTblRotationLogByRotationLogId">>(
      `/tblRotationLog/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblRotationLogByRotationLogId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblRotationLogByRotationLogId">>(
      `/tblRotationLog/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblRotationLog">) =>
    api.delete<DynamicResponse<"deleteTblRotationLog">>("/tblRotationLog", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblRound = DynamicResponse<"getTblRound">["items"][0];
export const tblRound = {
  getAll: (query?: DynamicQuery<"getTblRound">) =>
    api.get<DynamicResponse<"getTblRound">>("/tblRound", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblRoundByRoundId">) =>
    api.get<DynamicResponse<"getTblRoundByRoundId">>(`/tblRound/${id}`, {
      params: stringifyQuery(query),
    }),
  count: (query?: DynamicQuery<"getTblRoundCount">) =>
    api.get<DynamicResponse<"getTblRoundCount">>("/tblRound/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblRound">) =>
    api.post<DynamicResponse<"postTblRound">>("/tblRound", { data }),
  update: (id: number, data: DynamicUpdate<"putTblRoundByRoundId">) =>
    api.put<DynamicResponse<"putTblRoundByRoundId">>(`/tblRound/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblRoundByRoundId">) =>
    api.delete<DynamicResponse<"deleteTblRoundByRoundId">>(`/tblRound/${id}`, {
      params: stringifyQuery(query),
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblRound">) =>
    api.delete<DynamicResponse<"deleteTblRound">>("/tblRound", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblRoundCompJob =
  DynamicResponse<"getTblRoundCompJob">["items"][0];
export const tblRoundCompJob = {
  getAll: (query?: DynamicQuery<"getTblRoundCompJob">) =>
    api.get<DynamicResponse<"getTblRoundCompJob">>("/tblRoundCompJob", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblRoundCompJobByRoundCompJobId">,
  ) =>
    api.get<DynamicResponse<"getTblRoundCompJobByRoundCompJobId">>(
      `/tblRoundCompJob/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblRoundCompJobCount">) =>
    api.get<DynamicResponse<"getTblRoundCompJobCount">>(
      "/tblRoundCompJob/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblRoundCompJob">) =>
    api.post<DynamicResponse<"postTblRoundCompJob">>("/tblRoundCompJob", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblRoundCompJobByRoundCompJobId">,
  ) =>
    api.put<DynamicResponse<"putTblRoundCompJobByRoundCompJobId">>(
      `/tblRoundCompJob/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblRoundCompJobByRoundCompJobId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblRoundCompJobByRoundCompJobId">>(
      `/tblRoundCompJob/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblRoundCompJob">) =>
    api.delete<DynamicResponse<"deleteTblRoundCompJob">>("/tblRoundCompJob", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblSpareType = DynamicResponse<"getTblSpareType">["items"][0];
export const tblSpareType = {
  getAll: (query?: DynamicQuery<"getTblSpareType">) =>
    api.get<DynamicResponse<"getTblSpareType">>("/tblSpareType", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblSpareTypeBySpareTypeId">) =>
    api.get<DynamicResponse<"getTblSpareTypeBySpareTypeId">>(
      `/tblSpareType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblSpareTypeCount">) =>
    api.get<DynamicResponse<"getTblSpareTypeCount">>("/tblSpareType/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblSpareType">) =>
    api.post<DynamicResponse<"postTblSpareType">>("/tblSpareType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblSpareTypeBySpareTypeId">) =>
    api.put<DynamicResponse<"putTblSpareTypeBySpareTypeId">>(
      `/tblSpareType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblSpareTypeBySpareTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblSpareTypeBySpareTypeId">>(
      `/tblSpareType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblSpareType">) =>
    api.delete<DynamicResponse<"deleteTblSpareType">>("/tblSpareType", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblSpareUnit = DynamicResponse<"getTblSpareUnit">["items"][0];
export const tblSpareUnit = {
  getAll: (query?: DynamicQuery<"getTblSpareUnit">) =>
    api.get<DynamicResponse<"getTblSpareUnit">>("/tblSpareUnit", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblSpareUnitBySpareUnitId">) =>
    api.get<DynamicResponse<"getTblSpareUnitBySpareUnitId">>(
      `/tblSpareUnit/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblSpareUnitCount">) =>
    api.get<DynamicResponse<"getTblSpareUnitCount">>("/tblSpareUnit/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblSpareUnit">) =>
    api.post<DynamicResponse<"postTblSpareUnit">>("/tblSpareUnit", { data }),
  update: (id: number, data: DynamicUpdate<"putTblSpareUnitBySpareUnitId">) =>
    api.put<DynamicResponse<"putTblSpareUnitBySpareUnitId">>(
      `/tblSpareUnit/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblSpareUnitBySpareUnitId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblSpareUnitBySpareUnitId">>(
      `/tblSpareUnit/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblSpareUnit">) =>
    api.delete<DynamicResponse<"deleteTblSpareUnit">>("/tblSpareUnit", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblUnit = DynamicResponse<"getTblUnit">["items"][0];
export const tblUnit = {
  getAll: (query?: DynamicQuery<"getTblUnit">) =>
    api.get<DynamicResponse<"getTblUnit">>("/tblUnit", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblUnitByUnitId">) =>
    api.get<DynamicResponse<"getTblUnitByUnitId">>(`/tblUnit/${id}`, {
      params: stringifyQuery(query),
    }),
  count: (query?: DynamicQuery<"getTblUnitCount">) =>
    api.get<DynamicResponse<"getTblUnitCount">>("/tblUnit/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblUnit">) =>
    api.post<DynamicResponse<"postTblUnit">>("/tblUnit", { data }),
  update: (id: number, data: DynamicUpdate<"putTblUnitByUnitId">) =>
    api.put<DynamicResponse<"putTblUnitByUnitId">>(`/tblUnit/${id}`, { data }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblUnitByUnitId">) =>
    api.delete<DynamicResponse<"deleteTblUnitByUnitId">>(`/tblUnit/${id}`, {
      params: stringifyQuery(query),
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblUnit">) =>
    api.delete<DynamicResponse<"deleteTblUnit">>("/tblUnit", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblUsers = DynamicResponse<"getTblUsers">["items"][0];
export const tblUsers = {
  getAll: (query?: DynamicQuery<"getTblUsers">) =>
    api.get<DynamicResponse<"getTblUsers">>("/tblUsers", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblUsersByUserId">) =>
    api.get<DynamicResponse<"getTblUsersByUserId">>(`/tblUsers/${id}`, {
      params: stringifyQuery(query),
    }),
  count: (query?: DynamicQuery<"getTblUsersCount">) =>
    api.get<DynamicResponse<"getTblUsersCount">>("/tblUsers/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblUsers">) =>
    api.post<DynamicResponse<"postTblUsers">>("/tblUsers", { data }),
  update: (id: number, data: DynamicUpdate<"putTblUsersByUserId">) =>
    api.put<DynamicResponse<"putTblUsersByUserId">>(`/tblUsers/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblUsersByUserId">) =>
    api.delete<DynamicResponse<"deleteTblUsersByUserId">>(`/tblUsers/${id}`, {
      params: stringifyQuery(query),
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblUsers">) =>
    api.delete<DynamicResponse<"deleteTblUsers">>("/tblUsers", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblWorkOrder = DynamicResponse<"getTblWorkOrder">["items"][0];
export const tblWorkOrder = {
  getAll: (query?: DynamicQuery<"getTblWorkOrder">) =>
    api.get<DynamicResponse<"getTblWorkOrder">>("/tblWorkOrder", {
      params: stringifyQuery(query),
    }),
  getById: (id: number, query?: DynamicQuery<"getTblWorkOrderByWorkOrderId">) =>
    api.get<DynamicResponse<"getTblWorkOrderByWorkOrderId">>(
      `/tblWorkOrder/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblWorkOrderCount">) =>
    api.get<DynamicResponse<"getTblWorkOrderCount">>("/tblWorkOrder/count", {
      params: stringifyQuery(query),
    }),
  create: (data: DynamicCreate<"postTblWorkOrder">) =>
    api.post<DynamicResponse<"postTblWorkOrder">>("/tblWorkOrder", { data }),
  update: (id: number, data: DynamicUpdate<"putTblWorkOrderByWorkOrderId">) =>
    api.put<DynamicResponse<"putTblWorkOrderByWorkOrderId">>(
      `/tblWorkOrder/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkOrderByWorkOrderId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkOrderByWorkOrderId">>(
      `/tblWorkOrder/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkOrder">) =>
    api.delete<DynamicResponse<"deleteTblWorkOrder">>("/tblWorkOrder", {
      params: stringifyQuery(query),
    }),
};

export const tblWorkOrderGenerate = {
  create: (data: DynamicCreate<"postTblWorkOrderGenerate">) =>
    api.post<DynamicResponse<"postTblWorkOrderGenerate">>(
      "/tblWorkOrderGenerate",
      { data },
    ),
};

export const tblWorkOrderGenerateNext = {
  create: (data: DynamicCreate<"postTblWorkOrderGenerateNext">) =>
    api.post<DynamicResponse<"postTblWorkOrderGenerateNext">>(
      "/tblWorkOrderGenerateNext",
      { data },
    ),
};

export type TypeTblWorkOrderStatus =
  DynamicResponse<"getTblWorkOrderStatus">["items"][0];
export const tblWorkOrderStatus = {
  getAll: (query?: DynamicQuery<"getTblWorkOrderStatus">) =>
    api.get<DynamicResponse<"getTblWorkOrderStatus">>("/tblWorkOrderStatus", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblWorkOrderStatusByWorkOrderStatusId">,
  ) =>
    api.get<DynamicResponse<"getTblWorkOrderStatusByWorkOrderStatusId">>(
      `/tblWorkOrderStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblWorkOrderStatusCount">) =>
    api.get<DynamicResponse<"getTblWorkOrderStatusCount">>(
      "/tblWorkOrderStatus/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblWorkOrderStatus">) =>
    api.post<DynamicResponse<"postTblWorkOrderStatus">>("/tblWorkOrderStatus", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblWorkOrderStatusByWorkOrderStatusId">,
  ) =>
    api.put<DynamicResponse<"putTblWorkOrderStatusByWorkOrderStatusId">>(
      `/tblWorkOrderStatus/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkOrderStatusByWorkOrderStatusId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkOrderStatusByWorkOrderStatusId">>(
      `/tblWorkOrderStatus/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkOrderStatus">) =>
    api.delete<DynamicResponse<"deleteTblWorkOrderStatus">>(
      "/tblWorkOrderStatus",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblWorkOrderType =
  DynamicResponse<"getTblWorkOrderType">["items"][0];
export const tblWorkOrderType = {
  getAll: (query?: DynamicQuery<"getTblWorkOrderType">) =>
    api.get<DynamicResponse<"getTblWorkOrderType">>("/tblWorkOrderType", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblWorkOrderTypeByWorkOrderTypeId">,
  ) =>
    api.get<DynamicResponse<"getTblWorkOrderTypeByWorkOrderTypeId">>(
      `/tblWorkOrderType/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblWorkOrderTypeCount">) =>
    api.get<DynamicResponse<"getTblWorkOrderTypeCount">>(
      "/tblWorkOrderType/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblWorkOrderType">) =>
    api.post<DynamicResponse<"postTblWorkOrderType">>("/tblWorkOrderType", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblWorkOrderTypeByWorkOrderTypeId">,
  ) =>
    api.put<DynamicResponse<"putTblWorkOrderTypeByWorkOrderTypeId">>(
      `/tblWorkOrderType/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkOrderTypeByWorkOrderTypeId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkOrderTypeByWorkOrderTypeId">>(
      `/tblWorkOrderType/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkOrderType">) =>
    api.delete<DynamicResponse<"deleteTblWorkOrderType">>("/tblWorkOrderType", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblWorkShopComponent =
  DynamicResponse<"getTblWorkShopComponent">["items"][0];
export const tblWorkShopComponent = {
  getAll: (query?: DynamicQuery<"getTblWorkShopComponent">) =>
    api.get<DynamicResponse<"getTblWorkShopComponent">>(
      "/tblWorkShopComponent",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblWorkShopComponentByWShopCompId">,
  ) =>
    api.get<DynamicResponse<"getTblWorkShopComponentByWShopCompId">>(
      `/tblWorkShopComponent/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblWorkShopComponentCount">) =>
    api.get<DynamicResponse<"getTblWorkShopComponentCount">>(
      "/tblWorkShopComponent/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblWorkShopComponent">) =>
    api.post<DynamicResponse<"postTblWorkShopComponent">>(
      "/tblWorkShopComponent",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblWorkShopComponentByWShopCompId">,
  ) =>
    api.put<DynamicResponse<"putTblWorkShopComponentByWShopCompId">>(
      `/tblWorkShopComponent/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkShopComponentByWShopCompId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkShopComponentByWShopCompId">>(
      `/tblWorkShopComponent/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopComponent">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopComponent">>(
      "/tblWorkShopComponent",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblWorkShopDone =
  DynamicResponse<"getTblWorkShopDone">["items"][0];
export const tblWorkShopDone = {
  getAll: (query?: DynamicQuery<"getTblWorkShopDone">) =>
    api.get<DynamicResponse<"getTblWorkShopDone">>("/tblWorkShopDone", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblWorkShopDoneByWShopDoneId">,
  ) =>
    api.get<DynamicResponse<"getTblWorkShopDoneByWShopDoneId">>(
      `/tblWorkShopDone/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblWorkShopDoneCount">) =>
    api.get<DynamicResponse<"getTblWorkShopDoneCount">>(
      "/tblWorkShopDone/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblWorkShopDone">) =>
    api.post<DynamicResponse<"postTblWorkShopDone">>("/tblWorkShopDone", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblWorkShopDoneByWShopDoneId">,
  ) =>
    api.put<DynamicResponse<"putTblWorkShopDoneByWShopDoneId">>(
      `/tblWorkShopDone/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkShopDoneByWShopDoneId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkShopDoneByWShopDoneId">>(
      `/tblWorkShopDone/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopDone">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopDone">>("/tblWorkShopDone", {
      params: stringifyQuery(query),
    }),
};

export type TypeTblWorkShopRequest =
  DynamicResponse<"getTblWorkShopRequest">["items"][0];
export const tblWorkShopRequest = {
  getAll: (query?: DynamicQuery<"getTblWorkShopRequest">) =>
    api.get<DynamicResponse<"getTblWorkShopRequest">>("/tblWorkShopRequest", {
      params: stringifyQuery(query),
    }),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblWorkShopRequestByWShopRequestId">,
  ) =>
    api.get<DynamicResponse<"getTblWorkShopRequestByWShopRequestId">>(
      `/tblWorkShopRequest/${id}`,
      { params: stringifyQuery(query) },
    ),
  count: (query?: DynamicQuery<"getTblWorkShopRequestCount">) =>
    api.get<DynamicResponse<"getTblWorkShopRequestCount">>(
      "/tblWorkShopRequest/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblWorkShopRequest">) =>
    api.post<DynamicResponse<"postTblWorkShopRequest">>("/tblWorkShopRequest", {
      data,
    }),
  update: (
    id: number,
    data: DynamicUpdate<"putTblWorkShopRequestByWShopRequestId">,
  ) =>
    api.put<DynamicResponse<"putTblWorkShopRequestByWShopRequestId">>(
      `/tblWorkShopRequest/${id}`,
      { data },
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkShopRequestByWShopRequestId">,
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkShopRequestByWShopRequestId">>(
      `/tblWorkShopRequest/${id}`,
      { params: stringifyQuery(query) },
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopRequest">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopRequest">>(
      "/tblWorkShopRequest",
      { params: stringifyQuery(query) },
    ),
};

export type TypeTblWorkShopRequestAttachment =
  DynamicResponse<"getTblWorkShopRequestAttachment">["items"][0];
export const tblWorkShopRequestAttachment = {
  getAll: (query?: DynamicQuery<"getTblWorkShopRequestAttachment">) =>
    api.get<DynamicResponse<"getTblWorkShopRequestAttachment">>(
      "/tblWorkShopRequestAttachment",
      { params: stringifyQuery(query) },
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblWorkShopRequestAttachmentByWShopRequestAttachmentId">,
  ) =>
    api.get<
      DynamicResponse<"getTblWorkShopRequestAttachmentByWShopRequestAttachmentId">
    >(`/tblWorkShopRequestAttachment/${id}`, { params: stringifyQuery(query) }),
  count: (query?: DynamicQuery<"getTblWorkShopRequestAttachmentCount">) =>
    api.get<DynamicResponse<"getTblWorkShopRequestAttachmentCount">>(
      "/tblWorkShopRequestAttachment/count",
      { params: stringifyQuery(query) },
    ),
  create: (data: DynamicCreate<"postTblWorkShopRequestAttachment">) =>
    api.post<DynamicResponse<"postTblWorkShopRequestAttachment">>(
      "/tblWorkShopRequestAttachment",
      { data },
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblWorkShopRequestAttachmentByWShopRequestAttachmentId">,
  ) =>
    api.put<
      DynamicResponse<"putTblWorkShopRequestAttachmentByWShopRequestAttachmentId">
    >(`/tblWorkShopRequestAttachment/${id}`, { data }),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkShopRequestAttachmentByWShopRequestAttachmentId">,
  ) =>
    api.delete<
      DynamicResponse<"deleteTblWorkShopRequestAttachmentByWShopRequestAttachmentId">
    >(`/tblWorkShopRequestAttachment/${id}`, { params: stringifyQuery(query) }),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopRequestAttachment">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopRequestAttachment">>(
      "/tblWorkShopRequestAttachment",
      { params: stringifyQuery(query) },
    ),
};
