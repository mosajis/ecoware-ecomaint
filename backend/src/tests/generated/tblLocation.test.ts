
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblLocation",
  path: "/tblLocation",
  primaryKey: "locationId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
