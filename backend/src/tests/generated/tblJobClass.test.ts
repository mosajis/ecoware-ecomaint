
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblJobClass",
  path: "/tblJobClass",
  primaryKey: "jobClassId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ code: `Updated ${Date.now()}` }),
});
