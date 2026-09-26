
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblWorkOrderType",
  path: "/tblWorkOrderType",
  primaryKey: "workOrderTypeId",
  buildCreatePayload: () => ({
    workOrderTypeId: Date.now() % 1000000,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
