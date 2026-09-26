
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblFailureReportWorkShop",
  path: "/tblFailureReportWorkShop",
  primaryKey: "failureReportWorkShopId",
  buildCreatePayload: () => ({
    failureReportId: 1 /* TODO: set a real, existing failureReportId in the test database (foreign key) */,
    workShopId: 1 /* TODO: set a real, existing workShopId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
