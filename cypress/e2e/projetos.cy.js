describe('Multi-projeto', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
  });

  it('deve ter o seletor de projetos', () => {
    cy.get('#projetoSelect').should('exist');
    cy.get('#btnNovoProjeto').should('be.visible');
  });

  it('deve abrir o modal de novo projeto', () => {
    cy.get('#btnNovoProjeto').click();
    cy.get('#modalNovoProjetoBg').should('have.class', 'active');
    cy.get('#npNome').should('be.visible');
  });

  it('deve criar um novo projeto', () => {
    cy.get('#btnNovoProjeto').click();
    cy.get('#npNome').type('Projeto Teste Cypress');
    cy.get('#npTipo').select('vazio');
    cy.get('button[type="submit"]').contains('Criar Projeto').click();
    cy.get('#projetoSelect').should('contain', 'Projeto Teste Cypress');
  });
});