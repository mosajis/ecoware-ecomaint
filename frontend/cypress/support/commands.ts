/// <reference types="cypress" />

Cypress.Commands.add("login", () => {
  cy.env(["ADMIN_USERNAME", "ADMIN_PASSWORD"]).then(
    ({ ADMIN_USERNAME, ADMIN_PASSWORD }) => {
      cy.session("admin", () => {
        cy.request({
          method: "POST",
          url: "http://localhost:5273/auth/login",
          body: {
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          },
        }).then(({ body }) => {
          expect(body.accessToken).to.be.a("string").and.not.be.empty;

          cy.window().then((win) => {
            win.localStorage.setItem("access-token", body.accessToken);
          });
        });
      });
    },
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable;
    }
  }
}

export { };

