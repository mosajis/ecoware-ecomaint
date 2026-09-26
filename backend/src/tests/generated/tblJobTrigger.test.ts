
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblJobTrigger",
  path: "/tblJobTrigger",
  primaryKey: "jobTriggerId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ descr: `Updated ${Date.now()}` }),
});
