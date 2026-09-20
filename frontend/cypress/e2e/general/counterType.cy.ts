describe("Counter Type CRUD", () => {
  beforeEach(() => {
    cy.login();

    cy.viewport(1920, 1080);

    cy.visit("/general/counter-type");
  });

  it("should create, update, and then delete an counter type record", () => {
    const code = `CY-${Date.now()}`;
    const originalName = "Cypress Test Counter Type";
    const updatedName = "Cypress Test Counter Type (Updated)";

    // Create
    cy.get('[data-cy="add-button"]').click();
    cy.get('[data-cy="counterType-code-input"]').type(code);
    cy.get('[data-cy="counterType-name-input"]').type(originalName);
    cy.get('[data-cy="form-submit"]').click();

    cy.wait(50);

    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="search-input"]').type(originalName);

    cy.get('[role="row"]').should("contain", originalName);

    // Update
    cy.contains('[role="row"]', originalName).should("exist").click();

    cy.get('[data-cy="edit-button"]').click();

    cy.get('[data-cy="counterType-name-input"]').type(updatedName);
    cy.get('[data-cy="form-submit"]').click();

    cy.get('[data-cy="search-input"]').eq(0).type(updatedName);

    cy.get('[role="row"]').should("contain", updatedName);

    // Delete
    cy.contains('[role="row"]', updatedName).should("exist").click();

    cy.get('[data-cy="delete-button"]').click();

    cy.get('[data-cy="delete-confirm-button"]').click();

    cy.contains(new RegExp(`^\\s*${updatedName}\\s*$`)).should("not.exist");
  });

  describe("Validation", () => {
    it("should show required errors when code and name are missing", () => {
      cy.get('[data-cy="add-button"]').click();
      cy.get('[data-cy="form-submit"]').click();

      cy.get('[data-cy="counterType-code-error"]')
        .should("be.visible")
        .and("contain", "required");

      cy.get('[data-cy="counterType-name-error"]')
        .should("be.visible")
        .and("contain", "required");
    });
  });

  describe("Cancel", () => {
    it("should discard changes when the form dialog is cancelled", () => {
      const discardedCode = `CY-CANCELLED-${Date.now()}`;

      cy.get('[data-cy="add-button"]').click();

      cy.get('[data-cy="counterType-code-input"]').type(discardedCode);
      cy.get('[data-cy="form-cancel"]').click();

      cy.contains(new RegExp(`^\\s*${discardedCode}\\s*$`)).should("not.exist");
    });
  });
});
