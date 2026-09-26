
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblPeriod",
  path: "/tblPeriod",
  primaryKey: "periodId",
  buildCreatePayload: () => ({
    periodId: Date.now() % 1000000,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
