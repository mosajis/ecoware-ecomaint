// ⚠️ Auto-generated file. Do not edit manually.
import { api } from "@/service/axios";
import type {
  DynamicResponse,
  DynamicQuery,
  DynamicCreate,
  DynamicUpdate,
} from "../dynamicTypes";

export type TypeDisciplineGroup =
  DynamicResponse<"getDisciplineGroup">["items"][0];
export const disciplineGroup = {
  getAll: (query?: DynamicQuery<"getDisciplineGroup">) =>
    api.get<DynamicResponse<"getDisciplineGroup">>("/disciplineGroup", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getDisciplineGroupById">) =>
    api.get<DynamicResponse<"getDisciplineGroupById">>(
      `/disciplineGroup/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getDisciplineGroupCount">) =>
    api.get<DynamicResponse<"getDisciplineGroupCount">>(
      "/disciplineGroup/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postDisciplineGroup">) =>
    api.post<DynamicResponse<"postDisciplineGroup">>("/disciplineGroup", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putDisciplineGroupById">) =>
    api.put<DynamicResponse<"putDisciplineGroupById">>(
      `/disciplineGroup/${id}`,
      { data }
    ),
  deleteById: (id: number, query?: DynamicQuery<"deleteDisciplineGroupById">) =>
    api.delete<DynamicResponse<"deleteDisciplineGroupById">>(
      `/disciplineGroup/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteDisciplineGroup">) =>
    api.delete<DynamicResponse<"deleteDisciplineGroup">>("/disciplineGroup", {
      params: query,
    }),
};

export type TypeDisciplineGroupRelations =
  DynamicResponse<"getDisciplineGroupRelations">["items"][0];
export const disciplineGroupRelations = {
  getAll: (query?: DynamicQuery<"getDisciplineGroupRelations">) =>
    api.get<DynamicResponse<"getDisciplineGroupRelations">>(
      "/disciplineGroupRelations",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getDisciplineGroupRelationsById">
  ) =>
    api.get<DynamicResponse<"getDisciplineGroupRelationsById">>(
      `/disciplineGroupRelations/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getDisciplineGroupRelationsCount">) =>
    api.get<DynamicResponse<"getDisciplineGroupRelationsCount">>(
      "/disciplineGroupRelations/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postDisciplineGroupRelations">) =>
    api.post<DynamicResponse<"postDisciplineGroupRelations">>(
      "/disciplineGroupRelations",
      { data }
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putDisciplineGroupRelationsById">
  ) =>
    api.put<DynamicResponse<"putDisciplineGroupRelationsById">>(
      `/disciplineGroupRelations/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteDisciplineGroupRelationsById">
  ) =>
    api.delete<DynamicResponse<"deleteDisciplineGroupRelationsById">>(
      `/disciplineGroupRelations/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteDisciplineGroupRelations">) =>
    api.delete<DynamicResponse<"deleteDisciplineGroupRelations">>(
      "/disciplineGroupRelations",
      { params: query }
    ),
};

export type TypeDocumentSignature =
  DynamicResponse<"getDocumentSignature">["items"][0];
export const documentSignature = {
  getAll: (query?: DynamicQuery<"getDocumentSignature">) =>
    api.get<DynamicResponse<"getDocumentSignature">>("/documentSignature", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getDocumentSignatureById">) =>
    api.get<DynamicResponse<"getDocumentSignatureById">>(
      `/documentSignature/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getDocumentSignatureCount">) =>
    api.get<DynamicResponse<"getDocumentSignatureCount">>(
      "/documentSignature/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postDocumentSignature">) =>
    api.post<DynamicResponse<"postDocumentSignature">>("/documentSignature", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putDocumentSignatureById">) =>
    api.put<DynamicResponse<"putDocumentSignatureById">>(
      `/documentSignature/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteDocumentSignatureById">
  ) =>
    api.delete<DynamicResponse<"deleteDocumentSignatureById">>(
      `/documentSignature/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteDocumentSignature">) =>
    api.delete<DynamicResponse<"deleteDocumentSignature">>(
      "/documentSignature",
      { params: query }
    ),
};

export type TypeDocumentSignatureLog =
  DynamicResponse<"getDocumentSignatureLog">["items"][0];
export const documentSignatureLog = {
  getAll: (query?: DynamicQuery<"getDocumentSignatureLog">) =>
    api.get<DynamicResponse<"getDocumentSignatureLog">>(
      "/documentSignatureLog",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getDocumentSignatureLogById">) =>
    api.get<DynamicResponse<"getDocumentSignatureLogById">>(
      `/documentSignatureLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getDocumentSignatureLogCount">) =>
    api.get<DynamicResponse<"getDocumentSignatureLogCount">>(
      "/documentSignatureLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postDocumentSignatureLog">) =>
    api.post<DynamicResponse<"postDocumentSignatureLog">>(
      "/documentSignatureLog",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putDocumentSignatureLogById">) =>
    api.put<DynamicResponse<"putDocumentSignatureLogById">>(
      `/documentSignatureLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteDocumentSignatureLogById">
  ) =>
    api.delete<DynamicResponse<"deleteDocumentSignatureLogById">>(
      `/documentSignatureLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteDocumentSignatureLog">) =>
    api.delete<DynamicResponse<"deleteDocumentSignatureLog">>(
      "/documentSignatureLog",
      { params: query }
    ),
};

export type TypeTblActionUsers =
  DynamicResponse<"getTblActionUsers">["items"][0];
export const tblActionUsers = {
  getAll: (query?: DynamicQuery<"getTblActionUsers">) =>
    api.get<DynamicResponse<"getTblActionUsers">>("/tblActionUsers", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblActionUsersById">) =>
    api.get<DynamicResponse<"getTblActionUsersById">>(`/tblActionUsers/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblActionUsersCount">) =>
    api.get<DynamicResponse<"getTblActionUsersCount">>(
      "/tblActionUsers/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblActionUsers">) =>
    api.post<DynamicResponse<"postTblActionUsers">>("/tblActionUsers", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblActionUsersById">) =>
    api.put<DynamicResponse<"putTblActionUsersById">>(`/tblActionUsers/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblActionUsersById">) =>
    api.delete<DynamicResponse<"deleteTblActionUsersById">>(
      `/tblActionUsers/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblActionUsers">) =>
    api.delete<DynamicResponse<"deleteTblActionUsers">>("/tblActionUsers", {
      params: query,
    }),
};

export type TypeTblAddress = DynamicResponse<"getTblAddress">["items"][0];
export const tblAddress = {
  getAll: (query?: DynamicQuery<"getTblAddress">) =>
    api.get<DynamicResponse<"getTblAddress">>("/tblAddress", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblAddressByAddressId">) =>
    api.get<DynamicResponse<"getTblAddressByAddressId">>(`/tblAddress/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblAddressCount">) =>
    api.get<DynamicResponse<"getTblAddressCount">>("/tblAddress/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblAddress">) =>
    api.post<DynamicResponse<"postTblAddress">>("/tblAddress", { data }),
  update: (id: number, data: DynamicUpdate<"putTblAddressById">) =>
    api.put<DynamicResponse<"putTblAddressById">>(`/tblAddress/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblAddressById">) =>
    api.delete<DynamicResponse<"deleteTblAddressById">>(`/tblAddress/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblAddress">) =>
    api.delete<DynamicResponse<"deleteTblAddress">>("/tblAddress", {
      params: query,
    }),
};

export type TypeTblAddressProduct =
  DynamicResponse<"getTblAddressProduct">["items"][0];
export const tblAddressProduct = {
  getAll: (query?: DynamicQuery<"getTblAddressProduct">) =>
    api.get<DynamicResponse<"getTblAddressProduct">>("/tblAddressProduct", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblAddressProductById">) =>
    api.get<DynamicResponse<"getTblAddressProductById">>(
      `/tblAddressProduct/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblAddressProductCount">) =>
    api.get<DynamicResponse<"getTblAddressProductCount">>(
      "/tblAddressProduct/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblAddressProduct">) =>
    api.post<DynamicResponse<"postTblAddressProduct">>("/tblAddressProduct", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblAddressProductById">) =>
    api.put<DynamicResponse<"putTblAddressProductById">>(
      `/tblAddressProduct/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblAddressProductById">
  ) =>
    api.delete<DynamicResponse<"deleteTblAddressProductById">>(
      `/tblAddressProduct/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblAddressProduct">) =>
    api.delete<DynamicResponse<"deleteTblAddressProduct">>(
      "/tblAddressProduct",
      { params: query }
    ),
};

export type TypeTblAppInfo = DynamicResponse<"getTblAppInfo">["items"][0];
export const tblAppInfo = {
  getAll: (query?: DynamicQuery<"getTblAppInfo">) =>
    api.get<DynamicResponse<"getTblAppInfo">>("/tblAppInfo", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblAppInfoById">) =>
    api.get<DynamicResponse<"getTblAppInfoById">>(`/tblAppInfo/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblAppInfoCount">) =>
    api.get<DynamicResponse<"getTblAppInfoCount">>("/tblAppInfo/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblAppInfo">) =>
    api.post<DynamicResponse<"postTblAppInfo">>("/tblAppInfo", { data }),
  update: (id: number, data: DynamicUpdate<"putTblAppInfoById">) =>
    api.put<DynamicResponse<"putTblAppInfoById">>(`/tblAppInfo/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblAppInfoById">) =>
    api.delete<DynamicResponse<"deleteTblAppInfoById">>(`/tblAppInfo/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblAppInfo">) =>
    api.delete<DynamicResponse<"deleteTblAppInfo">>("/tblAppInfo", {
      params: query,
    }),
};

export type TypeTblAppSysParams =
  DynamicResponse<"getTblAppSysParams">["items"][0];
export const tblAppSysParams = {
  getAll: (query?: DynamicQuery<"getTblAppSysParams">) =>
    api.get<DynamicResponse<"getTblAppSysParams">>("/tblAppSysParams", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblAppSysParamsById">) =>
    api.get<DynamicResponse<"getTblAppSysParamsById">>(
      `/tblAppSysParams/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblAppSysParamsCount">) =>
    api.get<DynamicResponse<"getTblAppSysParamsCount">>(
      "/tblAppSysParams/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblAppSysParams">) =>
    api.post<DynamicResponse<"postTblAppSysParams">>("/tblAppSysParams", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblAppSysParamsById">) =>
    api.put<DynamicResponse<"putTblAppSysParamsById">>(
      `/tblAppSysParams/${id}`,
      { data }
    ),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblAppSysParamsById">) =>
    api.delete<DynamicResponse<"deleteTblAppSysParamsById">>(
      `/tblAppSysParams/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblAppSysParams">) =>
    api.delete<DynamicResponse<"deleteTblAppSysParams">>("/tblAppSysParams", {
      params: query,
    }),
};

export type TypeTblCompCounter =
  DynamicResponse<"getTblCompCounter">["items"][0];
export const tblCompCounter = {
  getAll: (query?: DynamicQuery<"getTblCompCounter">) =>
    api.get<DynamicResponse<"getTblCompCounter">>("/tblCompCounter", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompCounterById">) =>
    api.get<DynamicResponse<"getTblCompCounterById">>(`/tblCompCounter/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompCounter">) =>
    api.get<DynamicResponse<"getTblCompCounter">>("/tblCompCounter/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblCompCounter">) =>
    api.post<DynamicResponse<"postTblCompCounter">>("/tblCompCounter", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompCounterById">) =>
    api.put<DynamicResponse<"putTblCompCounterById">>(`/tblCompCounter/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompCounterById">) =>
    api.delete<DynamicResponse<"deleteTblCompCounterById">>(
      `/tblCompCounter/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompCounter">>("/tblCompCounter", {
      params: query,
    }),
};

export type TypeTblCompCounterLog =
  DynamicResponse<"getTblCompCounterLog">["items"][0];
export const tblCompCounterLog = {
  getAll: (query?: DynamicQuery<"getTblCompCounterLog">) =>
    api.get<DynamicResponse<"getTblCompCounterLog">>("/tblCompCounterLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompCounterLogById">) =>
    api.get<DynamicResponse<"getTblCompCounterLogById">>(
      `/tblCompCounterLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompCounterLog">) =>
    api.get<DynamicResponse<"getTblCompCounterLog">>(
      "/tblCompCounterLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompCounterLog">) =>
    api.post<DynamicResponse<"postTblCompCounterLog">>("/tblCompCounterLog", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompCounterLogById">) =>
    api.put<DynamicResponse<"putTblCompCounterLogById">>(
      `/tblCompCounterLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompCounterLogById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompCounterLogById">>(
      `/tblCompCounterLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompCounterLog">) =>
    api.delete<DynamicResponse<"deleteTblCompCounterLog">>(
      "/tblCompCounterLog",
      { params: query }
    ),
};

export type TypeTblCompJob = DynamicResponse<"getTblCompJob">["items"][0];
export const tblCompJob = {
  getAll: (query?: DynamicQuery<"getTblCompJob">) =>
    api.get<DynamicResponse<"getTblCompJob">>("/tblCompJob", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblCompJobById">) =>
    api.get<DynamicResponse<"getTblCompJobById">>(`/tblCompJob/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompJobCount">) =>
    api.get<DynamicResponse<"getTblCompJobCount">>("/tblCompJob/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblCompJob">) =>
    api.post<DynamicResponse<"postTblCompJob">>("/tblCompJob", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompJobById">) =>
    api.put<DynamicResponse<"putTblCompJobById">>(`/tblCompJob/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompJobById">) =>
    api.delete<DynamicResponse<"deleteTblCompJobById">>(`/tblCompJob/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJob">) =>
    api.delete<DynamicResponse<"deleteTblCompJob">>("/tblCompJob", {
      params: query,
    }),
};

export type TypeTblCompJobCounter =
  DynamicResponse<"getTblCompJobCounter">["items"][0];
export const tblCompJobCounter = {
  getAll: (query?: DynamicQuery<"getTblCompJobCounter">) =>
    api.get<DynamicResponse<"getTblCompJobCounter">>("/tblCompJobCounter", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompJobCounterById">) =>
    api.get<DynamicResponse<"getTblCompJobCounterById">>(
      `/tblCompJobCounter/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompJobCounter">) =>
    api.get<DynamicResponse<"getTblCompJobCounter">>(
      "/tblCompJobCounter/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompJobCounter">) =>
    api.post<DynamicResponse<"postTblCompJobCounter">>("/tblCompJobCounter", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompJobCounterById">) =>
    api.put<DynamicResponse<"putTblCompJobCounterById">>(
      `/tblCompJobCounter/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobCounterById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobCounterById">>(
      `/tblCompJobCounter/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompJobCounter">>(
      "/tblCompJobCounter",
      { params: query }
    ),
};

export type TypeTblCompJobDependency =
  DynamicResponse<"getTblCompJobDependency">["items"][0];
export const tblCompJobDependency = {
  getAll: (query?: DynamicQuery<"getTblCompJobDependency">) =>
    api.get<DynamicResponse<"getTblCompJobDependency">>(
      "/tblCompJobDependency",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getTblCompJobDependencyById">) =>
    api.get<DynamicResponse<"getTblCompJobDependencyById">>(
      `/tblCompJobDependency/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompJobDependencyCount">) =>
    api.get<DynamicResponse<"getTblCompJobDependencyCount">>(
      "/tblCompJobDependency/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompJobDependency">) =>
    api.post<DynamicResponse<"postTblCompJobDependency">>(
      "/tblCompJobDependency",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompJobDependencyById">) =>
    api.put<DynamicResponse<"putTblCompJobDependencyById">>(
      `/tblCompJobDependency/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobDependencyById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobDependencyById">>(
      `/tblCompJobDependency/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobDependency">) =>
    api.delete<DynamicResponse<"deleteTblCompJobDependency">>(
      "/tblCompJobDependency",
      { params: query }
    ),
};

export type TypeTblCompJobMeasurePoint =
  DynamicResponse<"getTblCompJobMeasurePoint">["items"][0];
export const tblCompJobMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompJobMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompJobMeasurePoint">>(
      "/tblCompJobMeasurePoint",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompJobMeasurePointById">
  ) =>
    api.get<DynamicResponse<"getTblCompJobMeasurePointById">>(
      `/tblCompJobMeasurePoint/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompJobMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompJobMeasurePointCount">>(
      "/tblCompJobMeasurePoint/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompJobMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompJobMeasurePoint">>(
      "/tblCompJobMeasurePoint",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompJobMeasurePointById">) =>
    api.put<DynamicResponse<"putTblCompJobMeasurePointById">>(
      `/tblCompJobMeasurePoint/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobMeasurePointById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobMeasurePointById">>(
      `/tblCompJobMeasurePoint/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompJobMeasurePoint">>(
      "/tblCompJobMeasurePoint",
      { params: query }
    ),
};

export type TypeTblCompJobRelation =
  DynamicResponse<"getTblCompJobRelation">["items"][0];
export const tblCompJobRelation = {
  getAll: (query?: DynamicQuery<"getTblCompJobRelation">) =>
    api.get<DynamicResponse<"getTblCompJobRelation">>("/tblCompJobRelation", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompJobRelationById">) =>
    api.get<DynamicResponse<"getTblCompJobRelationById">>(
      `/tblCompJobRelation/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompJobRelationCount">) =>
    api.get<DynamicResponse<"getTblCompJobRelationCount">>(
      "/tblCompJobRelation/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompJobRelation">) =>
    api.post<DynamicResponse<"postTblCompJobRelation">>("/tblCompJobRelation", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompJobRelationById">) =>
    api.put<DynamicResponse<"putTblCompJobRelationById">>(
      `/tblCompJobRelation/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobRelationById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobRelationById">>(
      `/tblCompJobRelation/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobRelation">) =>
    api.delete<DynamicResponse<"deleteTblCompJobRelation">>(
      "/tblCompJobRelation",
      { params: query }
    ),
};

export type TypeTblCompJobTrigger =
  DynamicResponse<"getTblCompJobTrigger">["items"][0];
export const tblCompJobTrigger = {
  getAll: (query?: DynamicQuery<"getTblCompJobTrigger">) =>
    api.get<DynamicResponse<"getTblCompJobTrigger">>("/tblCompJobTrigger", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompJobTriggerById">) =>
    api.get<DynamicResponse<"getTblCompJobTriggerById">>(
      `/tblCompJobTrigger/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompJobTriggerCount">) =>
    api.get<DynamicResponse<"getTblCompJobTriggerCount">>(
      "/tblCompJobTrigger/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompJobTrigger">) =>
    api.post<DynamicResponse<"postTblCompJobTrigger">>("/tblCompJobTrigger", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompJobTriggerById">) =>
    api.put<DynamicResponse<"putTblCompJobTriggerById">>(
      `/tblCompJobTrigger/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompJobTriggerById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompJobTriggerById">>(
      `/tblCompJobTrigger/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompJobTrigger">) =>
    api.delete<DynamicResponse<"deleteTblCompJobTrigger">>(
      "/tblCompJobTrigger",
      { params: query }
    ),
};

export type TypeTblCompMeasurePoint =
  DynamicResponse<"getTblCompMeasurePoint">["items"][0];
export const tblCompMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompMeasurePoint">>("/tblCompMeasurePoint", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompMeasurePointById">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointById">>(
      `/tblCompMeasurePoint/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointCount">>(
      "/tblCompMeasurePoint/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompMeasurePoint">>(
      "/tblCompMeasurePoint",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompMeasurePointById">) =>
    api.put<DynamicResponse<"putTblCompMeasurePointById">>(
      `/tblCompMeasurePoint/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompMeasurePointById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompMeasurePointById">>(
      `/tblCompMeasurePoint/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompMeasurePoint">>(
      "/tblCompMeasurePoint",
      { params: query }
    ),
};

export type TypeTblCompMeasurePointLog =
  DynamicResponse<"getTblCompMeasurePointLog">["items"][0];
export const tblCompMeasurePointLog = {
  getAll: (query?: DynamicQuery<"getTblCompMeasurePointLog">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointLog">>(
      "/tblCompMeasurePointLog",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompMeasurePointLogById">
  ) =>
    api.get<DynamicResponse<"getTblCompMeasurePointLogById">>(
      `/tblCompMeasurePointLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompMeasurePointLogCount">) =>
    api.get<DynamicResponse<"getTblCompMeasurePointLogCount">>(
      "/tblCompMeasurePointLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompMeasurePointLog">) =>
    api.post<DynamicResponse<"postTblCompMeasurePointLog">>(
      "/tblCompMeasurePointLog",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompMeasurePointLogById">) =>
    api.put<DynamicResponse<"putTblCompMeasurePointLogById">>(
      `/tblCompMeasurePointLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompMeasurePointLogById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompMeasurePointLogById">>(
      `/tblCompMeasurePointLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompMeasurePointLog">) =>
    api.delete<DynamicResponse<"deleteTblCompMeasurePointLog">>(
      "/tblCompMeasurePointLog",
      { params: query }
    ),
};

export type TypeTblCompOilInfo =
  DynamicResponse<"getTblCompOilInfo">["items"][0];
export const tblCompOilInfo = {
  getAll: (query?: DynamicQuery<"getTblCompOilInfo">) =>
    api.get<DynamicResponse<"getTblCompOilInfo">>("/tblCompOilInfo", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompOilInfoById">) =>
    api.get<DynamicResponse<"getTblCompOilInfoById">>(`/tblCompOilInfo/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompOilInfoCount">) =>
    api.get<DynamicResponse<"getTblCompOilInfoCount">>(
      "/tblCompOilInfo/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompOilInfo">) =>
    api.post<DynamicResponse<"postTblCompOilInfo">>("/tblCompOilInfo", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompOilInfoById">) =>
    api.put<DynamicResponse<"putTblCompOilInfoById">>(`/tblCompOilInfo/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompOilInfoById">) =>
    api.delete<DynamicResponse<"deleteTblCompOilInfoById">>(
      `/tblCompOilInfo/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompOilInfo">) =>
    api.delete<DynamicResponse<"deleteTblCompOilInfo">>("/tblCompOilInfo", {
      params: query,
    }),
};

export type TypeTblCompSpare = DynamicResponse<"getTblCompSpare">["items"][0];
export const tblCompSpare = {
  getAll: (query?: DynamicQuery<"getTblCompSpare">) =>
    api.get<DynamicResponse<"getTblCompSpare">>("/tblCompSpare", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompSpareById">) =>
    api.get<DynamicResponse<"getTblCompSpareById">>(`/tblCompSpare/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompSpareCount">) =>
    api.get<DynamicResponse<"getTblCompSpareCount">>("/tblCompSpare/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblCompSpare">) =>
    api.post<DynamicResponse<"postTblCompSpare">>("/tblCompSpare", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompSpareById">) =>
    api.put<DynamicResponse<"putTblCompSpareById">>(`/tblCompSpare/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompSpareById">) =>
    api.delete<DynamicResponse<"deleteTblCompSpareById">>(
      `/tblCompSpare/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompSpare">) =>
    api.delete<DynamicResponse<"deleteTblCompSpare">>("/tblCompSpare", {
      params: query,
    }),
};

export type TypeTblCompSpareDetail =
  DynamicResponse<"getTblCompSpareDetail">["items"][0];
export const tblCompSpareDetail = {
  getAll: (query?: DynamicQuery<"getTblCompSpareDetail">) =>
    api.get<DynamicResponse<"getTblCompSpareDetail">>("/tblCompSpareDetail", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompSpareDetailById">) =>
    api.get<DynamicResponse<"getTblCompSpareDetailById">>(
      `/tblCompSpareDetail/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompSpareDetailCount">) =>
    api.get<DynamicResponse<"getTblCompSpareDetailCount">>(
      "/tblCompSpareDetail/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompSpareDetail">) =>
    api.post<DynamicResponse<"postTblCompSpareDetail">>("/tblCompSpareDetail", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompSpareDetailById">) =>
    api.put<DynamicResponse<"putTblCompSpareDetailById">>(
      `/tblCompSpareDetail/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompSpareDetailById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompSpareDetailById">>(
      `/tblCompSpareDetail/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompSpareDetail">) =>
    api.delete<DynamicResponse<"deleteTblCompSpareDetail">>(
      "/tblCompSpareDetail",
      { params: query }
    ),
};

export type TypeTblCompStatus = DynamicResponse<"getTblCompStatus">["items"][0];
export const tblCompStatus = {
  getAll: (query?: DynamicQuery<"getTblCompStatus">) =>
    api.get<DynamicResponse<"getTblCompStatus">>("/tblCompStatus", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompStatusById">) =>
    api.get<DynamicResponse<"getTblCompStatusById">>(`/tblCompStatus/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompStatusCount">) =>
    api.get<DynamicResponse<"getTblCompStatusCount">>("/tblCompStatus/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblCompStatus">) =>
    api.post<DynamicResponse<"postTblCompStatus">>("/tblCompStatus", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompStatusById">) =>
    api.put<DynamicResponse<"putTblCompStatusById">>(`/tblCompStatus/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompStatusById">) =>
    api.delete<DynamicResponse<"deleteTblCompStatusById">>(
      `/tblCompStatus/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompStatus">) =>
    api.delete<DynamicResponse<"deleteTblCompStatus">>("/tblCompStatus", {
      params: query,
    }),
};

export type TypeTblCompStatusLog =
  DynamicResponse<"getTblCompStatusLog">["items"][0];
export const tblCompStatusLog = {
  getAll: (query?: DynamicQuery<"getTblCompStatusLog">) =>
    api.get<DynamicResponse<"getTblCompStatusLog">>("/tblCompStatusLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompStatusLogById">) =>
    api.get<DynamicResponse<"getTblCompStatusLogById">>(
      `/tblCompStatusLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompStatusLogCount">) =>
    api.get<DynamicResponse<"getTblCompStatusLogCount">>(
      "/tblCompStatusLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompStatusLog">) =>
    api.post<DynamicResponse<"postTblCompStatusLog">>("/tblCompStatusLog", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompStatusLogById">) =>
    api.put<DynamicResponse<"putTblCompStatusLogById">>(
      `/tblCompStatusLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompStatusLogById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompStatusLogById">>(
      `/tblCompStatusLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompStatusLog">) =>
    api.delete<DynamicResponse<"deleteTblCompStatusLog">>("/tblCompStatusLog", {
      params: query,
    }),
};

export type TypeTblCompType = DynamicResponse<"getTblCompType">["items"][0];
export const tblCompType = {
  getAll: (query?: DynamicQuery<"getTblCompType">) =>
    api.get<DynamicResponse<"getTblCompType">>("/tblCompType", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeById">) =>
    api.get<DynamicResponse<"getTblCompTypeById">>(`/tblCompType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompTypeCount">) =>
    api.get<DynamicResponse<"getTblCompTypeCount">>("/tblCompType/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblCompType">) =>
    api.post<DynamicResponse<"postTblCompType">>("/tblCompType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeById">) =>
    api.put<DynamicResponse<"putTblCompTypeById">>(`/tblCompType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompTypeById">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeById">>(`/tblCompType/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblCompType">) =>
    api.delete<DynamicResponse<"deleteTblCompType">>("/tblCompType", {
      params: query,
    }),
};

export type TypeTblCompTypeCounter =
  DynamicResponse<"getTblCompTypeCounter">["items"][0];
export const tblCompTypeCounter = {
  getAll: (query?: DynamicQuery<"getTblCompTypeCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeCounter">>("/tblCompTypeCounter", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeCounterById">) =>
    api.get<DynamicResponse<"getTblCompTypeCounterById">>(
      `/tblCompTypeCounter/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeCounter">>(
      "/tblCompTypeCounter/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeCounter">) =>
    api.post<DynamicResponse<"postTblCompTypeCounter">>("/tblCompTypeCounter", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeCounterById">) =>
    api.put<DynamicResponse<"putTblCompTypeCounterById">>(
      `/tblCompTypeCounter/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeCounterById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeCounterById">>(
      `/tblCompTypeCounter/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeCounter">>(
      "/tblCompTypeCounter",
      { params: query }
    ),
};

export type TypeTblCompTypeJob =
  DynamicResponse<"getTblCompTypeJob">["items"][0];
export const tblCompTypeJob = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJob">) =>
    api.get<DynamicResponse<"getTblCompTypeJob">>("/tblCompTypeJob", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeJobById">) =>
    api.get<DynamicResponse<"getTblCompTypeJobById">>(`/tblCompTypeJob/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCompTypeJobCount">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCount">>(
      "/tblCompTypeJob/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeJob">) =>
    api.post<DynamicResponse<"postTblCompTypeJob">>("/tblCompTypeJob", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeJobById">) =>
    api.put<DynamicResponse<"putTblCompTypeJobById">>(`/tblCompTypeJob/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCompTypeJobById">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobById">>(
      `/tblCompTypeJob/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJob">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJob">>("/tblCompTypeJob", {
      params: query,
    }),
};

export type TypeTblCompTypeJobCounter =
  DynamicResponse<"getTblCompTypeJobCounter">["items"][0];
export const tblCompTypeJobCounter = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJobCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeJobCounterById">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCounterById">>(
      `/tblCompTypeJobCounter/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeJobCounter">) =>
    api.get<DynamicResponse<"getTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeJobCounter">) =>
    api.post<DynamicResponse<"postTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeJobCounterById">) =>
    api.put<DynamicResponse<"putTblCompTypeJobCounterById">>(
      `/tblCompTypeJobCounter/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobCounterById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobCounterById">>(
      `/tblCompTypeJobCounter/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJobCounter">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobCounter">>(
      "/tblCompTypeJobCounter",
      { params: query }
    ),
};

export type TypeTblCompTypeJobMeasurePoint =
  DynamicResponse<"getTblCompTypeJobMeasurePoint">["items"][0];
export const tblCompTypeJobMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJobMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompTypeJobMeasurePoint">>(
      "/tblCompTypeJobMeasurePoint",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeJobMeasurePointById">
  ) =>
    api.get<DynamicResponse<"getTblCompTypeJobMeasurePointById">>(
      `/tblCompTypeJobMeasurePoint/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeJobMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompTypeJobMeasurePointCount">>(
      "/tblCompTypeJobMeasurePoint/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeJobMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompTypeJobMeasurePoint">>(
      "/tblCompTypeJobMeasurePoint",
      { data }
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeJobMeasurePointById">
  ) =>
    api.put<DynamicResponse<"putTblCompTypeJobMeasurePointById">>(
      `/tblCompTypeJobMeasurePoint/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobMeasurePointById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobMeasurePointById">>(
      `/tblCompTypeJobMeasurePoint/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJobMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobMeasurePoint">>(
      "/tblCompTypeJobMeasurePoint",
      { params: query }
    ),
};

export type TypeTblCompTypeJobTrigger =
  DynamicResponse<"getTblCompTypeJobTrigger">["items"][0];
export const tblCompTypeJobTrigger = {
  getAll: (query?: DynamicQuery<"getTblCompTypeJobTrigger">) =>
    api.get<DynamicResponse<"getTblCompTypeJobTrigger">>(
      "/tblCompTypeJobTrigger",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeJobTriggerById">) =>
    api.get<DynamicResponse<"getTblCompTypeJobTriggerById">>(
      `/tblCompTypeJobTrigger/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeJobTriggerCount">) =>
    api.get<DynamicResponse<"getTblCompTypeJobTriggerCount">>(
      "/tblCompTypeJobTrigger/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeJobTrigger">) =>
    api.post<DynamicResponse<"postTblCompTypeJobTrigger">>(
      "/tblCompTypeJobTrigger",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeJobTriggerById">) =>
    api.put<DynamicResponse<"putTblCompTypeJobTriggerById">>(
      `/tblCompTypeJobTrigger/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeJobTriggerById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobTriggerById">>(
      `/tblCompTypeJobTrigger/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeJobTrigger">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeJobTrigger">>(
      "/tblCompTypeJobTrigger",
      { params: query }
    ),
};

export type TypeTblCompTypeMeasurePoint =
  DynamicResponse<"getTblCompTypeMeasurePoint">["items"][0];
export const tblCompTypeMeasurePoint = {
  getAll: (query?: DynamicQuery<"getTblCompTypeMeasurePoint">) =>
    api.get<DynamicResponse<"getTblCompTypeMeasurePoint">>(
      "/tblCompTypeMeasurePoint",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeMeasurePointById">
  ) =>
    api.get<DynamicResponse<"getTblCompTypeMeasurePointById">>(
      `/tblCompTypeMeasurePoint/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeMeasurePointCount">) =>
    api.get<DynamicResponse<"getTblCompTypeMeasurePointCount">>(
      "/tblCompTypeMeasurePoint/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeMeasurePoint">) =>
    api.post<DynamicResponse<"postTblCompTypeMeasurePoint">>(
      "/tblCompTypeMeasurePoint",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeMeasurePointById">) =>
    api.put<DynamicResponse<"putTblCompTypeMeasurePointById">>(
      `/tblCompTypeMeasurePoint/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeMeasurePointById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeMeasurePointById">>(
      `/tblCompTypeMeasurePoint/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeMeasurePoint">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeMeasurePoint">>(
      "/tblCompTypeMeasurePoint",
      { params: query }
    ),
};

export type TypeTblCompTypeRelation =
  DynamicResponse<"getTblCompTypeRelation">["items"][0];
export const tblCompTypeRelation = {
  getAll: (query?: DynamicQuery<"getTblCompTypeRelation">) =>
    api.get<DynamicResponse<"getTblCompTypeRelation">>("/tblCompTypeRelation", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCompTypeRelationById">) =>
    api.get<DynamicResponse<"getTblCompTypeRelationById">>(
      `/tblCompTypeRelation/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeRelationCount">) =>
    api.get<DynamicResponse<"getTblCompTypeRelationCount">>(
      "/tblCompTypeRelation/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeRelation">) =>
    api.post<DynamicResponse<"postTblCompTypeRelation">>(
      "/tblCompTypeRelation",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeRelationById">) =>
    api.put<DynamicResponse<"putTblCompTypeRelationById">>(
      `/tblCompTypeRelation/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeRelationById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeRelationById">>(
      `/tblCompTypeRelation/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeRelation">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeRelation">>(
      "/tblCompTypeRelation",
      { params: query }
    ),
};

export type TypeTblCompTypeRequiredDiscipline =
  DynamicResponse<"getTblCompTypeRequiredDiscipline">["items"][0];
export const tblCompTypeRequiredDiscipline = {
  getAll: (query?: DynamicQuery<"getTblCompTypeRequiredDiscipline">) =>
    api.get<DynamicResponse<"getTblCompTypeRequiredDiscipline">>(
      "/tblCompTypeRequiredDiscipline",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeRequiredDisciplineById">
  ) =>
    api.get<DynamicResponse<"getTblCompTypeRequiredDisciplineById">>(
      `/tblCompTypeRequiredDiscipline/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeRequiredDisciplineCount">) =>
    api.get<DynamicResponse<"getTblCompTypeRequiredDisciplineCount">>(
      "/tblCompTypeRequiredDiscipline/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeRequiredDiscipline">) =>
    api.post<DynamicResponse<"postTblCompTypeRequiredDiscipline">>(
      "/tblCompTypeRequiredDiscipline",
      { data }
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblCompTypeRequiredDisciplineById">
  ) =>
    api.put<DynamicResponse<"putTblCompTypeRequiredDisciplineById">>(
      `/tblCompTypeRequiredDiscipline/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeRequiredDisciplineById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeRequiredDisciplineById">>(
      `/tblCompTypeRequiredDiscipline/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeRequiredDiscipline">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeRequiredDiscipline">>(
      "/tblCompTypeRequiredDiscipline",
      { params: query }
    ),
};

export type TypeTblCompTypeRequiredPart =
  DynamicResponse<"getTblCompTypeRequiredPart">["items"][0];
export const tblCompTypeRequiredPart = {
  getAll: (query?: DynamicQuery<"getTblCompTypeRequiredPart">) =>
    api.get<DynamicResponse<"getTblCompTypeRequiredPart">>(
      "/tblCompTypeRequiredPart",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblCompTypeRequiredPartById">
  ) =>
    api.get<DynamicResponse<"getTblCompTypeRequiredPartById">>(
      `/tblCompTypeRequiredPart/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblCompTypeRequiredPartCount">) =>
    api.get<DynamicResponse<"getTblCompTypeRequiredPartCount">>(
      "/tblCompTypeRequiredPart/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblCompTypeRequiredPart">) =>
    api.post<DynamicResponse<"postTblCompTypeRequiredPart">>(
      "/tblCompTypeRequiredPart",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblCompTypeRequiredPartById">) =>
    api.put<DynamicResponse<"putTblCompTypeRequiredPartById">>(
      `/tblCompTypeRequiredPart/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblCompTypeRequiredPartById">
  ) =>
    api.delete<DynamicResponse<"deleteTblCompTypeRequiredPartById">>(
      `/tblCompTypeRequiredPart/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCompTypeRequiredPart">) =>
    api.delete<DynamicResponse<"deleteTblCompTypeRequiredPart">>(
      "/tblCompTypeRequiredPart",
      { params: query }
    ),
};

export type TypeTblComponentUnit =
  DynamicResponse<"getTblComponentUnit">["items"][0];
export const tblComponentUnit = {
  getAll: (query?: DynamicQuery<"getTblComponentUnit">) =>
    api.get<DynamicResponse<"getTblComponentUnit">>("/tblComponentUnit", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblComponentUnitById">) =>
    api.get<DynamicResponse<"getTblComponentUnitById">>(
      `/tblComponentUnit/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblComponentUnitCount">) =>
    api.get<DynamicResponse<"getTblComponentUnitCount">>(
      "/tblComponentUnit/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblComponentUnit">) =>
    api.post<DynamicResponse<"postTblComponentUnit">>("/tblComponentUnit", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblComponentUnitById">) =>
    api.put<DynamicResponse<"putTblComponentUnitById">>(
      `/tblComponentUnit/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblComponentUnitById">
  ) =>
    api.delete<DynamicResponse<"deleteTblComponentUnitById">>(
      `/tblComponentUnit/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblComponentUnit">) =>
    api.delete<DynamicResponse<"deleteTblComponentUnit">>("/tblComponentUnit", {
      params: query,
    }),
};

export type TypeTblCounterType =
  DynamicResponse<"getTblCounterType">["items"][0];
export const tblCounterType = {
  getAll: (query?: DynamicQuery<"getTblCounterType">) =>
    api.get<DynamicResponse<"getTblCounterType">>("/tblCounterType", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblCounterTypeById">) =>
    api.get<DynamicResponse<"getTblCounterTypeById">>(`/tblCounterType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblCounterType">) =>
    api.get<DynamicResponse<"getTblCounterType">>("/tblCounterType/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblCounterType">) =>
    api.post<DynamicResponse<"postTblCounterType">>("/tblCounterType", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblCounterTypeById">) =>
    api.put<DynamicResponse<"putTblCounterTypeById">>(`/tblCounterType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblCounterTypeById">) =>
    api.delete<DynamicResponse<"deleteTblCounterTypeById">>(
      `/tblCounterType/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblCounterType">) =>
    api.delete<DynamicResponse<"deleteTblCounterType">>("/tblCounterType", {
      params: query,
    }),
};

export type TypeTblDailyReorts =
  DynamicResponse<"getTblDailyReorts">["items"][0];
export const tblDailyReorts = {
  getAll: (query?: DynamicQuery<"getTblDailyReorts">) =>
    api.get<DynamicResponse<"getTblDailyReorts">>("/tblDailyReorts", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDailyReortsById">) =>
    api.get<DynamicResponse<"getTblDailyReortsById">>(`/tblDailyReorts/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblDailyReortsCount">) =>
    api.get<DynamicResponse<"getTblDailyReortsCount">>(
      "/tblDailyReorts/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblDailyReorts">) =>
    api.post<DynamicResponse<"postTblDailyReorts">>("/tblDailyReorts", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblDailyReortsById">) =>
    api.put<DynamicResponse<"putTblDailyReortsById">>(`/tblDailyReorts/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblDailyReortsById">) =>
    api.delete<DynamicResponse<"deleteTblDailyReortsById">>(
      `/tblDailyReorts/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDailyReorts">) =>
    api.delete<DynamicResponse<"deleteTblDailyReorts">>("/tblDailyReorts", {
      params: query,
    }),
};

export type TypeTblDailyReportConsumable =
  DynamicResponse<"getTblDailyReportConsumable">["items"][0];
export const tblDailyReportConsumable = {
  getAll: (query?: DynamicQuery<"getTblDailyReportConsumable">) =>
    api.get<DynamicResponse<"getTblDailyReportConsumable">>(
      "/tblDailyReportConsumable",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblDailyReportConsumableById">
  ) =>
    api.get<DynamicResponse<"getTblDailyReportConsumableById">>(
      `/tblDailyReportConsumable/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblDailyReportConsumableCount">) =>
    api.get<DynamicResponse<"getTblDailyReportConsumableCount">>(
      "/tblDailyReportConsumable/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblDailyReportConsumable">) =>
    api.post<DynamicResponse<"postTblDailyReportConsumable">>(
      "/tblDailyReportConsumable",
      { data }
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblDailyReportConsumableById">
  ) =>
    api.put<DynamicResponse<"putTblDailyReportConsumableById">>(
      `/tblDailyReportConsumable/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDailyReportConsumableById">
  ) =>
    api.delete<DynamicResponse<"deleteTblDailyReportConsumableById">>(
      `/tblDailyReportConsumable/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDailyReportConsumable">) =>
    api.delete<DynamicResponse<"deleteTblDailyReportConsumable">>(
      "/tblDailyReportConsumable",
      { params: query }
    ),
};

export type TypeTblDailyReportRequest =
  DynamicResponse<"getTblDailyReportRequest">["items"][0];
export const tblDailyReportRequest = {
  getAll: (query?: DynamicQuery<"getTblDailyReportRequest">) =>
    api.get<DynamicResponse<"getTblDailyReportRequest">>(
      "/tblDailyReportRequest",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getTblDailyReportRequestById">) =>
    api.get<DynamicResponse<"getTblDailyReportRequestById">>(
      `/tblDailyReportRequest/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblDailyReportRequestCount">) =>
    api.get<DynamicResponse<"getTblDailyReportRequestCount">>(
      "/tblDailyReportRequest/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblDailyReportRequest">) =>
    api.post<DynamicResponse<"postTblDailyReportRequest">>(
      "/tblDailyReportRequest",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblDailyReportRequestById">) =>
    api.put<DynamicResponse<"putTblDailyReportRequestById">>(
      `/tblDailyReportRequest/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDailyReportRequestById">
  ) =>
    api.delete<DynamicResponse<"deleteTblDailyReportRequestById">>(
      `/tblDailyReportRequest/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDailyReportRequest">) =>
    api.delete<DynamicResponse<"deleteTblDailyReportRequest">>(
      "/tblDailyReportRequest",
      { params: query }
    ),
};

export type TypeTblDashboardAlert =
  DynamicResponse<"getTblDashboardAlert">["items"][0];
export const tblDashboardAlert = {
  getAll: (query?: DynamicQuery<"getTblDashboardAlert">) =>
    api.get<DynamicResponse<"getTblDashboardAlert">>("/tblDashboardAlert", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDashboardAlertById">) =>
    api.get<DynamicResponse<"getTblDashboardAlertById">>(
      `/tblDashboardAlert/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblDashboardAlertCount">) =>
    api.get<DynamicResponse<"getTblDashboardAlertCount">>(
      "/tblDashboardAlert/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblDashboardAlert">) =>
    api.post<DynamicResponse<"postTblDashboardAlert">>("/tblDashboardAlert", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblDashboardAlertById">) =>
    api.put<DynamicResponse<"putTblDashboardAlertById">>(
      `/tblDashboardAlert/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDashboardAlertById">
  ) =>
    api.delete<DynamicResponse<"deleteTblDashboardAlertById">>(
      `/tblDashboardAlert/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDashboardAlert">) =>
    api.delete<DynamicResponse<"deleteTblDashboardAlert">>(
      "/tblDashboardAlert",
      { params: query }
    ),
};

export type TypeTblDashboardConfig =
  DynamicResponse<"getTblDashboardConfig">["items"][0];
export const tblDashboardConfig = {
  getAll: (query?: DynamicQuery<"getTblDashboardConfig">) =>
    api.get<DynamicResponse<"getTblDashboardConfig">>("/tblDashboardConfig", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDashboardConfigById">) =>
    api.get<DynamicResponse<"getTblDashboardConfigById">>(
      `/tblDashboardConfig/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblDashboardConfigCount">) =>
    api.get<DynamicResponse<"getTblDashboardConfigCount">>(
      "/tblDashboardConfig/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblDashboardConfig">) =>
    api.post<DynamicResponse<"postTblDashboardConfig">>("/tblDashboardConfig", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblDashboardConfigById">) =>
    api.put<DynamicResponse<"putTblDashboardConfigById">>(
      `/tblDashboardConfig/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDashboardConfigById">
  ) =>
    api.delete<DynamicResponse<"deleteTblDashboardConfigById">>(
      `/tblDashboardConfig/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDashboardConfig">) =>
    api.delete<DynamicResponse<"deleteTblDashboardConfig">>(
      "/tblDashboardConfig",
      { params: query }
    ),
};

export type TypeTblDefaultScreenConfig =
  DynamicResponse<"getTblDefaultScreenConfig">["items"][0];
export const tblDefaultScreenConfig = {
  getAll: (query?: DynamicQuery<"getTblDefaultScreenConfig">) =>
    api.get<DynamicResponse<"getTblDefaultScreenConfig">>(
      "/tblDefaultScreenConfig",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblDefaultScreenConfigById">
  ) =>
    api.get<DynamicResponse<"getTblDefaultScreenConfigById">>(
      `/tblDefaultScreenConfig/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblDefaultScreenConfigCount">) =>
    api.get<DynamicResponse<"getTblDefaultScreenConfigCount">>(
      "/tblDefaultScreenConfig/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblDefaultScreenConfig">) =>
    api.post<DynamicResponse<"postTblDefaultScreenConfig">>(
      "/tblDefaultScreenConfig",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblDefaultScreenConfigById">) =>
    api.put<DynamicResponse<"putTblDefaultScreenConfigById">>(
      `/tblDefaultScreenConfig/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblDefaultScreenConfigById">
  ) =>
    api.delete<DynamicResponse<"deleteTblDefaultScreenConfigById">>(
      `/tblDefaultScreenConfig/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDefaultScreenConfig">) =>
    api.delete<DynamicResponse<"deleteTblDefaultScreenConfig">>(
      "/tblDefaultScreenConfig",
      { params: query }
    ),
};

export type TypeTblDepartment = DynamicResponse<"getTblDepartment">["items"][0];
export const tblDepartment = {
  getAll: (query?: DynamicQuery<"getTblDepartment">) =>
    api.get<DynamicResponse<"getTblDepartment">>("/tblDepartment", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDepartmentById">) =>
    api.get<DynamicResponse<"getTblDepartmentById">>(`/tblDepartment/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblDepartmentCount">) =>
    api.get<DynamicResponse<"getTblDepartmentCount">>("/tblDepartment/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblDepartment">) =>
    api.post<DynamicResponse<"postTblDepartment">>("/tblDepartment", { data }),
  update: (id: number, data: DynamicUpdate<"putTblDepartmentById">) =>
    api.put<DynamicResponse<"putTblDepartmentById">>(`/tblDepartment/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblDepartmentById">) =>
    api.delete<DynamicResponse<"deleteTblDepartmentById">>(
      `/tblDepartment/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDepartment">) =>
    api.delete<DynamicResponse<"deleteTblDepartment">>("/tblDepartment", {
      params: query,
    }),
};

export type TypeTblDiscipline = DynamicResponse<"getTblDiscipline">["items"][0];
export const tblDiscipline = {
  getAll: (query?: DynamicQuery<"getTblDiscipline">) =>
    api.get<DynamicResponse<"getTblDiscipline">>("/tblDiscipline", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblDisciplineById">) =>
    api.get<DynamicResponse<"getTblDisciplineById">>(`/tblDiscipline/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblDisciplineCount">) =>
    api.get<DynamicResponse<"getTblDisciplineCount">>("/tblDiscipline/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblDiscipline">) =>
    api.post<DynamicResponse<"postTblDiscipline">>("/tblDiscipline", { data }),
  update: (id: number, data: DynamicUpdate<"putTblDisciplineById">) =>
    api.put<DynamicResponse<"putTblDisciplineById">>(`/tblDiscipline/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblDisciplineById">) =>
    api.delete<DynamicResponse<"deleteTblDisciplineById">>(
      `/tblDiscipline/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblDiscipline">) =>
    api.delete<DynamicResponse<"deleteTblDiscipline">>("/tblDiscipline", {
      params: query,
    }),
};

export type TypeTblDocType = DynamicResponse<"getTblDocType">["items"][0];
export const tblDocType = {
  getAll: (query?: DynamicQuery<"getTblDocType">) =>
    api.get<DynamicResponse<"getTblDocType">>("/tblDocType", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblDocTypeById">) =>
    api.get<DynamicResponse<"getTblDocTypeById">>(`/tblDocType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblDocTypeCount">) =>
    api.get<DynamicResponse<"getTblDocTypeCount">>("/tblDocType/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblDocType">) =>
    api.post<DynamicResponse<"postTblDocType">>("/tblDocType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblDocTypeById">) =>
    api.put<DynamicResponse<"putTblDocTypeById">>(`/tblDocType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblDocTypeById">) =>
    api.delete<DynamicResponse<"deleteTblDocTypeById">>(`/tblDocType/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblDocType">) =>
    api.delete<DynamicResponse<"deleteTblDocType">>("/tblDocType", {
      params: query,
    }),
};

export type TypeTblEmployee = DynamicResponse<"getTblEmployee">["items"][0];
export const tblEmployee = {
  getAll: (query?: DynamicQuery<"getTblEmployee">) =>
    api.get<DynamicResponse<"getTblEmployee">>("/tblEmployee", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblEmployeeById">) =>
    api.get<DynamicResponse<"getTblEmployeeById">>(`/tblEmployee/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblEmployeeCount">) =>
    api.get<DynamicResponse<"getTblEmployeeCount">>("/tblEmployee/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblEmployee">) =>
    api.post<DynamicResponse<"postTblEmployee">>("/tblEmployee", { data }),
  update: (id: number, data: DynamicUpdate<"putTblEmployeeById">) =>
    api.put<DynamicResponse<"putTblEmployeeById">>(`/tblEmployee/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblEmployeeById">) =>
    api.delete<DynamicResponse<"deleteTblEmployeeById">>(`/tblEmployee/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblEmployee">) =>
    api.delete<DynamicResponse<"deleteTblEmployee">>("/tblEmployee", {
      params: query,
    }),
};

export type TypeTblFailureReports =
  DynamicResponse<"getTblFailureReports">["items"][0];
export const tblFailureReports = {
  getAll: (query?: DynamicQuery<"getTblFailureReports">) =>
    api.get<DynamicResponse<"getTblFailureReports">>("/tblFailureReports", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblFailureReportsById">) =>
    api.get<DynamicResponse<"getTblFailureReportsById">>(
      `/tblFailureReports/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblFailureReportsCount">) =>
    api.get<DynamicResponse<"getTblFailureReportsCount">>(
      "/tblFailureReports/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblFailureReports">) =>
    api.post<DynamicResponse<"postTblFailureReports">>("/tblFailureReports", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblFailureReportsById">) =>
    api.put<DynamicResponse<"putTblFailureReportsById">>(
      `/tblFailureReports/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblFailureReportsById">
  ) =>
    api.delete<DynamicResponse<"deleteTblFailureReportsById">>(
      `/tblFailureReports/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFailureReports">) =>
    api.delete<DynamicResponse<"deleteTblFailureReports">>(
      "/tblFailureReports",
      { params: query }
    ),
};

export type TypeTblFiltersInfo =
  DynamicResponse<"getTblFiltersInfo">["items"][0];
export const tblFiltersInfo = {
  getAll: (query?: DynamicQuery<"getTblFiltersInfo">) =>
    api.get<DynamicResponse<"getTblFiltersInfo">>("/tblFiltersInfo", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblFiltersInfoById">) =>
    api.get<DynamicResponse<"getTblFiltersInfoById">>(`/tblFiltersInfo/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblFiltersInfoCount">) =>
    api.get<DynamicResponse<"getTblFiltersInfoCount">>(
      "/tblFiltersInfo/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblFiltersInfo">) =>
    api.post<DynamicResponse<"postTblFiltersInfo">>("/tblFiltersInfo", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblFiltersInfoById">) =>
    api.put<DynamicResponse<"putTblFiltersInfoById">>(`/tblFiltersInfo/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblFiltersInfoById">) =>
    api.delete<DynamicResponse<"deleteTblFiltersInfoById">>(
      `/tblFiltersInfo/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFiltersInfo">) =>
    api.delete<DynamicResponse<"deleteTblFiltersInfo">>("/tblFiltersInfo", {
      params: query,
    }),
};

export type TypeTblFollowStatus =
  DynamicResponse<"getTblFollowStatus">["items"][0];
export const tblFollowStatus = {
  getAll: (query?: DynamicQuery<"getTblFollowStatus">) =>
    api.get<DynamicResponse<"getTblFollowStatus">>("/tblFollowStatus", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblFollowStatusById">) =>
    api.get<DynamicResponse<"getTblFollowStatusById">>(
      `/tblFollowStatus/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblFollowStatusCount">) =>
    api.get<DynamicResponse<"getTblFollowStatusCount">>(
      "/tblFollowStatus/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblFollowStatus">) =>
    api.post<DynamicResponse<"postTblFollowStatus">>("/tblFollowStatus", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblFollowStatusById">) =>
    api.put<DynamicResponse<"putTblFollowStatusById">>(
      `/tblFollowStatus/${id}`,
      { data }
    ),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblFollowStatusById">) =>
    api.delete<DynamicResponse<"deleteTblFollowStatusById">>(
      `/tblFollowStatus/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFollowStatus">) =>
    api.delete<DynamicResponse<"deleteTblFollowStatus">>("/tblFollowStatus", {
      params: query,
    }),
};

export type TypeTblFunctions = DynamicResponse<"getTblFunctions">["items"][0];
export const tblFunctions = {
  getAll: (query?: DynamicQuery<"getTblFunctions">) =>
    api.get<DynamicResponse<"getTblFunctions">>("/tblFunctions", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblFunctionsById">) =>
    api.get<DynamicResponse<"getTblFunctionsById">>(`/tblFunctions/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblFunctionsCount">) =>
    api.get<DynamicResponse<"getTblFunctionsCount">>("/tblFunctions/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblFunctions">) =>
    api.post<DynamicResponse<"postTblFunctions">>("/tblFunctions", { data }),
  update: (id: number, data: DynamicUpdate<"putTblFunctionsById">) =>
    api.put<DynamicResponse<"putTblFunctionsById">>(`/tblFunctions/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblFunctionsById">) =>
    api.delete<DynamicResponse<"deleteTblFunctionsById">>(
      `/tblFunctions/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblFunctions">) =>
    api.delete<DynamicResponse<"deleteTblFunctions">>("/tblFunctions", {
      params: query,
    }),
};

export type TypeTblJobClass = DynamicResponse<"getTblJobClass">["items"][0];
export const tblJobClass = {
  getAll: (query?: DynamicQuery<"getTblJobClass">) =>
    api.get<DynamicResponse<"getTblJobClass">>("/tblJobClass", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobClassById">) =>
    api.get<DynamicResponse<"getTblJobClassById">>(`/tblJobClass/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblJobClassCount">) =>
    api.get<DynamicResponse<"getTblJobClassCount">>("/tblJobClass/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblJobClass">) =>
    api.post<DynamicResponse<"postTblJobClass">>("/tblJobClass", { data }),
  update: (id: number, data: DynamicUpdate<"putTblJobClassById">) =>
    api.put<DynamicResponse<"putTblJobClassById">>(`/tblJobClass/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblJobClassById">) =>
    api.delete<DynamicResponse<"deleteTblJobClassById">>(`/tblJobClass/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblJobClass">) =>
    api.delete<DynamicResponse<"deleteTblJobClass">>("/tblJobClass", {
      params: query,
    }),
};

export type TypeTblJobClassAccess =
  DynamicResponse<"getTblJobClassAccess">["items"][0];
export const tblJobClassAccess = {
  getAll: (query?: DynamicQuery<"getTblJobClassAccess">) =>
    api.get<DynamicResponse<"getTblJobClassAccess">>("/tblJobClassAccess", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobClassAccessById">) =>
    api.get<DynamicResponse<"getTblJobClassAccessById">>(
      `/tblJobClassAccess/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblJobClassAccessCount">) =>
    api.get<DynamicResponse<"getTblJobClassAccessCount">>(
      "/tblJobClassAccess/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblJobClassAccess">) =>
    api.post<DynamicResponse<"postTblJobClassAccess">>("/tblJobClassAccess", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblJobClassAccessById">) =>
    api.put<DynamicResponse<"putTblJobClassAccessById">>(
      `/tblJobClassAccess/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobClassAccessById">
  ) =>
    api.delete<DynamicResponse<"deleteTblJobClassAccessById">>(
      `/tblJobClassAccess/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobClassAccess">) =>
    api.delete<DynamicResponse<"deleteTblJobClassAccess">>(
      "/tblJobClassAccess",
      { params: query }
    ),
};

export type TypeTblJobDescription =
  DynamicResponse<"getTblJobDescription">["items"][0];
export const tblJobDescription = {
  getAll: (query?: DynamicQuery<"getTblJobDescription">) =>
    api.get<DynamicResponse<"getTblJobDescription">>("/tblJobDescription", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobDescriptionById">) =>
    api.get<DynamicResponse<"getTblJobDescriptionById">>(
      `/tblJobDescription/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblJobDescriptionCount">) =>
    api.get<DynamicResponse<"getTblJobDescriptionCount">>(
      "/tblJobDescription/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblJobDescription">) =>
    api.post<DynamicResponse<"postTblJobDescription">>("/tblJobDescription", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblJobDescriptionById">) =>
    api.put<DynamicResponse<"putTblJobDescriptionById">>(
      `/tblJobDescription/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobDescriptionById">
  ) =>
    api.delete<DynamicResponse<"deleteTblJobDescriptionById">>(
      `/tblJobDescription/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobDescription">) =>
    api.delete<DynamicResponse<"deleteTblJobDescription">>(
      "/tblJobDescription",
      { params: query }
    ),
};

export type TypeTblJobTrigger = DynamicResponse<"getTblJobTrigger">["items"][0];
export const tblJobTrigger = {
  getAll: (query?: DynamicQuery<"getTblJobTrigger">) =>
    api.get<DynamicResponse<"getTblJobTrigger">>("/tblJobTrigger", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobTriggerById">) =>
    api.get<DynamicResponse<"getTblJobTriggerById">>(`/tblJobTrigger/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblJobTriggerCount">) =>
    api.get<DynamicResponse<"getTblJobTriggerCount">>("/tblJobTrigger/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblJobTrigger">) =>
    api.post<DynamicResponse<"postTblJobTrigger">>("/tblJobTrigger", { data }),
  update: (id: number, data: DynamicUpdate<"putTblJobTriggerById">) =>
    api.put<DynamicResponse<"putTblJobTriggerById">>(`/tblJobTrigger/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblJobTriggerById">) =>
    api.delete<DynamicResponse<"deleteTblJobTriggerById">>(
      `/tblJobTrigger/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobTrigger">) =>
    api.delete<DynamicResponse<"deleteTblJobTrigger">>("/tblJobTrigger", {
      params: query,
    }),
};

export type TypeTblJobTriggerLog =
  DynamicResponse<"getTblJobTriggerLog">["items"][0];
export const tblJobTriggerLog = {
  getAll: (query?: DynamicQuery<"getTblJobTriggerLog">) =>
    api.get<DynamicResponse<"getTblJobTriggerLog">>("/tblJobTriggerLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobTriggerLogById">) =>
    api.get<DynamicResponse<"getTblJobTriggerLogById">>(
      `/tblJobTriggerLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblJobTriggerLogCount">) =>
    api.get<DynamicResponse<"getTblJobTriggerLogCount">>(
      "/tblJobTriggerLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblJobTriggerLog">) =>
    api.post<DynamicResponse<"postTblJobTriggerLog">>("/tblJobTriggerLog", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblJobTriggerLogById">) =>
    api.put<DynamicResponse<"putTblJobTriggerLogById">>(
      `/tblJobTriggerLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblJobTriggerLogById">
  ) =>
    api.delete<DynamicResponse<"deleteTblJobTriggerLogById">>(
      `/tblJobTriggerLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobTriggerLog">) =>
    api.delete<DynamicResponse<"deleteTblJobTriggerLog">>("/tblJobTriggerLog", {
      params: query,
    }),
};

export type TypeTblJobVersion = DynamicResponse<"getTblJobVersion">["items"][0];
export const tblJobVersion = {
  getAll: (query?: DynamicQuery<"getTblJobVersion">) =>
    api.get<DynamicResponse<"getTblJobVersion">>("/tblJobVersion", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblJobVersionById">) =>
    api.get<DynamicResponse<"getTblJobVersionById">>(`/tblJobVersion/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblJobVersionCount">) =>
    api.get<DynamicResponse<"getTblJobVersionCount">>("/tblJobVersion/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblJobVersion">) =>
    api.post<DynamicResponse<"postTblJobVersion">>("/tblJobVersion", { data }),
  update: (id: number, data: DynamicUpdate<"putTblJobVersionById">) =>
    api.put<DynamicResponse<"putTblJobVersionById">>(`/tblJobVersion/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblJobVersionById">) =>
    api.delete<DynamicResponse<"deleteTblJobVersionById">>(
      `/tblJobVersion/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblJobVersion">) =>
    api.delete<DynamicResponse<"deleteTblJobVersion">>("/tblJobVersion", {
      params: query,
    }),
};

export type TypeTblLocation = DynamicResponse<"getTblLocation">["items"][0];
export const tblLocation = {
  getAll: (query?: DynamicQuery<"getTblLocation">) =>
    api.get<DynamicResponse<"getTblLocation">>("/tblLocation", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblLocationByLocationId">) =>
    api.get<DynamicResponse<"getTblLocationByLocationId">>(
      `/tblLocation/${id}`,
      {
        params: query,
      }
    ),
  count: (query?: DynamicQuery<"getTblLocationCount">) =>
    api.get<DynamicResponse<"getTblLocationCount">>("/tblLocation/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblLocation">) =>
    api.post<DynamicResponse<"postTblLocation">>("/tblLocation", { data }),
  update: (id: number, data: DynamicUpdate<"putTblLocationByLocationId">) =>
    api.put<DynamicResponse<"putTblLocationByLocationId">>(
      `/tblLocation/${id}`,
      {
        data,
      }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblLocationByLocationId">
  ) =>
    api.delete<DynamicResponse<"deleteTblLocationByLocationId">>(
      `/tblLocation/${id}`,
      {
        params: query,
      }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLocation">) =>
    api.delete<DynamicResponse<"deleteTblLocation">>("/tblLocation", {
      params: query,
    }),
};

export type TypeTblLogCounter = DynamicResponse<"getTblLogCounter">["items"][0];
export const tblLogCounter = {
  getAll: (query?: DynamicQuery<"getTblLogCounter">) =>
    api.get<DynamicResponse<"getTblLogCounter">>("/tblLogCounter", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblLogCounterById">) =>
    api.get<DynamicResponse<"getTblLogCounterById">>(`/tblLogCounter/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblLogCounter">) =>
    api.get<DynamicResponse<"getTblLogCounter">>("/tblLogCounter/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblLogCounter">) =>
    api.post<DynamicResponse<"postTblLogCounter">>("/tblLogCounter", { data }),
  update: (id: number, data: DynamicUpdate<"putTblLogCounterById">) =>
    api.put<DynamicResponse<"putTblLogCounterById">>(`/tblLogCounter/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblLogCounterById">) =>
    api.delete<DynamicResponse<"deleteTblLogCounterById">>(
      `/tblLogCounter/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLogCounter">) =>
    api.delete<DynamicResponse<"deleteTblLogCounter">>("/tblLogCounter", {
      params: query,
    }),
};

export type TypeTblLogDiscipline =
  DynamicResponse<"getTblLogDiscipline">["items"][0];
export const tblLogDiscipline = {
  getAll: (query?: DynamicQuery<"getTblLogDiscipline">) =>
    api.get<DynamicResponse<"getTblLogDiscipline">>("/tblLogDiscipline", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblLogDisciplineById">) =>
    api.get<DynamicResponse<"getTblLogDisciplineById">>(
      `/tblLogDiscipline/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblLogDisciplineCount">) =>
    api.get<DynamicResponse<"getTblLogDisciplineCount">>(
      "/tblLogDiscipline/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblLogDiscipline">) =>
    api.post<DynamicResponse<"postTblLogDiscipline">>("/tblLogDiscipline", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblLogDisciplineById">) =>
    api.put<DynamicResponse<"putTblLogDisciplineById">>(
      `/tblLogDiscipline/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblLogDisciplineById">
  ) =>
    api.delete<DynamicResponse<"deleteTblLogDisciplineById">>(
      `/tblLogDiscipline/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLogDiscipline">) =>
    api.delete<DynamicResponse<"deleteTblLogDiscipline">>("/tblLogDiscipline", {
      params: query,
    }),
};

export type TypeTblLoginAudit = DynamicResponse<"getTblLoginAudit">["items"][0];
export const tblLoginAudit = {
  getAll: (query?: DynamicQuery<"getTblLoginAudit">) =>
    api.get<DynamicResponse<"getTblLoginAudit">>("/tblLoginAudit", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblLoginAuditById">) =>
    api.get<DynamicResponse<"getTblLoginAuditById">>(`/tblLoginAudit/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblLoginAuditCount">) =>
    api.get<DynamicResponse<"getTblLoginAuditCount">>("/tblLoginAudit/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblLoginAudit">) =>
    api.post<DynamicResponse<"postTblLoginAudit">>("/tblLoginAudit", { data }),
  update: (id: number, data: DynamicUpdate<"putTblLoginAuditById">) =>
    api.put<DynamicResponse<"putTblLoginAuditById">>(`/tblLoginAudit/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblLoginAuditById">) =>
    api.delete<DynamicResponse<"deleteTblLoginAuditById">>(
      `/tblLoginAudit/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblLoginAudit">) =>
    api.delete<DynamicResponse<"deleteTblLoginAudit">>("/tblLoginAudit", {
      params: query,
    }),
};

export type TypeTblMaintCause = DynamicResponse<"getTblMaintCause">["items"][0];
export const tblMaintCause = {
  getAll: (query?: DynamicQuery<"getTblMaintCause">) =>
    api.get<DynamicResponse<"getTblMaintCause">>("/tblMaintCause", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintCauseById">) =>
    api.get<DynamicResponse<"getTblMaintCauseById">>(`/tblMaintCause/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblMaintCauseCount">) =>
    api.get<DynamicResponse<"getTblMaintCauseCount">>("/tblMaintCause/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblMaintCause">) =>
    api.post<DynamicResponse<"postTblMaintCause">>("/tblMaintCause", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintCauseById">) =>
    api.put<DynamicResponse<"putTblMaintCauseById">>(`/tblMaintCause/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblMaintCauseById">) =>
    api.delete<DynamicResponse<"deleteTblMaintCauseById">>(
      `/tblMaintCause/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintCause">) =>
    api.delete<DynamicResponse<"deleteTblMaintCause">>("/tblMaintCause", {
      params: query,
    }),
};

export type TypeTblMaintClass = DynamicResponse<"getTblMaintClass">["items"][0];
export const tblMaintClass = {
  getAll: (query?: DynamicQuery<"getTblMaintClass">) =>
    api.get<DynamicResponse<"getTblMaintClass">>("/tblMaintClass", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintClassById">) =>
    api.get<DynamicResponse<"getTblMaintClassById">>(`/tblMaintClass/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblMaintClassCount">) =>
    api.get<DynamicResponse<"getTblMaintClassCount">>("/tblMaintClass/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblMaintClass">) =>
    api.post<DynamicResponse<"postTblMaintClass">>("/tblMaintClass", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintClassById">) =>
    api.put<DynamicResponse<"putTblMaintClassById">>(`/tblMaintClass/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblMaintClassById">) =>
    api.delete<DynamicResponse<"deleteTblMaintClassById">>(
      `/tblMaintClass/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintClass">) =>
    api.delete<DynamicResponse<"deleteTblMaintClass">>("/tblMaintClass", {
      params: query,
    }),
};

export type TypeTblMaintLog = DynamicResponse<"getTblMaintLog">["items"][0];
export const tblMaintLog = {
  getAll: (query?: DynamicQuery<"getTblMaintLog">) =>
    api.get<DynamicResponse<"getTblMaintLog">>("/tblMaintLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintLogById">) =>
    api.get<DynamicResponse<"getTblMaintLogById">>(`/tblMaintLog/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblMaintLogCount">) =>
    api.get<DynamicResponse<"getTblMaintLogCount">>("/tblMaintLog/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblMaintLog">) =>
    api.post<DynamicResponse<"postTblMaintLog">>("/tblMaintLog", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintLogById">) =>
    api.put<DynamicResponse<"putTblMaintLogById">>(`/tblMaintLog/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblMaintLogById">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogById">>(`/tblMaintLog/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLog">) =>
    api.delete<DynamicResponse<"deleteTblMaintLog">>("/tblMaintLog", {
      params: query,
    }),
};

export type TypeTblMaintLogArchive =
  DynamicResponse<"getTblMaintLogArchive">["items"][0];
export const tblMaintLogArchive = {
  getAll: (query?: DynamicQuery<"getTblMaintLogArchive">) =>
    api.get<DynamicResponse<"getTblMaintLogArchive">>("/tblMaintLogArchive", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintLogArchiveById">) =>
    api.get<DynamicResponse<"getTblMaintLogArchiveById">>(
      `/tblMaintLogArchive/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblMaintLogArchiveCount">) =>
    api.get<DynamicResponse<"getTblMaintLogArchiveCount">>(
      "/tblMaintLogArchive/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblMaintLogArchive">) =>
    api.post<DynamicResponse<"postTblMaintLogArchive">>("/tblMaintLogArchive", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblMaintLogArchiveById">) =>
    api.put<DynamicResponse<"putTblMaintLogArchiveById">>(
      `/tblMaintLogArchive/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogArchiveById">
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintLogArchiveById">>(
      `/tblMaintLogArchive/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLogArchive">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogArchive">>(
      "/tblMaintLogArchive",
      { params: query }
    ),
};

export type TypeTblMaintLogFollow =
  DynamicResponse<"getTblMaintLogFollow">["items"][0];
export const tblMaintLogFollow = {
  getAll: (query?: DynamicQuery<"getTblMaintLogFollow">) =>
    api.get<DynamicResponse<"getTblMaintLogFollow">>("/tblMaintLogFollow", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintLogFollowById">) =>
    api.get<DynamicResponse<"getTblMaintLogFollowById">>(
      `/tblMaintLogFollow/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblMaintLogFollowCount">) =>
    api.get<DynamicResponse<"getTblMaintLogFollowCount">>(
      "/tblMaintLogFollow/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblMaintLogFollow">) =>
    api.post<DynamicResponse<"postTblMaintLogFollow">>("/tblMaintLogFollow", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblMaintLogFollowById">) =>
    api.put<DynamicResponse<"putTblMaintLogFollowById">>(
      `/tblMaintLogFollow/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogFollowById">
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintLogFollowById">>(
      `/tblMaintLogFollow/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLogFollow">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogFollow">>(
      "/tblMaintLogFollow",
      { params: query }
    ),
};

export type TypeTblMaintLogStocks =
  DynamicResponse<"getTblMaintLogStocks">["items"][0];
export const tblMaintLogStocks = {
  getAll: (query?: DynamicQuery<"getTblMaintLogStocks">) =>
    api.get<DynamicResponse<"getTblMaintLogStocks">>("/tblMaintLogStocks", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintLogStocksById">) =>
    api.get<DynamicResponse<"getTblMaintLogStocksById">>(
      `/tblMaintLogStocks/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblMaintLogStocksCount">) =>
    api.get<DynamicResponse<"getTblMaintLogStocksCount">>(
      "/tblMaintLogStocks/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblMaintLogStocks">) =>
    api.post<DynamicResponse<"postTblMaintLogStocks">>("/tblMaintLogStocks", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblMaintLogStocksById">) =>
    api.put<DynamicResponse<"putTblMaintLogStocksById">>(
      `/tblMaintLogStocks/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaintLogStocksById">
  ) =>
    api.delete<DynamicResponse<"deleteTblMaintLogStocksById">>(
      `/tblMaintLogStocks/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintLogStocks">) =>
    api.delete<DynamicResponse<"deleteTblMaintLogStocks">>(
      "/tblMaintLogStocks",
      { params: query }
    ),
};

export type TypeTblMaintType = DynamicResponse<"getTblMaintType">["items"][0];
export const tblMaintType = {
  getAll: (query?: DynamicQuery<"getTblMaintType">) =>
    api.get<DynamicResponse<"getTblMaintType">>("/tblMaintType", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaintTypeById">) =>
    api.get<DynamicResponse<"getTblMaintTypeById">>(`/tblMaintType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblMaintTypeCount">) =>
    api.get<DynamicResponse<"getTblMaintTypeCount">>("/tblMaintType/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblMaintType">) =>
    api.post<DynamicResponse<"postTblMaintType">>("/tblMaintType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblMaintTypeById">) =>
    api.put<DynamicResponse<"putTblMaintTypeById">>(`/tblMaintType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblMaintTypeById">) =>
    api.delete<DynamicResponse<"deleteTblMaintTypeById">>(
      `/tblMaintType/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaintType">) =>
    api.delete<DynamicResponse<"deleteTblMaintType">>("/tblMaintType", {
      params: query,
    }),
};

export type TypeTblMaterialRequest =
  DynamicResponse<"getTblMaterialRequest">["items"][0];
export const tblMaterialRequest = {
  getAll: (query?: DynamicQuery<"getTblMaterialRequest">) =>
    api.get<DynamicResponse<"getTblMaterialRequest">>("/tblMaterialRequest", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblMaterialRequestById">) =>
    api.get<DynamicResponse<"getTblMaterialRequestById">>(
      `/tblMaterialRequest/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblMaterialRequestCount">) =>
    api.get<DynamicResponse<"getTblMaterialRequestCount">>(
      "/tblMaterialRequest/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblMaterialRequest">) =>
    api.post<DynamicResponse<"postTblMaterialRequest">>("/tblMaterialRequest", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblMaterialRequestById">) =>
    api.put<DynamicResponse<"putTblMaterialRequestById">>(
      `/tblMaterialRequest/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaterialRequestById">
  ) =>
    api.delete<DynamicResponse<"deleteTblMaterialRequestById">>(
      `/tblMaterialRequest/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaterialRequest">) =>
    api.delete<DynamicResponse<"deleteTblMaterialRequest">>(
      "/tblMaterialRequest",
      { params: query }
    ),
};

export type TypeTblMaterialRequestItems =
  DynamicResponse<"getTblMaterialRequestItems">["items"][0];
export const tblMaterialRequestItems = {
  getAll: (query?: DynamicQuery<"getTblMaterialRequestItems">) =>
    api.get<DynamicResponse<"getTblMaterialRequestItems">>(
      "/tblMaterialRequestItems",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblMaterialRequestItemsById">
  ) =>
    api.get<DynamicResponse<"getTblMaterialRequestItemsById">>(
      `/tblMaterialRequestItems/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblMaterialRequestItemsCount">) =>
    api.get<DynamicResponse<"getTblMaterialRequestItemsCount">>(
      "/tblMaterialRequestItems/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblMaterialRequestItems">) =>
    api.post<DynamicResponse<"postTblMaterialRequestItems">>(
      "/tblMaterialRequestItems",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblMaterialRequestItemsById">) =>
    api.put<DynamicResponse<"putTblMaterialRequestItemsById">>(
      `/tblMaterialRequestItems/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblMaterialRequestItemsById">
  ) =>
    api.delete<DynamicResponse<"deleteTblMaterialRequestItemsById">>(
      `/tblMaterialRequestItems/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblMaterialRequestItems">) =>
    api.delete<DynamicResponse<"deleteTblMaterialRequestItems">>(
      "/tblMaterialRequestItems",
      { params: query }
    ),
};

export type TypeTblOilSamplingLog =
  DynamicResponse<"getTblOilSamplingLog">["items"][0];
export const tblOilSamplingLog = {
  getAll: (query?: DynamicQuery<"getTblOilSamplingLog">) =>
    api.get<DynamicResponse<"getTblOilSamplingLog">>("/tblOilSamplingLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblOilSamplingLogById">) =>
    api.get<DynamicResponse<"getTblOilSamplingLogById">>(
      `/tblOilSamplingLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblOilSamplingLogCount">) =>
    api.get<DynamicResponse<"getTblOilSamplingLogCount">>(
      "/tblOilSamplingLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblOilSamplingLog">) =>
    api.post<DynamicResponse<"postTblOilSamplingLog">>("/tblOilSamplingLog", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblOilSamplingLogById">) =>
    api.put<DynamicResponse<"putTblOilSamplingLogById">>(
      `/tblOilSamplingLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblOilSamplingLogById">
  ) =>
    api.delete<DynamicResponse<"deleteTblOilSamplingLogById">>(
      `/tblOilSamplingLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblOilSamplingLog">) =>
    api.delete<DynamicResponse<"deleteTblOilSamplingLog">>(
      "/tblOilSamplingLog",
      { params: query }
    ),
};

export type TypeTblPendingType =
  DynamicResponse<"getTblPendingType">["items"][0];
export const tblPendingType = {
  getAll: (query?: DynamicQuery<"getTblPendingType">) =>
    api.get<DynamicResponse<"getTblPendingType">>("/tblPendingType", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblPendingTypeById">) =>
    api.get<DynamicResponse<"getTblPendingTypeById">>(`/tblPendingType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblPendingTypeCount">) =>
    api.get<DynamicResponse<"getTblPendingTypeCount">>(
      "/tblPendingType/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblPendingType">) =>
    api.post<DynamicResponse<"postTblPendingType">>("/tblPendingType", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblPendingTypeById">) =>
    api.put<DynamicResponse<"putTblPendingTypeById">>(`/tblPendingType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblPendingTypeById">) =>
    api.delete<DynamicResponse<"deleteTblPendingTypeById">>(
      `/tblPendingType/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblPendingType">) =>
    api.delete<DynamicResponse<"deleteTblPendingType">>("/tblPendingType", {
      params: query,
    }),
};

export type TypeTblProductType =
  DynamicResponse<"getTblProductType">["items"][0];
export const tblProductType = {
  getAll: (query?: DynamicQuery<"getTblProductType">) =>
    api.get<DynamicResponse<"getTblProductType">>("/tblProductType", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblProductTypeById">) =>
    api.get<DynamicResponse<"getTblProductTypeById">>(`/tblProductType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblProductTypeCount">) =>
    api.get<DynamicResponse<"getTblProductTypeCount">>(
      "/tblProductType/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblProductType">) =>
    api.post<DynamicResponse<"postTblProductType">>("/tblProductType", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblProductTypeById">) =>
    api.put<DynamicResponse<"putTblProductTypeById">>(`/tblProductType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblProductTypeById">) =>
    api.delete<DynamicResponse<"deleteTblProductTypeById">>(
      `/tblProductType/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblProductType">) =>
    api.delete<DynamicResponse<"deleteTblProductType">>("/tblProductType", {
      params: query,
    }),
};

export type TypeTblReScheduleLog =
  DynamicResponse<"getTblReScheduleLog">["items"][0];
export const tblReScheduleLog = {
  getAll: (query?: DynamicQuery<"getTblReScheduleLog">) =>
    api.get<DynamicResponse<"getTblReScheduleLog">>("/tblReScheduleLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblReScheduleLogById">) =>
    api.get<DynamicResponse<"getTblReScheduleLogById">>(
      `/tblReScheduleLog/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblReScheduleLogCount">) =>
    api.get<DynamicResponse<"getTblReScheduleLogCount">>(
      "/tblReScheduleLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblReScheduleLog">) =>
    api.post<DynamicResponse<"postTblReScheduleLog">>("/tblReScheduleLog", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblReScheduleLogById">) =>
    api.put<DynamicResponse<"putTblReScheduleLogById">>(
      `/tblReScheduleLog/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblReScheduleLogById">
  ) =>
    api.delete<DynamicResponse<"deleteTblReScheduleLogById">>(
      `/tblReScheduleLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblReScheduleLog">) =>
    api.delete<DynamicResponse<"deleteTblReScheduleLog">>("/tblReScheduleLog", {
      params: query,
    }),
};

export type TypeTblRotationLog =
  DynamicResponse<"getTblRotationLog">["items"][0];
export const tblRotationLog = {
  getAll: (query?: DynamicQuery<"getTblRotationLog">) =>
    api.get<DynamicResponse<"getTblRotationLog">>("/tblRotationLog", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblRotationLogById">) =>
    api.get<DynamicResponse<"getTblRotationLogById">>(`/tblRotationLog/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblRotationLogCount">) =>
    api.get<DynamicResponse<"getTblRotationLogCount">>(
      "/tblRotationLog/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblRotationLog">) =>
    api.post<DynamicResponse<"postTblRotationLog">>("/tblRotationLog", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblRotationLogById">) =>
    api.put<DynamicResponse<"putTblRotationLogById">>(`/tblRotationLog/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblRotationLogById">) =>
    api.delete<DynamicResponse<"deleteTblRotationLogById">>(
      `/tblRotationLog/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblRotationLog">) =>
    api.delete<DynamicResponse<"deleteTblRotationLog">>("/tblRotationLog", {
      params: query,
    }),
};

export type TypeTblRound = DynamicResponse<"getTblRound">["items"][0];
export const tblRound = {
  getAll: (query?: DynamicQuery<"getTblRound">) =>
    api.get<DynamicResponse<"getTblRound">>("/tblRound", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblRoundById">) =>
    api.get<DynamicResponse<"getTblRoundById">>(`/tblRound/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblRoundCount">) =>
    api.get<DynamicResponse<"getTblRoundCount">>("/tblRound/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblRound">) =>
    api.post<DynamicResponse<"postTblRound">>("/tblRound", { data }),
  update: (id: number, data: DynamicUpdate<"putTblRoundById">) =>
    api.put<DynamicResponse<"putTblRoundById">>(`/tblRound/${id}`, { data }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblRoundById">) =>
    api.delete<DynamicResponse<"deleteTblRoundById">>(`/tblRound/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblRound">) =>
    api.delete<DynamicResponse<"deleteTblRound">>("/tblRound", {
      params: query,
    }),
};

export type TypeTblRoundCompJob =
  DynamicResponse<"getTblRoundCompJob">["items"][0];
export const tblRoundCompJob = {
  getAll: (query?: DynamicQuery<"getTblRoundCompJob">) =>
    api.get<DynamicResponse<"getTblRoundCompJob">>("/tblRoundCompJob", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblRoundCompJobById">) =>
    api.get<DynamicResponse<"getTblRoundCompJobById">>(
      `/tblRoundCompJob/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblRoundCompJobCount">) =>
    api.get<DynamicResponse<"getTblRoundCompJobCount">>(
      "/tblRoundCompJob/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblRoundCompJob">) =>
    api.post<DynamicResponse<"postTblRoundCompJob">>("/tblRoundCompJob", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblRoundCompJobById">) =>
    api.put<DynamicResponse<"putTblRoundCompJobById">>(
      `/tblRoundCompJob/${id}`,
      { data }
    ),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblRoundCompJobById">) =>
    api.delete<DynamicResponse<"deleteTblRoundCompJobById">>(
      `/tblRoundCompJob/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblRoundCompJob">) =>
    api.delete<DynamicResponse<"deleteTblRoundCompJob">>("/tblRoundCompJob", {
      params: query,
    }),
};

export type TypeTblSpareLocation =
  DynamicResponse<"getTblSpareLocation">["items"][0];
export const tblSpareLocation = {
  getAll: (query?: DynamicQuery<"getTblSpareLocation">) =>
    api.get<DynamicResponse<"getTblSpareLocation">>("/tblSpareLocation", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblSpareLocationById">) =>
    api.get<DynamicResponse<"getTblSpareLocationById">>(
      `/tblSpareLocation/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblSpareLocationCount">) =>
    api.get<DynamicResponse<"getTblSpareLocationCount">>(
      "/tblSpareLocation/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblSpareLocation">) =>
    api.post<DynamicResponse<"postTblSpareLocation">>("/tblSpareLocation", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblSpareLocationById">) =>
    api.put<DynamicResponse<"putTblSpareLocationById">>(
      `/tblSpareLocation/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblSpareLocationById">
  ) =>
    api.delete<DynamicResponse<"deleteTblSpareLocationById">>(
      `/tblSpareLocation/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblSpareLocation">) =>
    api.delete<DynamicResponse<"deleteTblSpareLocation">>("/tblSpareLocation", {
      params: query,
    }),
};

export type TypeTblSpareType = DynamicResponse<"getTblSpareType">["items"][0];
export const tblSpareType = {
  getAll: (query?: DynamicQuery<"getTblSpareType">) =>
    api.get<DynamicResponse<"getTblSpareType">>("/tblSpareType", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblSpareTypeById">) =>
    api.get<DynamicResponse<"getTblSpareTypeById">>(`/tblSpareType/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblSpareTypeCount">) =>
    api.get<DynamicResponse<"getTblSpareTypeCount">>("/tblSpareType/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblSpareType">) =>
    api.post<DynamicResponse<"postTblSpareType">>("/tblSpareType", { data }),
  update: (id: number, data: DynamicUpdate<"putTblSpareTypeById">) =>
    api.put<DynamicResponse<"putTblSpareTypeById">>(`/tblSpareType/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblSpareTypeById">) =>
    api.delete<DynamicResponse<"deleteTblSpareTypeById">>(
      `/tblSpareType/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblSpareType">) =>
    api.delete<DynamicResponse<"deleteTblSpareType">>("/tblSpareType", {
      params: query,
    }),
};

export type TypeTblSpareUnit = DynamicResponse<"getTblSpareUnit">["items"][0];
export const tblSpareUnit = {
  getAll: (query?: DynamicQuery<"getTblSpareUnit">) =>
    api.get<DynamicResponse<"getTblSpareUnit">>("/tblSpareUnit", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblSpareUnitById">) =>
    api.get<DynamicResponse<"getTblSpareUnitById">>(`/tblSpareUnit/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblSpareUnitCount">) =>
    api.get<DynamicResponse<"getTblSpareUnitCount">>("/tblSpareUnit/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblSpareUnit">) =>
    api.post<DynamicResponse<"postTblSpareUnit">>("/tblSpareUnit", { data }),
  update: (id: number, data: DynamicUpdate<"putTblSpareUnitById">) =>
    api.put<DynamicResponse<"putTblSpareUnitById">>(`/tblSpareUnit/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblSpareUnitById">) =>
    api.delete<DynamicResponse<"deleteTblSpareUnitById">>(
      `/tblSpareUnit/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblSpareUnit">) =>
    api.delete<DynamicResponse<"deleteTblSpareUnit">>("/tblSpareUnit", {
      params: query,
    }),
};

export type TypeTblStockClass = DynamicResponse<"getTblStockClass">["items"][0];
export const tblStockClass = {
  getAll: (query?: DynamicQuery<"getTblStockClass">) =>
    api.get<DynamicResponse<"getTblStockClass">>("/tblStockClass", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblStockClassById">) =>
    api.get<DynamicResponse<"getTblStockClassById">>(`/tblStockClass/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblStockClassCount">) =>
    api.get<DynamicResponse<"getTblStockClassCount">>("/tblStockClass/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblStockClass">) =>
    api.post<DynamicResponse<"postTblStockClass">>("/tblStockClass", { data }),
  update: (id: number, data: DynamicUpdate<"putTblStockClassById">) =>
    api.put<DynamicResponse<"putTblStockClassById">>(`/tblStockClass/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblStockClassById">) =>
    api.delete<DynamicResponse<"deleteTblStockClassById">>(
      `/tblStockClass/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblStockClass">) =>
    api.delete<DynamicResponse<"deleteTblStockClass">>("/tblStockClass", {
      params: query,
    }),
};

export type TypeTblTableId = DynamicResponse<"getTblTableId">["items"][0];
export const tblTableId = {
  getAll: (query?: DynamicQuery<"getTblTableId">) =>
    api.get<DynamicResponse<"getTblTableId">>("/tblTableId", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblTableIdById">) =>
    api.get<DynamicResponse<"getTblTableIdById">>(`/tblTableId/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblTableIdCount">) =>
    api.get<DynamicResponse<"getTblTableIdCount">>("/tblTableId/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblTableId">) =>
    api.post<DynamicResponse<"postTblTableId">>("/tblTableId", { data }),
  update: (id: number, data: DynamicUpdate<"putTblTableIdById">) =>
    api.put<DynamicResponse<"putTblTableIdById">>(`/tblTableId/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblTableIdById">) =>
    api.delete<DynamicResponse<"deleteTblTableIdById">>(`/tblTableId/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblTableId">) =>
    api.delete<DynamicResponse<"deleteTblTableId">>("/tblTableId", {
      params: query,
    }),
};

export type TypeTblUnit = DynamicResponse<"getTblUnit">["items"][0];
export const tblUnit = {
  getAll: (query?: DynamicQuery<"getTblUnit">) =>
    api.get<DynamicResponse<"getTblUnit">>("/tblUnit", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblUnitById">) =>
    api.get<DynamicResponse<"getTblUnitById">>(`/tblUnit/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblUnitCount">) =>
    api.get<DynamicResponse<"getTblUnitCount">>("/tblUnit/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblUnit">) =>
    api.post<DynamicResponse<"postTblUnit">>("/tblUnit", { data }),
  update: (id: number, data: DynamicUpdate<"putTblUnitById">) =>
    api.put<DynamicResponse<"putTblUnitById">>(`/tblUnit/${id}`, { data }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblUnitById">) =>
    api.delete<DynamicResponse<"deleteTblUnitById">>(`/tblUnit/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblUnit">) =>
    api.delete<DynamicResponse<"deleteTblUnit">>("/tblUnit", { params: query }),
};

export type TypeTblUserAttachmentInfo =
  DynamicResponse<"getTblUserAttachmentInfo">["items"][0];
export const tblUserAttachmentInfo = {
  getAll: (query?: DynamicQuery<"getTblUserAttachmentInfo">) =>
    api.get<DynamicResponse<"getTblUserAttachmentInfo">>(
      "/tblUserAttachmentInfo",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getTblUserAttachmentInfoById">) =>
    api.get<DynamicResponse<"getTblUserAttachmentInfoById">>(
      `/tblUserAttachmentInfo/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblUserAttachmentInfoCount">) =>
    api.get<DynamicResponse<"getTblUserAttachmentInfoCount">>(
      "/tblUserAttachmentInfo/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblUserAttachmentInfo">) =>
    api.post<DynamicResponse<"postTblUserAttachmentInfo">>(
      "/tblUserAttachmentInfo",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblUserAttachmentInfoById">) =>
    api.put<DynamicResponse<"putTblUserAttachmentInfoById">>(
      `/tblUserAttachmentInfo/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblUserAttachmentInfoById">
  ) =>
    api.delete<DynamicResponse<"deleteTblUserAttachmentInfoById">>(
      `/tblUserAttachmentInfo/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblUserAttachmentInfo">) =>
    api.delete<DynamicResponse<"deleteTblUserAttachmentInfo">>(
      "/tblUserAttachmentInfo",
      { params: query }
    ),
};

export type TypeTblUserAttachmentRelations =
  DynamicResponse<"getTblUserAttachmentRelations">["items"][0];
export const tblUserAttachmentRelations = {
  getAll: (query?: DynamicQuery<"getTblUserAttachmentRelations">) =>
    api.get<DynamicResponse<"getTblUserAttachmentRelations">>(
      "/tblUserAttachmentRelations",
      { params: query }
    ),
  getById: (
    id: number,
    query?: DynamicQuery<"getTblUserAttachmentRelationsById">
  ) =>
    api.get<DynamicResponse<"getTblUserAttachmentRelationsById">>(
      `/tblUserAttachmentRelations/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblUserAttachmentRelationsCount">) =>
    api.get<DynamicResponse<"getTblUserAttachmentRelationsCount">>(
      "/tblUserAttachmentRelations/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblUserAttachmentRelations">) =>
    api.post<DynamicResponse<"postTblUserAttachmentRelations">>(
      "/tblUserAttachmentRelations",
      { data }
    ),
  update: (
    id: number,
    data: DynamicUpdate<"putTblUserAttachmentRelationsById">
  ) =>
    api.put<DynamicResponse<"putTblUserAttachmentRelationsById">>(
      `/tblUserAttachmentRelations/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblUserAttachmentRelationsById">
  ) =>
    api.delete<DynamicResponse<"deleteTblUserAttachmentRelationsById">>(
      `/tblUserAttachmentRelations/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblUserAttachmentRelations">) =>
    api.delete<DynamicResponse<"deleteTblUserAttachmentRelations">>(
      "/tblUserAttachmentRelations",
      { params: query }
    ),
};

export type TypeTblUserDataAccess =
  DynamicResponse<"getTblUserDataAccess">["items"][0];
export const tblUserDataAccess = {
  getAll: (query?: DynamicQuery<"getTblUserDataAccess">) =>
    api.get<DynamicResponse<"getTblUserDataAccess">>("/tblUserDataAccess", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblUserDataAccessById">) =>
    api.get<DynamicResponse<"getTblUserDataAccessById">>(
      `/tblUserDataAccess/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblUserDataAccessCount">) =>
    api.get<DynamicResponse<"getTblUserDataAccessCount">>(
      "/tblUserDataAccess/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblUserDataAccess">) =>
    api.post<DynamicResponse<"postTblUserDataAccess">>("/tblUserDataAccess", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblUserDataAccessById">) =>
    api.put<DynamicResponse<"putTblUserDataAccessById">>(
      `/tblUserDataAccess/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblUserDataAccessById">
  ) =>
    api.delete<DynamicResponse<"deleteTblUserDataAccessById">>(
      `/tblUserDataAccess/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblUserDataAccess">) =>
    api.delete<DynamicResponse<"deleteTblUserDataAccess">>(
      "/tblUserDataAccess",
      { params: query }
    ),
};

export type TypeTblUserSign = DynamicResponse<"getTblUserSign">["items"][0];
export const tblUserSign = {
  getAll: (query?: DynamicQuery<"getTblUserSign">) =>
    api.get<DynamicResponse<"getTblUserSign">>("/tblUserSign", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblUserSignById">) =>
    api.get<DynamicResponse<"getTblUserSignById">>(`/tblUserSign/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblUserSignCount">) =>
    api.get<DynamicResponse<"getTblUserSignCount">>("/tblUserSign/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblUserSign">) =>
    api.post<DynamicResponse<"postTblUserSign">>("/tblUserSign", { data }),
  update: (id: number, data: DynamicUpdate<"putTblUserSignById">) =>
    api.put<DynamicResponse<"putTblUserSignById">>(`/tblUserSign/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblUserSignById">) =>
    api.delete<DynamicResponse<"deleteTblUserSignById">>(`/tblUserSign/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblUserSign">) =>
    api.delete<DynamicResponse<"deleteTblUserSign">>("/tblUserSign", {
      params: query,
    }),
};

export type TypeTblWoJob = DynamicResponse<"getTblWoJob">["items"][0];
export const tblWoJob = {
  getAll: (query?: DynamicQuery<"getTblWoJob">) =>
    api.get<DynamicResponse<"getTblWoJob">>("/tblWoJob", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getTblWoJobById">) =>
    api.get<DynamicResponse<"getTblWoJobById">>(`/tblWoJob/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblWoJobCount">) =>
    api.get<DynamicResponse<"getTblWoJobCount">>("/tblWoJob/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblWoJob">) =>
    api.post<DynamicResponse<"postTblWoJob">>("/tblWoJob", { data }),
  update: (id: number, data: DynamicUpdate<"putTblWoJobById">) =>
    api.put<DynamicResponse<"putTblWoJobById">>(`/tblWoJob/${id}`, { data }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblWoJobById">) =>
    api.delete<DynamicResponse<"deleteTblWoJobById">>(`/tblWoJob/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteTblWoJob">) =>
    api.delete<DynamicResponse<"deleteTblWoJob">>("/tblWoJob", {
      params: query,
    }),
};

export type TypeTblWorkOrder = DynamicResponse<"getTblWorkOrder">["items"][0];
export const tblWorkOrder = {
  getAll: (query?: DynamicQuery<"getTblWorkOrder">) =>
    api.get<DynamicResponse<"getTblWorkOrder">>("/tblWorkOrder", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblWorkOrderById">) =>
    api.get<DynamicResponse<"getTblWorkOrderById">>(`/tblWorkOrder/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getTblWorkOrderCount">) =>
    api.get<DynamicResponse<"getTblWorkOrderCount">>("/tblWorkOrder/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postTblWorkOrder">) =>
    api.post<DynamicResponse<"postTblWorkOrder">>("/tblWorkOrder", { data }),
  update: (id: number, data: DynamicUpdate<"putTblWorkOrderById">) =>
    api.put<DynamicResponse<"putTblWorkOrderById">>(`/tblWorkOrder/${id}`, {
      data,
    }),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblWorkOrderById">) =>
    api.delete<DynamicResponse<"deleteTblWorkOrderById">>(
      `/tblWorkOrder/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkOrder">) =>
    api.delete<DynamicResponse<"deleteTblWorkOrder">>("/tblWorkOrder", {
      params: query,
    }),
};

export type TypeTblWorkShopComponent =
  DynamicResponse<"getTblWorkShopComponent">["items"][0];
export const tblWorkShopComponent = {
  getAll: (query?: DynamicQuery<"getTblWorkShopComponent">) =>
    api.get<DynamicResponse<"getTblWorkShopComponent">>(
      "/tblWorkShopComponent",
      { params: query }
    ),
  getById: (id: number, query?: DynamicQuery<"getTblWorkShopComponentById">) =>
    api.get<DynamicResponse<"getTblWorkShopComponentById">>(
      `/tblWorkShopComponent/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblWorkShopComponentCount">) =>
    api.get<DynamicResponse<"getTblWorkShopComponentCount">>(
      "/tblWorkShopComponent/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblWorkShopComponent">) =>
    api.post<DynamicResponse<"postTblWorkShopComponent">>(
      "/tblWorkShopComponent",
      { data }
    ),
  update: (id: number, data: DynamicUpdate<"putTblWorkShopComponentById">) =>
    api.put<DynamicResponse<"putTblWorkShopComponentById">>(
      `/tblWorkShopComponent/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkShopComponentById">
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkShopComponentById">>(
      `/tblWorkShopComponent/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopComponent">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopComponent">>(
      "/tblWorkShopComponent",
      { params: query }
    ),
};

export type TypeTblWorkShopDone =
  DynamicResponse<"getTblWorkShopDone">["items"][0];
export const tblWorkShopDone = {
  getAll: (query?: DynamicQuery<"getTblWorkShopDone">) =>
    api.get<DynamicResponse<"getTblWorkShopDone">>("/tblWorkShopDone", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblWorkShopDoneById">) =>
    api.get<DynamicResponse<"getTblWorkShopDoneById">>(
      `/tblWorkShopDone/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblWorkShopDoneCount">) =>
    api.get<DynamicResponse<"getTblWorkShopDoneCount">>(
      "/tblWorkShopDone/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblWorkShopDone">) =>
    api.post<DynamicResponse<"postTblWorkShopDone">>("/tblWorkShopDone", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblWorkShopDoneById">) =>
    api.put<DynamicResponse<"putTblWorkShopDoneById">>(
      `/tblWorkShopDone/${id}`,
      { data }
    ),
  deleteById: (id: number, query?: DynamicQuery<"deleteTblWorkShopDoneById">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopDoneById">>(
      `/tblWorkShopDone/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopDone">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopDone">>("/tblWorkShopDone", {
      params: query,
    }),
};

export type TypeTblWorkShopRequest =
  DynamicResponse<"getTblWorkShopRequest">["items"][0];
export const tblWorkShopRequest = {
  getAll: (query?: DynamicQuery<"getTblWorkShopRequest">) =>
    api.get<DynamicResponse<"getTblWorkShopRequest">>("/tblWorkShopRequest", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getTblWorkShopRequestById">) =>
    api.get<DynamicResponse<"getTblWorkShopRequestById">>(
      `/tblWorkShopRequest/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getTblWorkShopRequestCount">) =>
    api.get<DynamicResponse<"getTblWorkShopRequestCount">>(
      "/tblWorkShopRequest/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postTblWorkShopRequest">) =>
    api.post<DynamicResponse<"postTblWorkShopRequest">>("/tblWorkShopRequest", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putTblWorkShopRequestById">) =>
    api.put<DynamicResponse<"putTblWorkShopRequestById">>(
      `/tblWorkShopRequest/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteTblWorkShopRequestById">
  ) =>
    api.delete<DynamicResponse<"deleteTblWorkShopRequestById">>(
      `/tblWorkShopRequest/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteTblWorkShopRequest">) =>
    api.delete<DynamicResponse<"deleteTblWorkShopRequest">>(
      "/tblWorkShopRequest",
      { params: query }
    ),
};

export type TypeUserGroup = DynamicResponse<"getUserGroup">["items"][0];
export const userGroup = {
  getAll: (query?: DynamicQuery<"getUserGroup">) =>
    api.get<DynamicResponse<"getUserGroup">>("/userGroup", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getUserGroupById">) =>
    api.get<DynamicResponse<"getUserGroupById">>(`/userGroup/${id}`, {
      params: query,
    }),
  count: (query?: DynamicQuery<"getUserGroupCount">) =>
    api.get<DynamicResponse<"getUserGroupCount">>("/userGroup/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postUserGroup">) =>
    api.post<DynamicResponse<"postUserGroup">>("/userGroup", { data }),
  update: (id: number, data: DynamicUpdate<"putUserGroupById">) =>
    api.put<DynamicResponse<"putUserGroupById">>(`/userGroup/${id}`, { data }),
  deleteById: (id: number, query?: DynamicQuery<"deleteUserGroupById">) =>
    api.delete<DynamicResponse<"deleteUserGroupById">>(`/userGroup/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteUserGroup">) =>
    api.delete<DynamicResponse<"deleteUserGroup">>("/userGroup", {
      params: query,
    }),
};

export type TypeUserGroupObjects =
  DynamicResponse<"getUserGroupObjects">["items"][0];
export const userGroupObjects = {
  getAll: (query?: DynamicQuery<"getUserGroupObjects">) =>
    api.get<DynamicResponse<"getUserGroupObjects">>("/userGroupObjects", {
      params: query,
    }),
  getById: (id: number, query?: DynamicQuery<"getUserGroupObjectsById">) =>
    api.get<DynamicResponse<"getUserGroupObjectsById">>(
      `/userGroupObjects/${id}`,
      { params: query }
    ),
  count: (query?: DynamicQuery<"getUserGroupObjectsCount">) =>
    api.get<DynamicResponse<"getUserGroupObjectsCount">>(
      "/userGroupObjects/count",
      { params: query }
    ),
  create: (data: DynamicCreate<"postUserGroupObjects">) =>
    api.post<DynamicResponse<"postUserGroupObjects">>("/userGroupObjects", {
      data,
    }),
  update: (id: number, data: DynamicUpdate<"putUserGroupObjectsById">) =>
    api.put<DynamicResponse<"putUserGroupObjectsById">>(
      `/userGroupObjects/${id}`,
      { data }
    ),
  deleteById: (
    id: number,
    query?: DynamicQuery<"deleteUserGroupObjectsById">
  ) =>
    api.delete<DynamicResponse<"deleteUserGroupObjectsById">>(
      `/userGroupObjects/${id}`,
      { params: query }
    ),
  deleteAll: (query?: DynamicQuery<"deleteUserGroupObjects">) =>
    api.delete<DynamicResponse<"deleteUserGroupObjects">>("/userGroupObjects", {
      params: query,
    }),
};

export type TypeUsers = DynamicResponse<"getUsers">["items"][0];
export const users = {
  getAll: (query?: DynamicQuery<"getUsers">) =>
    api.get<DynamicResponse<"getUsers">>("/users", { params: query }),
  getById: (id: number, query?: DynamicQuery<"getUsersById">) =>
    api.get<DynamicResponse<"getUsersById">>(`/users/${id}`, { params: query }),
  count: (query?: DynamicQuery<"getUsersCount">) =>
    api.get<DynamicResponse<"getUsersCount">>("/users/count", {
      params: query,
    }),
  create: (data: DynamicCreate<"postUsers">) =>
    api.post<DynamicResponse<"postUsers">>("/users", { data }),
  update: (id: number, data: DynamicUpdate<"putUsersById">) =>
    api.put<DynamicResponse<"putUsersById">>(`/users/${id}`, { data }),
  deleteById: (id: number, query?: DynamicQuery<"deleteUsersById">) =>
    api.delete<DynamicResponse<"deleteUsersById">>(`/users/${id}`, {
      params: query,
    }),
  deleteAll: (query?: DynamicQuery<"deleteUsers">) =>
    api.delete<DynamicResponse<"deleteUsers">>("/users", { params: query }),
};
