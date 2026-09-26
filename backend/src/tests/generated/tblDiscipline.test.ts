
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblDiscipline",
  path: "/tblDiscipline",
  primaryKey: "discId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ code: `Updated ${Date.now()}` }),
});
