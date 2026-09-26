
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblElement",
  path: "/tblElement",
  primaryKey: "elementId",
  buildCreatePayload: () => ({
    elementId: Date.now() % 1000000,
    name: `Test TblElement ${Date.now()}`,
    caption: `Test TblElement ${Date.now()}`,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
