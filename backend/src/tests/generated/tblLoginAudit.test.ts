
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblLoginAudit",
  path: "/tblLoginAudit",
  primaryKey: "loginAuditId",
  buildCreatePayload: () => ({
    deviceInfo: `Test TblLoginAudit ${Date.now()}`,
    actionType: Date.now() % 1000000,
    isSuccess: true,
  }),
  buildUpdatePayload: () => ({ deviceInfo: `Updated ${Date.now()}` }),
});
