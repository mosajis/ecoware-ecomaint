
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblInstallation",
  path: "/tblInstallation",
  primaryKey: "instId",
  buildCreatePayload: () => ({
    instId: Date.now() % 1000000,
    name: `Test TblInstallation ${Date.now()}`,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
