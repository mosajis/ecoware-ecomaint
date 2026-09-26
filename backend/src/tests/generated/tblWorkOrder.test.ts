
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblWorkOrder",
  path: "/tblWorkOrder",
  primaryKey: "workOrderId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ woNo: `Updated ${Date.now()}` }),
});
