describe("Login", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  describe("Page layout", () => {
    it("should render all the expected form elements", () => {
      cy.get('[data-cy="username-input"]').should("be.visible");
      cy.get('[data-cy="password-input"]').should("be.visible");

      cy.get('[data-cy="remember-checkbox"]').should("be.visible");

      cy.get('[data-cy="forgot-password-link"]').should("be.visible");

      cy.get('[data-cy="login-submit"]')
        .should("be.visible")
        .and("contain.text", "SIGN IN");
    });

    it('should have "Remember me" checked by default', () => {
      cy.get('[data-cy="remember-checkbox"] input').should("be.checked");
    });
  });

  describe("Client-side validation", () => {
    it("should show required errors when submitting an empty form", () => {
      cy.get('[data-cy="login-submit"]').click();

      cy.get('[data-cy="username-input-error"]')
        .should("be.visible")
        .and("contain", "Username is required");

      cy.get('[data-cy="password-input-error"]')
        .should("be.visible")
        .and("contain", "Password is required");

      cy.url().should("include", "/login");
    });
  });

  describe("Password visibility toggle", () => {
    it("should toggle the password field between masked and visible text", () => {
      cy.get('[data-cy="password-input"]').type("some-password");
      cy.get('[data-cy="password-input"]').should(
        "have.attr",
        "type",
        "password",
      );

      cy.get('[data-cy="toggle-password-visibility"]').click();

      cy.get('[data-cy="password-input"]').should("have.attr", "type", "text");

      cy.get('[data-cy="toggle-password-visibility"]').click();

      cy.get('[data-cy="password-input"]').should(
        "have.attr",
        "type",
        "password",
      );
    });
  });

  describe("Valid credentials", () => {
    it("should log the user in successfully and redirect to the dashboard", () => {
      cy.env(["ADMIN_USERNAME"]).then(({ ADMIN_USERNAME }) => {
        cy.get('[data-cy="username-input"]').type(ADMIN_USERNAME);
      });

      cy.env(["ADMIN_PASSWORD"]).then(({ ADMIN_PASSWORD }) => {
        cy.get('[data-cy="password-input"]').type(ADMIN_PASSWORD);
      });

      cy.get('[data-cy="login-submit"]').click();

      cy.url().should("include", "/dashboard");

      cy.contains("Logged in successfully!").should("be.visible");
    });
  });

  describe("Invalid credentials", () => {
    it("should display an error message and stay on the login page", () => {
      cy.get('[data-cy="username-input"]').type("invalid");
      cy.get('[data-cy="password-input"]').type("invalid");

      cy.get('[data-cy="login-submit"]').click();

      cy.url().should("include", "/login");

      cy.contains("[data-sonner-toast]", /invalid|incorrect|failed/i).should(
        "be.visible",
      );
    });
  });
});
