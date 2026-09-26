
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblMaintLog",
  path: "/tblMaintLog",
  primaryKey: "maintLogId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ history: `Updated ${Date.now()}` }),
});
