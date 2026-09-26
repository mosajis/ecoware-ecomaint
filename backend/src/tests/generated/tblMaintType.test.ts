
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblMaintType",
  path: "/tblMaintType",
  primaryKey: "maintTypeId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ descr: `Updated ${Date.now()}` }),
});
