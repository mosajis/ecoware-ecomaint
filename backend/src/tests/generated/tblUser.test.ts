
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblUser",
  path: "/tblUser",
  primaryKey: "userId",
  buildCreatePayload: () => ({
    employeeId: 1 /* TODO: set a real, existing employeeId in the test database (foreign key) */,
    userGroupId: 1 /* TODO: set a real, existing userGroupId in the test database (foreign key) */,
    userName: `Test TblUser ${Date.now()}`,
    password: `Test TblUser ${Date.now()}`,
    accountDisabled: true,
    forcePasswordChange: true,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ userName: `Updated ${Date.now()}` }),
});
