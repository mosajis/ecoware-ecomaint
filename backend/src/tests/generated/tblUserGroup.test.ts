
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblUserGroup",
  path: "/tblUserGroup",
  primaryKey: "userGroupId",
  buildCreatePayload: () => ({
    name: `Test TblUserGroup ${Date.now()}`,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
