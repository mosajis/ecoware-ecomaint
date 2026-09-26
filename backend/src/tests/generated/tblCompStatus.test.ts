
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCompStatus",
  path: "/tblCompStatus",
  primaryKey: "compStatusId",
  buildCreatePayload: () => ({
    compStatusId: Date.now() % 1000000,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ compStatusName: `Updated ${Date.now()}` }),
});
