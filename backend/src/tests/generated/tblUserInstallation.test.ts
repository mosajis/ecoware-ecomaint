
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblUserInstallation",
  path: "/tblUserInstallation",
  primaryKey: "userInstId",
  buildCreatePayload: () => ({
    instId: 1 /* TODO: set a real, existing instId in the test database (foreign key) */,
    userId: 1 /* TODO: set a real, existing userId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
