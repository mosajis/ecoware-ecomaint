
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblWorkShopAttachment",
  path: "/tblWorkShopAttachment",
  primaryKey: "workShopAttachmentId",
  buildCreatePayload: () => ({
    workShopId: 1 /* TODO: set a real, existing workShopId in the test database (foreign key) */,
    attachmentId: 1 /* TODO: set a real, existing attachmentId in the test database (foreign key) */,
    createdEmployeeId: 1 /* TODO: set a real, existing createdEmployeeId in the test database (foreign key) */,
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
