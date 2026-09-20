describe("Employee CRUD", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/employee");
  });

  it("should create, update, and then delete an employee record", () => {
    const code = `CY-${Date.now()}`;
    const originalName = "Cypress Test Employee";
    const updatedName = "Cypress Test Employee (Updated)";

    // Create
    cy.get('[data-cy="add-button"]').click();
    cy.get('[data-cy="employee-code-input"]').type(code);
    cy.get('[data-cy="employee-firstName-input"]').type(originalName);
    cy.get('[data-cy="employee-lastName-input"]').type(originalName);
    cy.get('[data-cy="employee-discipline-input"]').click();
    cy.contains('[role="option"]', "EMP").click();
    cy.get('[data-cy="form-submit"]').click();

    cy.wait(50);

    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="search-input"]').type(originalName);

    cy.get('[role="row"]').should("contain", originalName);

    // Update

    cy.contains('[role="row"]', code).should("exist").click();

    cy.get('[data-cy="edit-button"]').click();

    cy.get('[data-cy="employee-firstName-input"]').clear().type(updatedName);
    cy.get('[data-cy="form-submit"]').click();

    cy.wait(50);

    cy.get('[data-cy="search-input"]').type(updatedName);

    cy.get('[role="row"]').should("contain", code).and("contain", updatedName);

    // Delete
    cy.get('[data-cy="search-input"]').type(code);

    cy.contains('[role="row"]', code).should("exist").click();

    cy.get('[data-cy="delete-button"]').click();

    cy.get('[data-cy="delete-confirm-button"]').click();

    cy.contains(new RegExp(`^\\s*${code}\\s*$`)).should("not.exist");
  });

  describe("Validation", () => {
    it("should show required errors when code and name are missing", () => {
      cy.get('[data-cy="add-button"]').click();
      cy.get('[data-cy="form-submit"]').click();

      cy.get('[data-cy="employee-code-error"]')
        .should("be.visible")
        .and("contain", "required");

      cy.get('[data-cy="employee-firstName-error"]')
        .should("be.visible")
        .and("contain", "required");

      cy.get('[data-cy="employee-lastName-error"]')
        .should("be.visible")
        .and("contain", "required");
    });
  });

  describe("Cancel", () => {
    it("should discard changes when the form dialog is cancelled", () => {
      const discardedCode = `CY-CANCELLED-${Date.now()}`;

      cy.get('[data-cy="add-button"]').click();

      cy.get('[data-cy="employee-code-input"]').type(discardedCode);
      cy.get('[data-cy="form-cancel"]').click();

      cy.contains(new RegExp(`^\\s*${discardedCode}\\s*$`)).should("not.exist");
    });
  });
});
