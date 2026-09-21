import { createCrudTests } from "../../support/crudTest";

createCrudTests({
  title: "Employee",
  entity: "employee",
  path: "/general/employee",
  apiPath: "tblEmployee",
  identifyBy: "code",
  fields: [
    { key: "code", create: (id) => `CY-${id}`, required: true },
    {
      key: "firstName",
      create: () => "Cypress Test Employee",
      update: () => "Cypress Test Employee (Updated)",
      required: true,
    },
    { key: "lastName", create: () => "Cypress Test Employee", required: true },
    { key: "discipline", type: "select", create: () => "EMP" },
  ],
});
