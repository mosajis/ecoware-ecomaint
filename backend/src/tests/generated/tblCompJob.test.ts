
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCompJob",
  path: "/tblCompJob",
  primaryKey: "compJobId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ changeReason: `Updated ${Date.now()}` }),
});
