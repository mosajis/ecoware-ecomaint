
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblRound",
  path: "/tblRound",
  primaryKey: "roundId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ roundCode: `Updated ${Date.now()}` }),
});
