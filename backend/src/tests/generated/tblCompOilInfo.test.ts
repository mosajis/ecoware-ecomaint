
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCompOilInfo",
  path: "/tblCompOilInfo",
  primaryKey: "compOilInfoId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ laboratoryCode: `Updated ${Date.now()}` }),
});
