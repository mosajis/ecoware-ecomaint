
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblRoundCompJob",
  path: "/tblRoundCompJob",
  primaryKey: "roundCompJobId",
  buildCreatePayload: () => ({
    compJobId: 1 /* TODO: set a real, existing compJobId in the test database (foreign key) */,
    roundId: 1 /* TODO: set a real, existing roundId in the test database (foreign key) */,
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({} /* TODO: this model has no suitable string field for the update test, fill it in manually */),
});
