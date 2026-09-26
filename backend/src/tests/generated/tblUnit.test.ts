
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblUnit",
  path: "/tblUnit",
  primaryKey: "unitId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ code: `Updated ${Date.now()}` }),
});
