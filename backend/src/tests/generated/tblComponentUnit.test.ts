
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblComponentUnit",
  path: "/tblComponentUnit",
  primaryKey: "compId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ compNo: `Updated ${Date.now()}` }),
});
