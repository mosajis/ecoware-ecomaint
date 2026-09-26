
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblPendingType",
  path: "/tblPendingType",
  primaryKey: "pendTypeId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ pendTypeName: `Updated ${Date.now()}` }),
});
