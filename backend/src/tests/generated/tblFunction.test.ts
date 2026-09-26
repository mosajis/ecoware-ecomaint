
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFunction",
  path: "/tblFunction",
  primaryKey: "functionId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ funcNo: `Updated ${Date.now()}` }),
});
