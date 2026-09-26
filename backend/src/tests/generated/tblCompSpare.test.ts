
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCompSpare",
  path: "/tblCompSpare",
  primaryKey: "compSpareId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ drawingNo: `Updated ${Date.now()}` }),
});
