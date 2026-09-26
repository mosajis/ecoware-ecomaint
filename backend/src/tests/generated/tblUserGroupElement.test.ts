
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblUserGroupElement",
  path: "/tblUserGroupElement",
  primaryKey: "userGroupElementId",
  buildCreatePayload: () => ({
    userGroupId: 1 /* TODO: set a real, existing userGroupId in the test database (foreign key) */,
    elementId: 1 /* TODO: set a real, existing elementId in the test database (foreign key) */,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canView: true,
    canExport: true,
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
