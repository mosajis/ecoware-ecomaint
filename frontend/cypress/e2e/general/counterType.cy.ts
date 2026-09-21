import { createCrudTests } from "../../support/crudTest";

createCrudTests({
  title: "Counter Type",
  entity: "counterType",
  path: "/general/counter-type",
  apiPath: "tblCounterType",
  viewport: [1920, 1080],
  identifyBy: "name",
  fields: [
    { key: "code", create: (id) => `CY-${id}`, required: true },
    {
      key: "name",
      create: (id) => `Cypress Test Counter Type ${id}`,
      update: (id) => `Cypress Test Counter Type ${id} (Updated)`,
      required: true,
    },
  ],
});
