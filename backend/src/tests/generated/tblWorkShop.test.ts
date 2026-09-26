
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblWorkShop",
  path: "/tblWorkShop",
  primaryKey: "workShopId",
  buildCreatePayload: () => ({
    title: `Test TblWorkShop ${Date.now()}`,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ title: `Updated ${Date.now()}` }),
});
