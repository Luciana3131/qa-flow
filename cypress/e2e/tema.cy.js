describe('Tema claro/escuro', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
  });

  it('deve ter o botão de tema visível', () => {
    cy.get('#themeToggleBtn').should('exist');
  });

  it('deve alternar para tema escuro', () => {
    cy.get('#themeToggleBtn').click();
    cy.get('body').should('have.class', 'tema-escuro');
  });

  it('deve voltar para tema claro', () => {
    cy.get('#themeToggleBtn').click(); // escuro
    cy.get('#themeToggleBtn').click(); // claro
    cy.get('body').should('not.have.class', 'tema-escuro');
  });

  it('deve persistir o tema após reload', () => {
    cy.get('#themeToggleBtn').click();
    cy.get('body').should('have.class', 'tema-escuro');
    cy.reload();
    cy.get('body').should('have.class', 'tema-escuro');
  });
});