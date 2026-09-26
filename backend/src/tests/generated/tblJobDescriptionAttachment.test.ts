
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblJobDescriptionAttachment",
  path: "/tblJobDescriptionAttachment",
  primaryKey: "jobDescriptionAttachmentId",
  buildCreatePayload: () => ({
    jobDescId: 1 /* TODO: set a real, existing jobDescId in the test database (foreign key) */,
    attachmentId: 1 /* TODO: set a real, existing attachmentId in the test database (foreign key) */,
    createdEmployeeId: 1 /* TODO: set a real, existing createdEmployeeId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
