
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFailureGroupFollow",
  path: "/tblFailureGroupFollow",
  primaryKey: "failureGroupFollowId",
  buildCreatePayload: () => ({
    // TODO: this model has no required field without a default; add one manually if needed
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
