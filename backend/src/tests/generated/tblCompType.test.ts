
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCompType",
  path: "/tblCompType",
  primaryKey: "compTypeId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ compTypeNo: `Updated ${Date.now()}` }),
});
