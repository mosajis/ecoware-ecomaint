
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblJobVersion",
  path: "/tblJobVersion",
  primaryKey: "jobVersionId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ jobVersionNo: `Updated ${Date.now()}` }),
});
