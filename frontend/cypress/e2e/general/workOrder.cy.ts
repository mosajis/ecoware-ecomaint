import {
  COMPONENT_STATUSES,
  RESPONSIBILITIES,
  WORKORDER_STATUSES,
} from "@/pages/maintenance/workOrder/WorkOrderDialogFilter";

const toDataCyValue = (value: string) => {
  return value.toLowerCase().replace(/\s+/g, "-");
};

const openFilterModal = () => {
  cy.get("body").then(($body) => {
    const visibleDialog = $body.find('[role="dialog"]:visible');

    if (visibleDialog.length === 0) {
      cy.get('[data-cy="workorder-filter-button"]')
        .first()
        .should("be.visible")
        .click();
    }
  });

  cy.get('[role="dialog"]:visible').should("exist").and("be.visible");
};

const resetFilters = () => {
  cy.get('[role="dialog"]:visible')
    .find('[data-cy="form-cancel"]')
    .should("be.visible")
    .click();
};

const setResponsibilityFilterToMechanic = () => {
  cy.get(`[data-cy="workOrder-responsibility-mechanic"]`)
    .check({ force: true })
    .should("be.checked");
};

const submitFilter = () => {
  cy.get('[role="dialog"]:visible')
    .find('[data-cy="form-submit"]')
    .should("be.visible")
    .click();

  cy.get('[role="dialog"]:visible').should("not.exist");
};

const assertFilteredRows = (expectedText: string) => {
  cy.get('[role="row"]')
    .filter(":has([role='gridcell'])")
    .should("have.length.greaterThan", 0)
    .each(($row) => {
      cy.wrap($row).should("contain.text", expectedText);
    });
};

const fillInputAndSubmit = (dataCy: string, value: string) => {
  openFilterModal();
  resetFilters();
  setResponsibilityFilterToMechanic();

  cy.get('[role="dialog"]:visible')
    .find(`[data-cy="${dataCy}"]`)
    .should("be.visible")
    .clear()
    .type(value);

  submitFilter();
};

const selectAsyncOptionAndSubmit = (dataCy: string, optionText: string) => {
  openFilterModal();
  resetFilters();
  setResponsibilityFilterToMechanic();

  cy.get('[role="dialog"]:visible')
    .first()
    .find(`[data-cy="${dataCy}"]`)
    .should("be.visible")
    .click();

  cy.get('[role="dialog"]:visible')
    .last()
    .should("be.visible")
    .within(() => {
      cy.get('[role="row"]')
        .filter(":has([role='gridcell'])")
        .should("have.length.greaterThan", 0)
        .then(($rows) => {
          const row = [...$rows].find((el) =>
            el.innerText.includes(optionText),
          );

          expect(row, `Row "${optionText}"`).to.exist;

          cy.wrap(row!).scrollIntoView().click({ force: true });
        });
    });

  cy.get('[role="dialog"]:visible')
    .last()
    .find('[role="row"][aria-selected="true"]')
    .should("contain.text", optionText);

  cy.get('[data-cy="workorder-selectbox-submit-button"]')
    .should("be.visible")
    .click();

  cy.get('[data-cy="workorder-selectbox-submit-button"]').should("not.exist");

  submitFilter();
};

const getGridRowCount = (): Cypress.Chainable<number> => {
  return cy
    .get('[role="grid"]')
    .should("be.visible")
    .invoke("attr", "aria-rowcount")
    .should("exist")
    .then((count) => Number(count));
};

const assertRowCountReduced = (beforeCount: number) => {
  getGridRowCount().should("not.be", beforeCount);
};

describe("Work Order Filter", { testIsolation: false }, () => {
  before(() => {
    cy.login();

    cy.visit("/maintenance/work-order");

    cy.get('[role="dialog"]:visible').should("exist").and("be.visible");
  });

  describe("Resp. Discipline filters", () => {
    RESPONSIBILITIES.forEach((responsibility) => {
      it(`should filter by ${responsibility}`, () => {
        openFilterModal();
        resetFilters();

        getGridRowCount().then((beforeCount) => {
          const dataCyValue = toDataCyValue(responsibility);

          cy.get(`[data-cy="workOrder-responsibility-${dataCyValue}"]`)
            .check({ force: true })
            .should("be.checked");

          submitFilter();

          assertRowCountReduced(beforeCount);
          assertFilteredRows(responsibility);
        });
      });
    });
  });

  describe("WorkOrder Status filters", () => {
    WORKORDER_STATUSES.forEach((workorderStatus) => {
      it(`should filter by ${workorderStatus}`, () => {
        openFilterModal();
        resetFilters();
        setResponsibilityFilterToMechanic();

        getGridRowCount().then((beforeCount) => {
          const dataCyValue = toDataCyValue(workorderStatus);

          cy.get(`[data-cy="workOrder-Status-${dataCyValue}"]`)
            .check({ force: true })
            .should("be.checked");

          submitFilter();

          assertRowCountReduced(beforeCount);

          // cy.get('[role="row"]').should("contain.text", workorderStatus);
        });
      });
    });
  });

  describe("Component Status filters", () => {
    COMPONENT_STATUSES.forEach((componentStatus) => {
      it(`should filter by ${componentStatus}`, () => {
        openFilterModal();
        resetFilters();
        setResponsibilityFilterToMechanic();

        getGridRowCount().then((beforeCount) => {
          const dataCyValue = toDataCyValue(componentStatus);

          cy.get(`[data-cy="workOrder-Component-${dataCyValue}"]`)
            .check({ force: true })
            .should("be.checked");

          submitFilter();

          assertRowCountReduced(beforeCount);
          // assertFilteredRows(componentStatus);
        });
      });
    });
  });

  describe("Text Input filters", () => {
    describe("Text Input filters", () => {
      const inputFilters = [
        {
          name: "Number",
          dataCy: "workOrder-number-input",
          value: "175",
        },
        {
          name: "Title",
          dataCy: "workOrder-title-input",
          value: "Drawworks - 6M-Dwks-Sample Oil",
        },
        {
          name: "Job Code",
          dataCy: "workOrder-code-input",
          value: "5015-E01",
        },
        {
          name: "Priority",
          dataCy: "workOrder-priority-input",
          value: "0",
        },
      ];

      const asyncSelectFilters = [
        {
          name: "Component",
          dataCy: "workOrder-component-input",
          value: "Main Generator No.1",
        },
        {
          name: "Component Type",
          dataCy: "workOrder-componentType-input",
          value: "LandRig",
        },
        {
          name: "Maint Type",
          dataCy: "workOrder-maintType-input",
          value: "General",
        },
        {
          name: "Maint Class",
          dataCy: "workOrder-maintClass-input",
          value: "Mechanical",
        },
        {
          name: "Pending Type",
          dataCy: "workOrder-pending-input",
          value: "Pending Updated 1789475316419",
        },
      ];

      inputFilters.forEach(({ name, dataCy, value }) => {
        it(`should filter by ${name}`, () => {
          getGridRowCount().then((beforeCount) => {
            fillInputAndSubmit(dataCy, value);

            // assertFilteredRows(value);

            assertRowCountReduced(beforeCount);
          });
        });
      });

      asyncSelectFilters.forEach(({ name, dataCy, value }) => {
        it(`should filter by ${name}`, () => {
          getGridRowCount().then((beforeCount) => {
            selectAsyncOptionAndSubmit(dataCy, value);

            // assertFilteredRows(value);

            assertRowCountReduced(beforeCount);
          });
        });
      });
    });
  });
});
