
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblWorkOrderStatus",
  path: "/tblWorkOrderStatus",
  primaryKey: "workOrderStatusId",
  buildCreatePayload: () => ({
    workOrderStatusId: Date.now() % 1000000,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
