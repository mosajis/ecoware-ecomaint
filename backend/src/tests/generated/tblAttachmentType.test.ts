
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblAttachmentType",
  path: "/tblAttachmentType",
  primaryKey: "attachmentTypeId",
  buildCreatePayload: () => ({
    attachmentTypeId: Date.now() % 1000000,
    createdEmployeeId: 1 /* TODO: set a real, existing createdEmployeeId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({ name: `Updated ${Date.now()}` }),
});
