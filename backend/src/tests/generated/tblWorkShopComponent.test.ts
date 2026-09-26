
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblWorkShopComponent",
  path: "/tblWorkShopComponent",
  primaryKey: "workShopCompId",
  buildCreatePayload: () => ({
    workShopId: 1 /* TODO: set a real, existing workShopId in the test database (foreign key) */,
    compId: 1 /* TODO: set a real, existing compId in the test database (foreign key) */,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
