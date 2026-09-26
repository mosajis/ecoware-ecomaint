
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblCompJobCounter",
  path: "/tblCompJobCounter",
  primaryKey: "compJobCounterId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
