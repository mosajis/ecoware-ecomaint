
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblMaintCause",
  path: "/tblMaintCause",
  primaryKey: "maintCauseId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ descr: `Updated ${Date.now()}` }),
});
