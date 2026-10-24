describe('Módulo de Pessoas', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
  });

  it('deve ter o botão de gerenciar pessoas', () => {
    cy.get('#btnGerenciarPessoas').should('exist');
  });

  it('deve abrir o modal de pessoas', () => {
    cy.get('#btnGerenciarPessoas').click();
    cy.get('#modalPessoasBg').should('have.class', 'active');
  });

  it('deve cadastrar uma pessoa', () => {
    cy.get('#btnGerenciarPessoas').click();
    cy.get('#novaPessoaNome').type('Maria QA');
    cy.get('#btnAddPessoa').click();
    cy.get('#listaPessoasContainer').should('contain', 'Maria QA');
  });

  it('deve ter campos de executor/reporter nos formulários', () => {
    // Executor no caso
    cy.get('#btnNovoCaso').click();
    cy.get('#fExecutor').should('exist');
    cy.get('#btnCancelarCaso').click();

    // Reporter no bug
    cy.get('.tab.bug').click();
    cy.get('#btnNovoBug').click();
    cy.get('#bReporter').should('exist');
    cy.get('#btnCancelarBug').click();
  });
});