
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFailureSeverityLevel",
  path: "/tblFailureSeverityLevel",
  primaryKey: "failureSeverityLevelId",
  buildCreatePayload: () => ({
    failureSeverityLevelId: Date.now() % 1000000,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
