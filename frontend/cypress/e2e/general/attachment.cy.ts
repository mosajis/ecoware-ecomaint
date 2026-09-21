// cypress/e2e/general/crud.cy.ts
import { createCrudTests } from "../../support/crudTest";

createCrudTests({
  title: "Attachment",
  entity: "attachment",
  path: "/general/attachment",
  apiPath: "tblAttachment",
  identifyBy: "name",
  search: false,
  validation: false,
  cancel: false,
  errorToast: false,
  waitAfterRowClick: 500,
  fields: [
    {
      key: "file",
      type: "file",
      dataCy: "file-uploader-input",
      create: () => "file/test-file.pdf",
      mimeType: "pdf",
    },
    {
      key: "name",
      dataCy: "file-name-input",
      create: (id) => `test-file-${id}`,
    },
  ],
});
