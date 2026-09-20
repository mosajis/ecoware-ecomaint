describe("Attachment Create", () => {
  const title = "test-file";
  const filePath = "file/test-file.pdf";

  beforeEach(() => {
    cy.login();

    cy.visit("/general/attachment");
  });

  it("should create an attachment record", () => {
    cy.get('[data-cy="add-button"]').click();

    cy.get("[data-cy='file-uploader-input']").attachFile({
      filePath,
      mimeType: "pdf",
    });

    cy.get('[data-cy="file-name-input"]').clear().type(title);

    cy.get('[data-cy="form-submit"]').click();

    cy.get('[role="row"]').should("contain", title);
  });

  it("should delete an attachment record", () => {
    cy.contains('[role="row"]', title).should("exist").click();

    cy.wait(500);

    cy.get('[data-cy="delete-button"]').click();

    cy.get('[data-cy="delete-confirm-button"]').click();

    cy.contains(new RegExp(`^\\s*${title}\\s*$`)).should("not.exist");
  });
});
