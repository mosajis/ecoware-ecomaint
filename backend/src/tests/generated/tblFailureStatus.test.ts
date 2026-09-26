
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFailureStatus",
  path: "/tblFailureStatus",
  primaryKey: "failureStatusId",
  buildCreatePayload: () => ({
    failureStatusId: Date.now() % 1000000,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
