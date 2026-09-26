
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblSpareType",
  path: "/tblSpareType",
  primaryKey: "spareTypeId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ makerRefNo: `Updated ${Date.now()}` }),
});
