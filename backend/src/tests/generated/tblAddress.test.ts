import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblAddress",
  path: "/tblAddress",
  primaryKey: "addressId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
