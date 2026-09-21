import { createCrudTests } from "../../support/crudTest";

createCrudTests({
  title: "Location",
  entity: "location",
  path: "/general/location",
  apiPath: "tblLocation",
  identifyBy: "code",
  fields: [
    { key: "code", create: (id) => `CY-${id}`, required: true },
    {
      key: "name",
      create: () => "Cypress Test Location",
      update: () => "Cypress Test Location (Updated)",
      required: true,
    },
  ],
});
