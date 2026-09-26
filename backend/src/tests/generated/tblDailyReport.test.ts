
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblDailyReport",
  path: "/tblDailyReport",
  primaryKey: "dailyReportId",
  buildCreatePayload: () => ({
    reportDate: new Date().toISOString(),
    createdEmployeeId: 1 /* TODO: set a real, existing createdEmployeeId in the test database (foreign key) */,
    createdDate: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    instId: 1 /* TODO: set a real, existing instId in the test database (foreign key) */,
    discId: 1 /* TODO: set a real, existing discId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({ userComment: `Updated ${Date.now()}` }),
});
