describe('Relatórios', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
    cy.window().then((win) => {
      win.casos.push(
        { id: 'CT-001', modulo: 'X', titulo: 'Passou', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Passou', prioridade: 'Alta', evidencias: [], data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') },
        { id: 'CT-002', modulo: 'X', titulo: 'Falhou', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Falhou', prioridade: 'Alta', evidencias: [], data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') }
      );
      win.salvar();
      win.render();
    });
  });

  it('deve renderizar relatório diário', () => {
    cy.get('.tab').contains('Relatórios').click();
    cy.get('#relatorioContainer').should('contain', 'Relatório Diário');
    cy.get('#relatorioContainer').should('contain', 'Casos');
  });

  it('deve alternar entre períodos', () => {
    cy.get('.tab').contains('Relatórios').click();
    cy.get('.btn-period').contains('Semanal').click();
    cy.get('#relatorioContainer').should('contain', 'Semanal');
    cy.get('.btn-period').contains('Mensal').click();
    cy.get('#relatorioContainer').should('contain', 'Mensal');
    cy.get('.btn-period').contains('Anual').click();
    cy.get('#relatorioContainer').should('contain', 'Anual');
  });

  it('deve mostrar os cards de resumo', () => {
    cy.get('.tab').contains('Relatórios').click();
    cy.get('#relatorioContainer .rel-card').should('have.length.at.least', 4);
  });
});