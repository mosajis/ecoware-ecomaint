
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCounterType",
  path: "/tblCounterType",
  primaryKey: "counterTypeId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ code: `Updated ${Date.now()}` }),
});
