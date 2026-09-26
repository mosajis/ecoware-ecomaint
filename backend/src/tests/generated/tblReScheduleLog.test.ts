
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "tblReScheduleLog",
  path: "/tblReScheduleLog",
  primaryKey: "rescheduleLogId",
  buildCreatePayload: () => ({
    lastUpdate: new Date().toISOString(),
  }),
  buildUpdatePayload: () => ({ reason: `Updated ${Date.now()}` }),
});
