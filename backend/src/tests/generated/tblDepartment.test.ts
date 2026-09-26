
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblDepartment",
  path: "/tblDepartment",
  primaryKey: "deptId",
  buildCreatePayload: () => ({
    deptId: Date.now() % 1000000,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ deptName: `Updated ${Date.now()}` }),
});
