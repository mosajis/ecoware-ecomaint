type FieldType = "text" | "select" | "file";

export interface CrudField {
  key: string;
  type?: FieldType;
  dataCy?: string;
  errorDataCy?: string;
  create: (id: number) => string;
  update?: (id: number) => string;
  required?: boolean;
  mimeType?: string;
}

export interface CrudConfig {
  title: string;
  entity: string;
  path: string;
  fields: CrudField[];
  identifyBy?: string;
  viewport?: [number, number];
  apiPath?: string;
  search?: boolean;
  validation?: boolean;
  cancel?: boolean;
  errorHandling?: boolean;
  errorToast?: string | false;
  waitAfterRowClick?: number;
}

// ---------- selectors ----------

const TOAST = "[data-sonner-toast]";
const SUBMIT = '[data-cy="form-submit"]';
const EDIT_BTN = '[data-cy="edit-button"]';
const DELETE_BTN = '[data-cy="delete-button"]';
const DELETE_CONFIRM = '[data-cy="delete-confirm-button"]';

// ---------- helpers ----------

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exactText = (s: string) => new RegExp(`^\\s*${escapeRegExp(s)}\\s*$`);

const inputSel = (entity: string, f: CrudField) =>
  `[data-cy="${f.dataCy ?? `${entity}-${f.key}-input`}"]`;

const errorSel = (entity: string, f: CrudField) =>
  `[data-cy="${f.errorDataCy ?? `${entity}-${f.key}-error`}"]`;

const fillField = (entity: string, field: CrudField, value: string) => {
  const sel = inputSel(entity, field);

  switch (field.type) {
    case "file":
      cy.get(sel).attachFile({ filePath: value, mimeType: field.mimeType });
      break;
    case "select":
      cy.get(sel).click();
      cy.contains('[role="option"]', value).click();
      break;
    default:
      cy.get(sel).clear().type(value);
  }
};

const searchFor = (text: string) => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="search-input"]:visible').length === 0) {
      cy.get('[data-cy="search-button"]').click();
    }
  });

  cy.get('[data-cy="search-input"] input, input[data-cy="search-input"]')
    .first()
    .clear()
    .type(text);
};

const selectRow = (text: string, waitAfterClick = 0) => {
  cy.contains('[role="row"]', text).should("exist").click();
  if (waitAfterClick) cy.wait(waitAfterClick);
};

// ---------- API helpers ----------

const buildApiMatchers = (apiPath: string) => {
  const p = escapeRegExp(apiPath);
  return {
    collection: new RegExp(`/${p}(\\?|$)`),
    item: new RegExp(`/${p}/[^/?]+(\\?|$)`),
  };
};

const registerApiAliases = (apiPath: string) => {
  const { collection, item } = buildApiMatchers(apiPath);

  cy.intercept({ method: "POST", url: collection }).as("apiCreate");
  cy.intercept({ method: /^(PUT|PATCH)$/, url: item }).as("apiUpdate");
  cy.intercept({ method: "DELETE", url: item }).as("apiDelete");
};

const waitOk = (alias: string, ok: number[] = [200, 201, 204]) => {
  cy.wait(`@${alias}`).its("response.statusCode").should("be.oneOf", ok);
};

export const assertBackendUp = () => {
  const apiUrl = "http://localhost:5273";

  cy.request({
    url: apiUrl,
    failOnStatusCode: false,
    timeout: 5000,
  }).then((res) => {
    expect(
      res.status,
      `Backend at ${apiUrl} responded with ${res.status}`,
    ).to.be.lessThan(500);
  });
};

// ---------- factory ----------

export function createCrudTests(config: CrudConfig) {
  const {
    title,
    entity,
    path,
    fields,
    viewport,
    apiPath,
    search = true,
    validation = true,
    cancel = true,
    errorHandling = true,
    errorToast = TOAST,
    waitAfterRowClick = 500,
  } = config;

  const identifyBy = config.identifyBy ?? fields[0].key;
  const idField = fields.find((f) => f.key === identifyBy)!;
  const updatableFields = fields.filter((f) => f.update);
  const requiredFields = fields.filter((f) => f.required);
  const firstTextField = fields.find((f) => !f.type || f.type === "text")!;

  const find = (text: string) => {
    if (search) searchFor(text);
  };

  const fillCreateForm = (id: number) => {
    cy.get('[data-cy="add-button"]').click();
    fields.forEach((f) => fillField(entity, f, f.create(id)));
  };

  const submitForm = (alias?: string) => {
    cy.get(SUBMIT).click();
    if (apiPath && alias) waitOk(alias);
    cy.get(SUBMIT).should("not.exist");
  };

  const deleteRow = (key: string) => {
    selectRow(key, waitAfterRowClick);
    cy.get(DELETE_BTN).should("not.be.disabled").click();
    cy.get(DELETE_CONFIRM).should("be.visible").click();
  };

  const assertErrorFeedback = () => {
    if (errorToast !== false) cy.get(errorToast).should("be.visible");
  };

  describe(`${title} CRUD`, () => {
    before(() => {
      assertBackendUp();
    });

    beforeEach(() => {
      cy.login();
      if (viewport) cy.viewport(...viewport);
      if (apiPath) registerApiAliases(apiPath);
      cy.visit(path);
    });

    it(`should create${updatableFields.length ? ", update," : ""} and delete a ${title} record`, () => {
      const id = Date.now();
      const createdKey = idField.create(id);
      const currentKey = idField.update ? idField.update(id) : createdKey;

      // ---- Create ----
      fillCreateForm(id);
      submitForm("apiCreate");

      find(createdKey);
      cy.contains('[role="row"]', createdKey).should("exist");

      // ---- Update ----
      if (updatableFields.length) {
        selectRow(createdKey, waitAfterRowClick);
        cy.get(EDIT_BTN).should("not.be.disabled").click();

        updatableFields.forEach((f) => fillField(entity, f, f.update!(id)));
        submitForm("apiUpdate");

        find(currentKey);
        updatableFields.forEach((f) => {
          cy.contains('[role="row"]', f.update!(id)).should("exist");
        });
        cy.contains('[role="row"]', currentKey).should("exist");
      }

      // ---- Delete ----
      deleteRow(currentKey);
      if (apiPath) waitOk("apiDelete");

      cy.contains(exactText(currentKey)).should("not.exist");
    });

    if (validation && requiredFields.length) {
      describe("Validation", () => {
        it("should show required errors when required fields are missing", () => {
          cy.get('[data-cy="add-button"]').click();
          cy.get(SUBMIT).click();

          requiredFields.forEach((f) => {
            cy.get(errorSel(entity, f))
              .should("be.visible")
              .and("contain", "required");
          });
        });
      });
    }

    if (cancel) {
      describe("Cancel", () => {
        it("should discard changes when the form dialog is cancelled", () => {
          const discarded = `CY-CANCELLED-${Date.now()}`;

          cy.get('[data-cy="add-button"]').click();
          cy.get(inputSel(entity, firstTextField)).type(discarded);
          cy.get('[data-cy="form-cancel"]').click();

          cy.contains(exactText(discarded)).should("not.exist");
        });
      });
    }

    if (apiPath && errorHandling) {
      describe("Backend error handling", () => {
        const { collection, item } = buildApiMatchers(apiPath);

        it("should keep the dialog open when create returns 500", () => {
          cy.intercept(
            { method: "POST", url: collection },
            { statusCode: 500, body: { message: "Server error" } },
          ).as("createFail");

          fillCreateForm(Date.now());
          cy.get(SUBMIT).click();

          cy.wait("@createFail");

          assertErrorFeedback();
          cy.get(SUBMIT).should("exist");
        });

        it("should keep the dialog open on network failure", () => {
          cy.intercept(
            { method: "POST", url: collection },
            { forceNetworkError: true },
          ).as("createNetworkFail");

          fillCreateForm(Date.now());
          cy.get(SUBMIT).click();

          cy.wait("@createNetworkFail");

          assertErrorFeedback();
          cy.get(SUBMIT).should("exist");
        });

        if (errorToast !== false) {
          it("should show an error when loading the list fails", () => {
            cy.intercept(
              { method: "GET", url: collection },
              { statusCode: 500, body: { message: "Server error" } },
            ).as("listFail");

            cy.visit(path);
            cy.wait("@listFail");

            assertErrorFeedback();
          });
        }

        it("should keep the record when delete returns 500", () => {
          const id = Date.now();
          const key = idField.create(id);
          let failDelete = true;

          cy.intercept({ method: "DELETE", url: item }, (req) => {
            if (failDelete) {
              req.reply({ statusCode: 500, body: { message: "Server error" } });
            } else {
              req.continue();
            }
          }).as("deleteMaybeFail");

          fillCreateForm(id);
          submitForm("apiCreate");
          find(key);

          deleteRow(key);
          cy.wait("@deleteMaybeFail");

          assertErrorFeedback();
          cy.contains('[role="row"]', key).should("exist");

          cy.then(() => {
            failDelete = false;
          });
          cy.reload();
          find(key);
          deleteRow(key);
          cy.wait("@deleteMaybeFail")
            .its("response.statusCode")
            .should("be.oneOf", [200, 204]);
        });
      });
    }
  });
}
