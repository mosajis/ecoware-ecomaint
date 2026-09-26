
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblAttachment",
  path: "/tblAttachment",
  primaryKey: "attachmentId",
  buildCreatePayload: () => ({
    isUserAttachment: true,
    createdEmployeeId: 1 /* TODO: set a real, existing createdEmployeeId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({ title: `Updated ${Date.now()}` }),
});
