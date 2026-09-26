
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblEmployee",
  path: "/tblEmployee",
  primaryKey: "employeeId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ code: `Updated ${Date.now()}` }),
});
