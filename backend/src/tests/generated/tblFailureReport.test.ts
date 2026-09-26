
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFailureReport",
  path: "/tblFailureReport",
  primaryKey: "failureReportId",
  buildCreatePayload: () => ({
    // TODO: this model has no required field without a default; add one manually if needed
  }),
  buildUpdatePayload: () => ({ title: `Updated ${Date.now()}` }),
});
