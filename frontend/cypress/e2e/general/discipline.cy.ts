import { createCrudTests } from "../../support/crudTest";

createCrudTests({
  title: "Discipline",
  entity: "discipline",
  path: "/general/discipline",
  apiPath: "tblDiscipline",
  identifyBy: "name",
  fields: [
    {
      key: "name",
      create: (id) => `Cypress Test Discipline ${id}`,
      update: (id) => `Cypress Test Discipline ${id} (Updated)`,
      required: true,
    },
  ],
});
