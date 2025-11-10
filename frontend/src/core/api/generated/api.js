// ⚠️ Auto-generated file. Do not edit manually.
import { api } from '@/service/axios';
export const disciplineGroup = {
    getAll: (query) => api.get('/disciplineGroup', { params: query }),
    getById: (id, query) => api.get(`/disciplineGroup/${id}`, { params: query }),
    count: (query) => api.get('/disciplineGroup/count', { params: query }),
    create: (data) => api.post('/disciplineGroup', { data }),
    update: (id, data) => api.put(`/disciplineGroup/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/disciplineGroup/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/disciplineGroup', { params: query }),
};
export const disciplineGroupRelations = {
    getAll: (query) => api.get('/disciplineGroupRelations', { params: query }),
    getById: (id, query) => api.get(`/disciplineGroupRelations/${id}`, { params: query }),
    count: (query) => api.get('/disciplineGroupRelations/count', { params: query }),
    create: (data) => api.post('/disciplineGroupRelations', { data }),
    update: (id, data) => api.put(`/disciplineGroupRelations/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/disciplineGroupRelations/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/disciplineGroupRelations', { params: query }),
};
export const documentSignature = {
    getAll: (query) => api.get('/documentSignature', { params: query }),
    getById: (id, query) => api.get(`/documentSignature/${id}`, { params: query }),
    count: (query) => api.get('/documentSignature/count', { params: query }),
    create: (data) => api.post('/documentSignature', { data }),
    update: (id, data) => api.put(`/documentSignature/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/documentSignature/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/documentSignature', { params: query }),
};
export const documentSignatureLog = {
    getAll: (query) => api.get('/documentSignatureLog', { params: query }),
    getById: (id, query) => api.get(`/documentSignatureLog/${id}`, { params: query }),
    count: (query) => api.get('/documentSignatureLog/count', { params: query }),
    create: (data) => api.post('/documentSignatureLog', { data }),
    update: (id, data) => api.put(`/documentSignatureLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/documentSignatureLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/documentSignatureLog', { params: query }),
};
export const tblActionUsers = {
    getAll: (query) => api.get('/tblActionUsers', { params: query }),
    getById: (id, query) => api.get(`/tblActionUsers/${id}`, { params: query }),
    count: (query) => api.get('/tblActionUsers/count', { params: query }),
    create: (data) => api.post('/tblActionUsers', { data }),
    update: (id, data) => api.put(`/tblActionUsers/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblActionUsers/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblActionUsers', { params: query }),
};
export const tblAddress = {
    getAll: (query) => api.get('/tblAddress', { params: query }),
    getById: (id, query) => api.get(`/tblAddress/${id}`, { params: query }),
    count: (query) => api.get('/tblAddress/count', { params: query }),
    create: (data) => api.post('/tblAddress', { data }),
    update: (id, data) => api.put(`/tblAddress/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblAddress/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblAddress', { params: query }),
};
export const tblAddressProduct = {
    getAll: (query) => api.get('/tblAddressProduct', { params: query }),
    getById: (id, query) => api.get(`/tblAddressProduct/${id}`, { params: query }),
    count: (query) => api.get('/tblAddressProduct/count', { params: query }),
    create: (data) => api.post('/tblAddressProduct', { data }),
    update: (id, data) => api.put(`/tblAddressProduct/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblAddressProduct/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblAddressProduct', { params: query }),
};
export const tblAppInfo = {
    getAll: (query) => api.get('/tblAppInfo', { params: query }),
    getById: (id, query) => api.get(`/tblAppInfo/${id}`, { params: query }),
    count: (query) => api.get('/tblAppInfo/count', { params: query }),
    create: (data) => api.post('/tblAppInfo', { data }),
    update: (id, data) => api.put(`/tblAppInfo/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblAppInfo/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblAppInfo', { params: query }),
};
export const tblAppSysParams = {
    getAll: (query) => api.get('/tblAppSysParams', { params: query }),
    getById: (id, query) => api.get(`/tblAppSysParams/${id}`, { params: query }),
    count: (query) => api.get('/tblAppSysParams/count', { params: query }),
    create: (data) => api.post('/tblAppSysParams', { data }),
    update: (id, data) => api.put(`/tblAppSysParams/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblAppSysParams/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblAppSysParams', { params: query }),
};
export const tblCompCounter = {
    getById: (id, query) => api.get(`/tblCompCounter/${id}`, { params: query }),
    count: (query) => api.get('/tblCompCounter/count', { params: query }),
    create: (data) => api.post('/tblCompCounter', { data }),
    update: (id, data) => api.put(`/tblCompCounter/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompCounter/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompCounter', { params: query }),
};
export const tblCompCounterLog = {
    getById: (id, query) => api.get(`/tblCompCounterLog/${id}`, { params: query }),
    count: (query) => api.get('/tblCompCounterLog/count', { params: query }),
    create: (data) => api.post('/tblCompCounterLog', { data }),
    update: (id, data) => api.put(`/tblCompCounterLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompCounterLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompCounterLog', { params: query }),
};
export const tblCompJob = {
    getAll: (query) => api.get('/tblCompJob', { params: query }),
    getById: (id, query) => api.get(`/tblCompJob/${id}`, { params: query }),
    count: (query) => api.get('/tblCompJob/count', { params: query }),
    create: (data) => api.post('/tblCompJob', { data }),
    update: (id, data) => api.put(`/tblCompJob/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompJob/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompJob', { params: query }),
};
export const tblCompJobCounter = {
    getById: (id, query) => api.get(`/tblCompJobCounter/${id}`, { params: query }),
    count: (query) => api.get('/tblCompJobCounter/count', { params: query }),
    create: (data) => api.post('/tblCompJobCounter', { data }),
    update: (id, data) => api.put(`/tblCompJobCounter/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompJobCounter/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompJobCounter', { params: query }),
};
export const tblCompJobDependency = {
    getAll: (query) => api.get('/tblCompJobDependency', { params: query }),
    getById: (id, query) => api.get(`/tblCompJobDependency/${id}`, { params: query }),
    count: (query) => api.get('/tblCompJobDependency/count', { params: query }),
    create: (data) => api.post('/tblCompJobDependency', { data }),
    update: (id, data) => api.put(`/tblCompJobDependency/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompJobDependency/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompJobDependency', { params: query }),
};
export const tblCompJobMeasurePoint = {
    getAll: (query) => api.get('/tblCompJobMeasurePoint', { params: query }),
    getById: (id, query) => api.get(`/tblCompJobMeasurePoint/${id}`, { params: query }),
    count: (query) => api.get('/tblCompJobMeasurePoint/count', { params: query }),
    create: (data) => api.post('/tblCompJobMeasurePoint', { data }),
    update: (id, data) => api.put(`/tblCompJobMeasurePoint/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompJobMeasurePoint/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompJobMeasurePoint', { params: query }),
};
export const tblCompJobRelation = {
    getAll: (query) => api.get('/tblCompJobRelation', { params: query }),
    getById: (id, query) => api.get(`/tblCompJobRelation/${id}`, { params: query }),
    count: (query) => api.get('/tblCompJobRelation/count', { params: query }),
    create: (data) => api.post('/tblCompJobRelation', { data }),
    update: (id, data) => api.put(`/tblCompJobRelation/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompJobRelation/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompJobRelation', { params: query }),
};
export const tblCompJobTrigger = {
    getAll: (query) => api.get('/tblCompJobTrigger', { params: query }),
    getById: (id, query) => api.get(`/tblCompJobTrigger/${id}`, { params: query }),
    count: (query) => api.get('/tblCompJobTrigger/count', { params: query }),
    create: (data) => api.post('/tblCompJobTrigger', { data }),
    update: (id, data) => api.put(`/tblCompJobTrigger/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompJobTrigger/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompJobTrigger', { params: query }),
};
export const tblCompMeasurePoint = {
    getAll: (query) => api.get('/tblCompMeasurePoint', { params: query }),
    getById: (id, query) => api.get(`/tblCompMeasurePoint/${id}`, { params: query }),
    count: (query) => api.get('/tblCompMeasurePoint/count', { params: query }),
    create: (data) => api.post('/tblCompMeasurePoint', { data }),
    update: (id, data) => api.put(`/tblCompMeasurePoint/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompMeasurePoint/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompMeasurePoint', { params: query }),
};
export const tblCompMeasurePointLog = {
    getAll: (query) => api.get('/tblCompMeasurePointLog', { params: query }),
    getById: (id, query) => api.get(`/tblCompMeasurePointLog/${id}`, { params: query }),
    count: (query) => api.get('/tblCompMeasurePointLog/count', { params: query }),
    create: (data) => api.post('/tblCompMeasurePointLog', { data }),
    update: (id, data) => api.put(`/tblCompMeasurePointLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompMeasurePointLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompMeasurePointLog', { params: query }),
};
export const tblCompOilInfo = {
    getAll: (query) => api.get('/tblCompOilInfo', { params: query }),
    getById: (id, query) => api.get(`/tblCompOilInfo/${id}`, { params: query }),
    count: (query) => api.get('/tblCompOilInfo/count', { params: query }),
    create: (data) => api.post('/tblCompOilInfo', { data }),
    update: (id, data) => api.put(`/tblCompOilInfo/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompOilInfo/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompOilInfo', { params: query }),
};
export const tblCompSpare = {
    getAll: (query) => api.get('/tblCompSpare', { params: query }),
    getById: (id, query) => api.get(`/tblCompSpare/${id}`, { params: query }),
    count: (query) => api.get('/tblCompSpare/count', { params: query }),
    create: (data) => api.post('/tblCompSpare', { data }),
    update: (id, data) => api.put(`/tblCompSpare/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompSpare/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompSpare', { params: query }),
};
export const tblCompSpareDetail = {
    getAll: (query) => api.get('/tblCompSpareDetail', { params: query }),
    getById: (id, query) => api.get(`/tblCompSpareDetail/${id}`, { params: query }),
    count: (query) => api.get('/tblCompSpareDetail/count', { params: query }),
    create: (data) => api.post('/tblCompSpareDetail', { data }),
    update: (id, data) => api.put(`/tblCompSpareDetail/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompSpareDetail/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompSpareDetail', { params: query }),
};
export const tblCompStatus = {
    getAll: (query) => api.get('/tblCompStatus', { params: query }),
    getById: (id, query) => api.get(`/tblCompStatus/${id}`, { params: query }),
    count: (query) => api.get('/tblCompStatus/count', { params: query }),
    create: (data) => api.post('/tblCompStatus', { data }),
    update: (id, data) => api.put(`/tblCompStatus/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompStatus/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompStatus', { params: query }),
};
export const tblCompStatusLog = {
    getAll: (query) => api.get('/tblCompStatusLog', { params: query }),
    getById: (id, query) => api.get(`/tblCompStatusLog/${id}`, { params: query }),
    count: (query) => api.get('/tblCompStatusLog/count', { params: query }),
    create: (data) => api.post('/tblCompStatusLog', { data }),
    update: (id, data) => api.put(`/tblCompStatusLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompStatusLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompStatusLog', { params: query }),
};
export const tblCompType = {
    getAll: (query) => api.get('/tblCompType', { params: query }),
    getById: (id, query) => api.get(`/tblCompType/${id}`, { params: query }),
    count: (query) => api.get('/tblCompType/count', { params: query }),
    create: (data) => api.post('/tblCompType', { data }),
    update: (id, data) => api.put(`/tblCompType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompType', { params: query }),
};
export const tblCompTypeCounter = {
    getById: (id, query) => api.get(`/tblCompTypeCounter/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeCounter/count', { params: query }),
    create: (data) => api.post('/tblCompTypeCounter', { data }),
    update: (id, data) => api.put(`/tblCompTypeCounter/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeCounter/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeCounter', { params: query }),
};
export const tblCompTypeJob = {
    getAll: (query) => api.get('/tblCompTypeJob', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeJob/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeJob/count', { params: query }),
    create: (data) => api.post('/tblCompTypeJob', { data }),
    update: (id, data) => api.put(`/tblCompTypeJob/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeJob/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeJob', { params: query }),
};
export const tblCompTypeJobCounter = {
    getById: (id, query) => api.get(`/tblCompTypeJobCounter/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeJobCounter/count', { params: query }),
    create: (data) => api.post('/tblCompTypeJobCounter', { data }),
    update: (id, data) => api.put(`/tblCompTypeJobCounter/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeJobCounter/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeJobCounter', { params: query }),
};
export const tblCompTypeJobMeasurePoint = {
    getAll: (query) => api.get('/tblCompTypeJobMeasurePoint', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeJobMeasurePoint/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeJobMeasurePoint/count', { params: query }),
    create: (data) => api.post('/tblCompTypeJobMeasurePoint', { data }),
    update: (id, data) => api.put(`/tblCompTypeJobMeasurePoint/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeJobMeasurePoint/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeJobMeasurePoint', { params: query }),
};
export const tblCompTypeJobTrigger = {
    getAll: (query) => api.get('/tblCompTypeJobTrigger', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeJobTrigger/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeJobTrigger/count', { params: query }),
    create: (data) => api.post('/tblCompTypeJobTrigger', { data }),
    update: (id, data) => api.put(`/tblCompTypeJobTrigger/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeJobTrigger/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeJobTrigger', { params: query }),
};
export const tblCompTypeMeasurePoint = {
    getAll: (query) => api.get('/tblCompTypeMeasurePoint', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeMeasurePoint/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeMeasurePoint/count', { params: query }),
    create: (data) => api.post('/tblCompTypeMeasurePoint', { data }),
    update: (id, data) => api.put(`/tblCompTypeMeasurePoint/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeMeasurePoint/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeMeasurePoint', { params: query }),
};
export const tblCompTypeRelation = {
    getAll: (query) => api.get('/tblCompTypeRelation', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeRelation/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeRelation/count', { params: query }),
    create: (data) => api.post('/tblCompTypeRelation', { data }),
    update: (id, data) => api.put(`/tblCompTypeRelation/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeRelation/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeRelation', { params: query }),
};
export const tblCompTypeRequiredDiscipline = {
    getAll: (query) => api.get('/tblCompTypeRequiredDiscipline', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeRequiredDiscipline/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeRequiredDiscipline/count', { params: query }),
    create: (data) => api.post('/tblCompTypeRequiredDiscipline', { data }),
    update: (id, data) => api.put(`/tblCompTypeRequiredDiscipline/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeRequiredDiscipline/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeRequiredDiscipline', { params: query }),
};
export const tblCompTypeRequiredPart = {
    getAll: (query) => api.get('/tblCompTypeRequiredPart', { params: query }),
    getById: (id, query) => api.get(`/tblCompTypeRequiredPart/${id}`, { params: query }),
    count: (query) => api.get('/tblCompTypeRequiredPart/count', { params: query }),
    create: (data) => api.post('/tblCompTypeRequiredPart', { data }),
    update: (id, data) => api.put(`/tblCompTypeRequiredPart/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCompTypeRequiredPart/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCompTypeRequiredPart', { params: query }),
};
export const tblComponentUnit = {
    getAll: (query) => api.get('/tblComponentUnit', { params: query }),
    getById: (id, query) => api.get(`/tblComponentUnit/${id}`, { params: query }),
    count: (query) => api.get('/tblComponentUnit/count', { params: query }),
    create: (data) => api.post('/tblComponentUnit', { data }),
    update: (id, data) => api.put(`/tblComponentUnit/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblComponentUnit/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblComponentUnit', { params: query }),
};
export const tblCounterType = {
    getById: (id, query) => api.get(`/tblCounterType/${id}`, { params: query }),
    count: (query) => api.get('/tblCounterType/count', { params: query }),
    create: (data) => api.post('/tblCounterType', { data }),
    update: (id, data) => api.put(`/tblCounterType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblCounterType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblCounterType', { params: query }),
};
export const tblDailyReorts = {
    getAll: (query) => api.get('/tblDailyReorts', { params: query }),
    getById: (id, query) => api.get(`/tblDailyReorts/${id}`, { params: query }),
    count: (query) => api.get('/tblDailyReorts/count', { params: query }),
    create: (data) => api.post('/tblDailyReorts', { data }),
    update: (id, data) => api.put(`/tblDailyReorts/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDailyReorts/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDailyReorts', { params: query }),
};
export const tblDailyReportConsumable = {
    getAll: (query) => api.get('/tblDailyReportConsumable', { params: query }),
    getById: (id, query) => api.get(`/tblDailyReportConsumable/${id}`, { params: query }),
    count: (query) => api.get('/tblDailyReportConsumable/count', { params: query }),
    create: (data) => api.post('/tblDailyReportConsumable', { data }),
    update: (id, data) => api.put(`/tblDailyReportConsumable/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDailyReportConsumable/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDailyReportConsumable', { params: query }),
};
export const tblDailyReportRequest = {
    getAll: (query) => api.get('/tblDailyReportRequest', { params: query }),
    getById: (id, query) => api.get(`/tblDailyReportRequest/${id}`, { params: query }),
    count: (query) => api.get('/tblDailyReportRequest/count', { params: query }),
    create: (data) => api.post('/tblDailyReportRequest', { data }),
    update: (id, data) => api.put(`/tblDailyReportRequest/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDailyReportRequest/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDailyReportRequest', { params: query }),
};
export const tblDashboardAlert = {
    getAll: (query) => api.get('/tblDashboardAlert', { params: query }),
    getById: (id, query) => api.get(`/tblDashboardAlert/${id}`, { params: query }),
    count: (query) => api.get('/tblDashboardAlert/count', { params: query }),
    create: (data) => api.post('/tblDashboardAlert', { data }),
    update: (id, data) => api.put(`/tblDashboardAlert/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDashboardAlert/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDashboardAlert', { params: query }),
};
export const tblDashboardConfig = {
    getAll: (query) => api.get('/tblDashboardConfig', { params: query }),
    getById: (id, query) => api.get(`/tblDashboardConfig/${id}`, { params: query }),
    count: (query) => api.get('/tblDashboardConfig/count', { params: query }),
    create: (data) => api.post('/tblDashboardConfig', { data }),
    update: (id, data) => api.put(`/tblDashboardConfig/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDashboardConfig/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDashboardConfig', { params: query }),
};
export const tblDefaultScreenConfig = {
    getAll: (query) => api.get('/tblDefaultScreenConfig', { params: query }),
    getById: (id, query) => api.get(`/tblDefaultScreenConfig/${id}`, { params: query }),
    count: (query) => api.get('/tblDefaultScreenConfig/count', { params: query }),
    create: (data) => api.post('/tblDefaultScreenConfig', { data }),
    update: (id, data) => api.put(`/tblDefaultScreenConfig/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDefaultScreenConfig/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDefaultScreenConfig', { params: query }),
};
export const tblDepartment = {
    getAll: (query) => api.get('/tblDepartment', { params: query }),
    getById: (id, query) => api.get(`/tblDepartment/${id}`, { params: query }),
    count: (query) => api.get('/tblDepartment/count', { params: query }),
    create: (data) => api.post('/tblDepartment', { data }),
    update: (id, data) => api.put(`/tblDepartment/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDepartment/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDepartment', { params: query }),
};
export const tblDiscipline = {
    getAll: (query) => api.get('/tblDiscipline', { params: query }),
    getById: (id, query) => api.get(`/tblDiscipline/${id}`, { params: query }),
    count: (query) => api.get('/tblDiscipline/count', { params: query }),
    create: (data) => api.post('/tblDiscipline', { data }),
    update: (id, data) => api.put(`/tblDiscipline/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDiscipline/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDiscipline', { params: query }),
};
export const tblDocType = {
    getAll: (query) => api.get('/tblDocType', { params: query }),
    getById: (id, query) => api.get(`/tblDocType/${id}`, { params: query }),
    count: (query) => api.get('/tblDocType/count', { params: query }),
    create: (data) => api.post('/tblDocType', { data }),
    update: (id, data) => api.put(`/tblDocType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblDocType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblDocType', { params: query }),
};
export const tblEmployee = {
    getAll: (query) => api.get('/tblEmployee', { params: query }),
    getById: (id, query) => api.get(`/tblEmployee/${id}`, { params: query }),
    count: (query) => api.get('/tblEmployee/count', { params: query }),
    create: (data) => api.post('/tblEmployee', { data }),
    update: (id, data) => api.put(`/tblEmployee/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblEmployee/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblEmployee', { params: query }),
};
export const tblFailureReports = {
    getAll: (query) => api.get('/tblFailureReports', { params: query }),
    getById: (id, query) => api.get(`/tblFailureReports/${id}`, { params: query }),
    count: (query) => api.get('/tblFailureReports/count', { params: query }),
    create: (data) => api.post('/tblFailureReports', { data }),
    update: (id, data) => api.put(`/tblFailureReports/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblFailureReports/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblFailureReports', { params: query }),
};
export const tblFiltersInfo = {
    getAll: (query) => api.get('/tblFiltersInfo', { params: query }),
    getById: (id, query) => api.get(`/tblFiltersInfo/${id}`, { params: query }),
    count: (query) => api.get('/tblFiltersInfo/count', { params: query }),
    create: (data) => api.post('/tblFiltersInfo', { data }),
    update: (id, data) => api.put(`/tblFiltersInfo/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblFiltersInfo/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblFiltersInfo', { params: query }),
};
export const tblFollowStatus = {
    getAll: (query) => api.get('/tblFollowStatus', { params: query }),
    getById: (id, query) => api.get(`/tblFollowStatus/${id}`, { params: query }),
    count: (query) => api.get('/tblFollowStatus/count', { params: query }),
    create: (data) => api.post('/tblFollowStatus', { data }),
    update: (id, data) => api.put(`/tblFollowStatus/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblFollowStatus/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblFollowStatus', { params: query }),
};
export const tblFunctions = {
    getAll: (query) => api.get('/tblFunctions', { params: query }),
    getById: (id, query) => api.get(`/tblFunctions/${id}`, { params: query }),
    count: (query) => api.get('/tblFunctions/count', { params: query }),
    create: (data) => api.post('/tblFunctions', { data }),
    update: (id, data) => api.put(`/tblFunctions/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblFunctions/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblFunctions', { params: query }),
};
export const tblJobClass = {
    getAll: (query) => api.get('/tblJobClass', { params: query }),
    getById: (id, query) => api.get(`/tblJobClass/${id}`, { params: query }),
    count: (query) => api.get('/tblJobClass/count', { params: query }),
    create: (data) => api.post('/tblJobClass', { data }),
    update: (id, data) => api.put(`/tblJobClass/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblJobClass/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblJobClass', { params: query }),
};
export const tblJobClassAccess = {
    getAll: (query) => api.get('/tblJobClassAccess', { params: query }),
    getById: (id, query) => api.get(`/tblJobClassAccess/${id}`, { params: query }),
    count: (query) => api.get('/tblJobClassAccess/count', { params: query }),
    create: (data) => api.post('/tblJobClassAccess', { data }),
    update: (id, data) => api.put(`/tblJobClassAccess/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblJobClassAccess/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblJobClassAccess', { params: query }),
};
export const tblJobDescription = {
    getAll: (query) => api.get('/tblJobDescription', { params: query }),
    getById: (id, query) => api.get(`/tblJobDescription/${id}`, { params: query }),
    count: (query) => api.get('/tblJobDescription/count', { params: query }),
    create: (data) => api.post('/tblJobDescription', { data }),
    update: (id, data) => api.put(`/tblJobDescription/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblJobDescription/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblJobDescription', { params: query }),
};
export const tblJobTrigger = {
    getAll: (query) => api.get('/tblJobTrigger', { params: query }),
    getById: (id, query) => api.get(`/tblJobTrigger/${id}`, { params: query }),
    count: (query) => api.get('/tblJobTrigger/count', { params: query }),
    create: (data) => api.post('/tblJobTrigger', { data }),
    update: (id, data) => api.put(`/tblJobTrigger/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblJobTrigger/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblJobTrigger', { params: query }),
};
export const tblJobTriggerLog = {
    getAll: (query) => api.get('/tblJobTriggerLog', { params: query }),
    getById: (id, query) => api.get(`/tblJobTriggerLog/${id}`, { params: query }),
    count: (query) => api.get('/tblJobTriggerLog/count', { params: query }),
    create: (data) => api.post('/tblJobTriggerLog', { data }),
    update: (id, data) => api.put(`/tblJobTriggerLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblJobTriggerLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblJobTriggerLog', { params: query }),
};
export const tblJobVersion = {
    getAll: (query) => api.get('/tblJobVersion', { params: query }),
    getById: (id, query) => api.get(`/tblJobVersion/${id}`, { params: query }),
    count: (query) => api.get('/tblJobVersion/count', { params: query }),
    create: (data) => api.post('/tblJobVersion', { data }),
    update: (id, data) => api.put(`/tblJobVersion/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblJobVersion/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblJobVersion', { params: query }),
};
export const tblLocation = {
    getAll: (query) => api.get('/tblLocation', { params: query }),
    getById: (id, query) => api.get(`/tblLocation/${id}`, { params: query }),
    count: (query) => api.get('/tblLocation/count', { params: query }),
    create: (data) => api.post('/tblLocation', { data }),
    update: (id, data) => api.put(`/tblLocation/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblLocation/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblLocation', { params: query }),
};
export const tblLogCounter = {
    getById: (id, query) => api.get(`/tblLogCounter/${id}`, { params: query }),
    count: (query) => api.get('/tblLogCounter/count', { params: query }),
    create: (data) => api.post('/tblLogCounter', { data }),
    update: (id, data) => api.put(`/tblLogCounter/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblLogCounter/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblLogCounter', { params: query }),
};
export const tblLogDiscipline = {
    getAll: (query) => api.get('/tblLogDiscipline', { params: query }),
    getById: (id, query) => api.get(`/tblLogDiscipline/${id}`, { params: query }),
    count: (query) => api.get('/tblLogDiscipline/count', { params: query }),
    create: (data) => api.post('/tblLogDiscipline', { data }),
    update: (id, data) => api.put(`/tblLogDiscipline/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblLogDiscipline/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblLogDiscipline', { params: query }),
};
export const tblLoginAudit = {
    getAll: (query) => api.get('/tblLoginAudit', { params: query }),
    getById: (id, query) => api.get(`/tblLoginAudit/${id}`, { params: query }),
    count: (query) => api.get('/tblLoginAudit/count', { params: query }),
    create: (data) => api.post('/tblLoginAudit', { data }),
    update: (id, data) => api.put(`/tblLoginAudit/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblLoginAudit/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblLoginAudit', { params: query }),
};
export const tblMaintCause = {
    getAll: (query) => api.get('/tblMaintCause', { params: query }),
    getById: (id, query) => api.get(`/tblMaintCause/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintCause/count', { params: query }),
    create: (data) => api.post('/tblMaintCause', { data }),
    update: (id, data) => api.put(`/tblMaintCause/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintCause/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintCause', { params: query }),
};
export const tblMaintClass = {
    getAll: (query) => api.get('/tblMaintClass', { params: query }),
    getById: (id, query) => api.get(`/tblMaintClass/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintClass/count', { params: query }),
    create: (data) => api.post('/tblMaintClass', { data }),
    update: (id, data) => api.put(`/tblMaintClass/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintClass/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintClass', { params: query }),
};
export const tblMaintLog = {
    getAll: (query) => api.get('/tblMaintLog', { params: query }),
    getById: (id, query) => api.get(`/tblMaintLog/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintLog/count', { params: query }),
    create: (data) => api.post('/tblMaintLog', { data }),
    update: (id, data) => api.put(`/tblMaintLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintLog', { params: query }),
};
export const tblMaintLogArchive = {
    getAll: (query) => api.get('/tblMaintLogArchive', { params: query }),
    getById: (id, query) => api.get(`/tblMaintLogArchive/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintLogArchive/count', { params: query }),
    create: (data) => api.post('/tblMaintLogArchive', { data }),
    update: (id, data) => api.put(`/tblMaintLogArchive/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintLogArchive/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintLogArchive', { params: query }),
};
export const tblMaintLogFollow = {
    getAll: (query) => api.get('/tblMaintLogFollow', { params: query }),
    getById: (id, query) => api.get(`/tblMaintLogFollow/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintLogFollow/count', { params: query }),
    create: (data) => api.post('/tblMaintLogFollow', { data }),
    update: (id, data) => api.put(`/tblMaintLogFollow/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintLogFollow/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintLogFollow', { params: query }),
};
export const tblMaintLogStocks = {
    getAll: (query) => api.get('/tblMaintLogStocks', { params: query }),
    getById: (id, query) => api.get(`/tblMaintLogStocks/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintLogStocks/count', { params: query }),
    create: (data) => api.post('/tblMaintLogStocks', { data }),
    update: (id, data) => api.put(`/tblMaintLogStocks/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintLogStocks/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintLogStocks', { params: query }),
};
export const tblMaintType = {
    getAll: (query) => api.get('/tblMaintType', { params: query }),
    getById: (id, query) => api.get(`/tblMaintType/${id}`, { params: query }),
    count: (query) => api.get('/tblMaintType/count', { params: query }),
    create: (data) => api.post('/tblMaintType', { data }),
    update: (id, data) => api.put(`/tblMaintType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaintType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaintType', { params: query }),
};
export const tblMaterialRequest = {
    getAll: (query) => api.get('/tblMaterialRequest', { params: query }),
    getById: (id, query) => api.get(`/tblMaterialRequest/${id}`, { params: query }),
    count: (query) => api.get('/tblMaterialRequest/count', { params: query }),
    create: (data) => api.post('/tblMaterialRequest', { data }),
    update: (id, data) => api.put(`/tblMaterialRequest/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaterialRequest/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaterialRequest', { params: query }),
};
export const tblMaterialRequestItems = {
    getAll: (query) => api.get('/tblMaterialRequestItems', { params: query }),
    getById: (id, query) => api.get(`/tblMaterialRequestItems/${id}`, { params: query }),
    count: (query) => api.get('/tblMaterialRequestItems/count', { params: query }),
    create: (data) => api.post('/tblMaterialRequestItems', { data }),
    update: (id, data) => api.put(`/tblMaterialRequestItems/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblMaterialRequestItems/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblMaterialRequestItems', { params: query }),
};
export const tblOilSamplingLog = {
    getAll: (query) => api.get('/tblOilSamplingLog', { params: query }),
    getById: (id, query) => api.get(`/tblOilSamplingLog/${id}`, { params: query }),
    count: (query) => api.get('/tblOilSamplingLog/count', { params: query }),
    create: (data) => api.post('/tblOilSamplingLog', { data }),
    update: (id, data) => api.put(`/tblOilSamplingLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblOilSamplingLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblOilSamplingLog', { params: query }),
};
export const tblPendingType = {
    getAll: (query) => api.get('/tblPendingType', { params: query }),
    getById: (id, query) => api.get(`/tblPendingType/${id}`, { params: query }),
    count: (query) => api.get('/tblPendingType/count', { params: query }),
    create: (data) => api.post('/tblPendingType', { data }),
    update: (id, data) => api.put(`/tblPendingType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblPendingType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblPendingType', { params: query }),
};
export const tblProductType = {
    getAll: (query) => api.get('/tblProductType', { params: query }),
    getById: (id, query) => api.get(`/tblProductType/${id}`, { params: query }),
    count: (query) => api.get('/tblProductType/count', { params: query }),
    create: (data) => api.post('/tblProductType', { data }),
    update: (id, data) => api.put(`/tblProductType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblProductType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblProductType', { params: query }),
};
export const tblReScheduleLog = {
    getAll: (query) => api.get('/tblReScheduleLog', { params: query }),
    getById: (id, query) => api.get(`/tblReScheduleLog/${id}`, { params: query }),
    count: (query) => api.get('/tblReScheduleLog/count', { params: query }),
    create: (data) => api.post('/tblReScheduleLog', { data }),
    update: (id, data) => api.put(`/tblReScheduleLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblReScheduleLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblReScheduleLog', { params: query }),
};
export const tblRotationLog = {
    getAll: (query) => api.get('/tblRotationLog', { params: query }),
    getById: (id, query) => api.get(`/tblRotationLog/${id}`, { params: query }),
    count: (query) => api.get('/tblRotationLog/count', { params: query }),
    create: (data) => api.post('/tblRotationLog', { data }),
    update: (id, data) => api.put(`/tblRotationLog/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblRotationLog/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblRotationLog', { params: query }),
};
export const tblRound = {
    getAll: (query) => api.get('/tblRound', { params: query }),
    getById: (id, query) => api.get(`/tblRound/${id}`, { params: query }),
    count: (query) => api.get('/tblRound/count', { params: query }),
    create: (data) => api.post('/tblRound', { data }),
    update: (id, data) => api.put(`/tblRound/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblRound/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblRound', { params: query }),
};
export const tblRoundCompJob = {
    getAll: (query) => api.get('/tblRoundCompJob', { params: query }),
    getById: (id, query) => api.get(`/tblRoundCompJob/${id}`, { params: query }),
    count: (query) => api.get('/tblRoundCompJob/count', { params: query }),
    create: (data) => api.post('/tblRoundCompJob', { data }),
    update: (id, data) => api.put(`/tblRoundCompJob/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblRoundCompJob/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblRoundCompJob', { params: query }),
};
export const tblSpareLocation = {
    getAll: (query) => api.get('/tblSpareLocation', { params: query }),
    getById: (id, query) => api.get(`/tblSpareLocation/${id}`, { params: query }),
    count: (query) => api.get('/tblSpareLocation/count', { params: query }),
    create: (data) => api.post('/tblSpareLocation', { data }),
    update: (id, data) => api.put(`/tblSpareLocation/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblSpareLocation/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblSpareLocation', { params: query }),
};
export const tblSpareType = {
    getAll: (query) => api.get('/tblSpareType', { params: query }),
    getById: (id, query) => api.get(`/tblSpareType/${id}`, { params: query }),
    count: (query) => api.get('/tblSpareType/count', { params: query }),
    create: (data) => api.post('/tblSpareType', { data }),
    update: (id, data) => api.put(`/tblSpareType/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblSpareType/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblSpareType', { params: query }),
};
export const tblSpareUnit = {
    getAll: (query) => api.get('/tblSpareUnit', { params: query }),
    getById: (id, query) => api.get(`/tblSpareUnit/${id}`, { params: query }),
    count: (query) => api.get('/tblSpareUnit/count', { params: query }),
    create: (data) => api.post('/tblSpareUnit', { data }),
    update: (id, data) => api.put(`/tblSpareUnit/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblSpareUnit/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblSpareUnit', { params: query }),
};
export const tblStockClass = {
    getAll: (query) => api.get('/tblStockClass', { params: query }),
    getById: (id, query) => api.get(`/tblStockClass/${id}`, { params: query }),
    count: (query) => api.get('/tblStockClass/count', { params: query }),
    create: (data) => api.post('/tblStockClass', { data }),
    update: (id, data) => api.put(`/tblStockClass/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblStockClass/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblStockClass', { params: query }),
};
export const tblTableId = {
    getAll: (query) => api.get('/tblTableId', { params: query }),
    getById: (id, query) => api.get(`/tblTableId/${id}`, { params: query }),
    count: (query) => api.get('/tblTableId/count', { params: query }),
    create: (data) => api.post('/tblTableId', { data }),
    update: (id, data) => api.put(`/tblTableId/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblTableId/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblTableId', { params: query }),
};
export const tblUnit = {
    getAll: (query) => api.get('/tblUnit', { params: query }),
    getById: (id, query) => api.get(`/tblUnit/${id}`, { params: query }),
    count: (query) => api.get('/tblUnit/count', { params: query }),
    create: (data) => api.post('/tblUnit', { data }),
    update: (id, data) => api.put(`/tblUnit/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblUnit/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblUnit', { params: query }),
};
export const tblUserAttachmentInfo = {
    getAll: (query) => api.get('/tblUserAttachmentInfo', { params: query }),
    getById: (id, query) => api.get(`/tblUserAttachmentInfo/${id}`, { params: query }),
    count: (query) => api.get('/tblUserAttachmentInfo/count', { params: query }),
    create: (data) => api.post('/tblUserAttachmentInfo', { data }),
    update: (id, data) => api.put(`/tblUserAttachmentInfo/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblUserAttachmentInfo/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblUserAttachmentInfo', { params: query }),
};
export const tblUserAttachmentRelations = {
    getAll: (query) => api.get('/tblUserAttachmentRelations', { params: query }),
    getById: (id, query) => api.get(`/tblUserAttachmentRelations/${id}`, { params: query }),
    count: (query) => api.get('/tblUserAttachmentRelations/count', { params: query }),
    create: (data) => api.post('/tblUserAttachmentRelations', { data }),
    update: (id, data) => api.put(`/tblUserAttachmentRelations/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblUserAttachmentRelations/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblUserAttachmentRelations', { params: query }),
};
export const tblUserDataAccess = {
    getAll: (query) => api.get('/tblUserDataAccess', { params: query }),
    getById: (id, query) => api.get(`/tblUserDataAccess/${id}`, { params: query }),
    count: (query) => api.get('/tblUserDataAccess/count', { params: query }),
    create: (data) => api.post('/tblUserDataAccess', { data }),
    update: (id, data) => api.put(`/tblUserDataAccess/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblUserDataAccess/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblUserDataAccess', { params: query }),
};
export const tblUserSign = {
    getAll: (query) => api.get('/tblUserSign', { params: query }),
    getById: (id, query) => api.get(`/tblUserSign/${id}`, { params: query }),
    count: (query) => api.get('/tblUserSign/count', { params: query }),
    create: (data) => api.post('/tblUserSign', { data }),
    update: (id, data) => api.put(`/tblUserSign/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblUserSign/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblUserSign', { params: query }),
};
export const tblWoJob = {
    getAll: (query) => api.get('/tblWoJob', { params: query }),
    getById: (id, query) => api.get(`/tblWoJob/${id}`, { params: query }),
    count: (query) => api.get('/tblWoJob/count', { params: query }),
    create: (data) => api.post('/tblWoJob', { data }),
    update: (id, data) => api.put(`/tblWoJob/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblWoJob/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblWoJob', { params: query }),
};
export const tblWorkOrder = {
    getAll: (query) => api.get('/tblWorkOrder', { params: query }),
    getById: (id, query) => api.get(`/tblWorkOrder/${id}`, { params: query }),
    count: (query) => api.get('/tblWorkOrder/count', { params: query }),
    create: (data) => api.post('/tblWorkOrder', { data }),
    update: (id, data) => api.put(`/tblWorkOrder/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblWorkOrder/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblWorkOrder', { params: query }),
};
export const tblWorkShopComponent = {
    getAll: (query) => api.get('/tblWorkShopComponent', { params: query }),
    getById: (id, query) => api.get(`/tblWorkShopComponent/${id}`, { params: query }),
    count: (query) => api.get('/tblWorkShopComponent/count', { params: query }),
    create: (data) => api.post('/tblWorkShopComponent', { data }),
    update: (id, data) => api.put(`/tblWorkShopComponent/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblWorkShopComponent/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblWorkShopComponent', { params: query }),
};
export const tblWorkShopDone = {
    getAll: (query) => api.get('/tblWorkShopDone', { params: query }),
    getById: (id, query) => api.get(`/tblWorkShopDone/${id}`, { params: query }),
    count: (query) => api.get('/tblWorkShopDone/count', { params: query }),
    create: (data) => api.post('/tblWorkShopDone', { data }),
    update: (id, data) => api.put(`/tblWorkShopDone/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblWorkShopDone/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblWorkShopDone', { params: query }),
};
export const tblWorkShopRequest = {
    getAll: (query) => api.get('/tblWorkShopRequest', { params: query }),
    getById: (id, query) => api.get(`/tblWorkShopRequest/${id}`, { params: query }),
    count: (query) => api.get('/tblWorkShopRequest/count', { params: query }),
    create: (data) => api.post('/tblWorkShopRequest', { data }),
    update: (id, data) => api.put(`/tblWorkShopRequest/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/tblWorkShopRequest/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/tblWorkShopRequest', { params: query }),
};
export const userGroup = {
    getAll: (query) => api.get('/userGroup', { params: query }),
    getById: (id, query) => api.get(`/userGroup/${id}`, { params: query }),
    count: (query) => api.get('/userGroup/count', { params: query }),
    create: (data) => api.post('/userGroup', { data }),
    update: (id, data) => api.put(`/userGroup/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/userGroup/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/userGroup', { params: query }),
};
export const userGroupObjects = {
    getAll: (query) => api.get('/userGroupObjects', { params: query }),
    getById: (id, query) => api.get(`/userGroupObjects/${id}`, { params: query }),
    count: (query) => api.get('/userGroupObjects/count', { params: query }),
    create: (data) => api.post('/userGroupObjects', { data }),
    update: (id, data) => api.put(`/userGroupObjects/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/userGroupObjects/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/userGroupObjects', { params: query }),
};
export const users = {
    getAll: (query) => api.get('/users', { params: query }),
    getById: (id, query) => api.get(`/users/${id}`, { params: query }),
    count: (query) => api.get('/users/count', { params: query }),
    create: (data) => api.post('/users', { data }),
    update: (id, data) => api.put(`/users/${id}`, { data }),
    deleteById: (id, query) => api.delete(`/users/${id}`, { params: query }),
    deleteAll: (query) => api.delete('/users', { params: query }),
};
