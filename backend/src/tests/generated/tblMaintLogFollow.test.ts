
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblMaintLogFollow",
  path: "/tblMaintLogFollow",
  primaryKey: "followId",
  buildCreatePayload: () => ({
    followEmployeeId: 1 /* TODO: set a real, existing followEmployeeId in the test database (foreign key) */,
    maintLogId: 1 /* TODO: set a real, existing maintLogId in the test database (foreign key) */,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ followDesc: `Updated ${Date.now()}` }),
});
