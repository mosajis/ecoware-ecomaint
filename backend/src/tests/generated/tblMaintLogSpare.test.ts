
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblMaintLogSpare",
  path: "/tblMaintLogSpare",
  primaryKey: "maintLogSpareId",
  buildCreatePayload: () => ({
    maintLogId: 1 /* TODO: set a real, existing maintLogId in the test database (foreign key) */,
    spareUnitId: 1 /* TODO: set a real, existing spareUnitId in the test database (foreign key) */,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
