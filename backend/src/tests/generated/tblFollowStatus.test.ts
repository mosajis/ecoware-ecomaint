
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFollowStatus",
  path: "/tblFollowStatus",
  primaryKey: "followStatusId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ fsName: `Updated ${Date.now()}` }),
});
