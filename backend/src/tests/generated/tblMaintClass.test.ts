
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblMaintClass",
  path: "/tblMaintClass",
  primaryKey: "maintClassId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ descr: `Updated ${Date.now()}` }),
});
