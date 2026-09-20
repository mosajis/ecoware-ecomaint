describe("Work Order Filter", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/maintenance/work-order");
  });

  describe("Resp. Discipline filters", () => {
    responsibilities.forEach((responsibility) => {
      it(`should filter by ${responsibility}`, () => {
        cy.get(`[data-cy="workOrder-responsibility-${responsibility}"]`)
          .check({ force: true })
          .should("be.checked");

        cy.get('[data-cy="form-submit"]').click();

        cy.get("body").should("contain.text", "Electrician");
      });
    });
  });

  // describe("Dialog", () => {
  //   it("should open the filter dialog with all sections and fields", () => {
  //     cy.contains("Work Order Info").should("be.visible");
  //     cy.contains("Resp. Discipline").should("be.visible");
  //     cy.contains("WorkOrder Status").should("be.visible");
  //     cy.contains("Component Status").should("be.visible");
  //     cy.contains("Planning").should("be.visible");
  //     cy.contains("Due Between").should("be.visible");

  //     cy.get('[data-cy="workOrder-number-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-title-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-code-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-priority-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-component-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-componentType-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-maintType-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-maintClass-input"]').should("be.visible");
  //     cy.get('[data-cy="workOrder-pending-input"]').should("be.visible");

  //     cy.get('[data-cy="form-submit"]').should("be.visible");
  //     cy.get('[data-cy="form-cancel"]').should("be.visible");
  //   });
  // });

  // describe("Default values", () => {
  //   it("should have the expected default checkbox state", () => {
  //     [
  //       "Electrician",
  //       "Mechanic",
  //       "Toolpusher",
  //       "MudEngineer",
  //       "HSE Officer",
  //       "PM",
  //     ].forEach(shouldBeUnchecked);

  //     ["Plan", "Issue", "Pend"].forEach(shouldBeChecked);
  //     ["Complete", "Control", "Cancel", "Postponed"].forEach(shouldBeUnchecked);

  //     ["None", "InUse", "Available", "Repair"].forEach(shouldBeChecked);
  //     ["Scrapped", "Transferred"].forEach(shouldBeUnchecked);

  //     ["Due Now", "Over due"].forEach(shouldBeChecked);
  //     ["Due This Week", "Due Next Week"].forEach(shouldBeUnchecked);

  //     shouldBeUnchecked("Critical Component");
  //   });
  // });
});
