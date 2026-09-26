
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblRotationLog",
  path: "/tblRotationLog",
  primaryKey: "rotationLogId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ notes: `Updated ${Date.now()}` }),
});
