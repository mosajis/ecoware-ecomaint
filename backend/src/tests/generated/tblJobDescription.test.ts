
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblJobDescription",
  path: "/tblJobDescription",
  primaryKey: "jobDescId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ jobDescCode: `Updated ${Date.now()}` }),
});
