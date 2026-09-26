
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblOilSamplingLog",
  path: "/tblOilSamplingLog",
  primaryKey: "oilSamplingLogId",
  buildCreatePayload: () => ({
    compOilInfoId: 1 /* TODO: set a real, existing compOilInfoId in the test database (foreign key) */,
    compCounterId: 1 /* TODO: set a real, existing compCounterId in the test database (foreign key) */,
    compCounterVal: Date.now() % 1000000,
    oilCounterVal: Date.now() % 1000000,
    samplingdate: new Date().toISOString(),
    testDate: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ samplingPosition: `Updated ${Date.now()}` }),
});
