describe("Discipline CRUD", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/discipline");
  });

  it("should create, update, and then delete an discipline record", () => {
    const originalName = "Cypress Test Discipline";
    const updatedName = "Cypress Test Discipline (Updated)";

    // Create
    cy.get('[data-cy="add-button"]').click();
    cy.get('[data-cy="discipline-name-input"]').type(originalName);
    cy.get('[data-cy="form-submit"]').click();

    cy.wait(50);

    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="search-input"]').type(originalName);

    cy.get('[role="row"]').should("contain", originalName);

    // Update

    cy.contains('[role="row"]', originalName).should("exist").click();

    cy.get('[data-cy="edit-button"]').click();

    cy.get('[data-cy="discipline-name-input"]').clear().type(updatedName);
    cy.get('[data-cy="form-submit"]').click();

    cy.wait(50);

    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="search-input"]').type(updatedName);

    cy.get('[role="row"]').should("contain", updatedName);

    // Delete
    cy.get('[data-cy="search-input"]').type(updatedName);

    cy.contains('[role="row"]', updatedName).should("exist").click();

    cy.get('[data-cy="delete-button"]').click();

    cy.get('[data-cy="delete-confirm-button"]').click();

    cy.contains(new RegExp(`^\\s*${updatedName}\\s*$`)).should("not.exist");
  });

  describe("Validation", () => {
    it("should show required errors when code and name are missing", () => {
      cy.get('[data-cy="add-button"]').click();
      cy.get('[data-cy="form-submit"]').click();

      cy.get('[data-cy="discipline-name-error"]')
        .should("be.visible")
        .and("contain", "required");
    });
  });

  describe("Cancel", () => {
    it("should discard changes when the form dialog is cancelled", () => {
      const discardedCode = `CY-CANCELLED-${Date.now()}`;

      cy.get('[data-cy="add-button"]').click();

      cy.get('[data-cy="discipline-name-input"]').type(discardedCode);
      cy.get('[data-cy="form-cancel"]').click();

      cy.contains(new RegExp(`^\\s*${discardedCode}\\s*$`)).should("not.exist");
    });
  });
});
