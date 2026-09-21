import { createCrudTests } from "cypress/support/crudTest";

createCrudTests({
  title: "Address",
  entity: "address",
  path: "/general/address",
  apiPath: "tblAddress",
  identifyBy: "code",
  fields: [
    { key: "code", create: (id) => `CY-${id}`, required: true },
    {
      key: "name",
      create: () => "Cypress Test Address",
      update: () => "Cypress Test Address (Updated)",
      required: true,
    },
  ],
});
