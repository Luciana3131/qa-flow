describe('Filtros e ordenação', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
    cy.window().then((win) => {
      win.casos.push(
        { id: 'CT-003', modulo: 'X', titulo: 'Caso C', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Passou', prioridade: 'Alta', evidencias: [], data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') },
        { id: 'CT-001', modulo: 'X', titulo: 'Caso A', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Falhou', prioridade: 'Baixa', evidencias: [], data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') },
        { id: 'CT-002', modulo: 'X', titulo: 'Caso B', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Bloqueado', prioridade: 'Média', evidencias: [], data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') }
      );
      win.salvar();
      win.render();
    });
  });

  it('deve buscar por ID', () => {
    cy.get('#busca').type('CT-002');
    cy.get('#tabelaContainer').should('contain', 'CT-002');
    cy.get('#tabelaContainer').should('not.contain', 'CT-001');
  });

  it('deve ter filtro de data visível', () => {
    cy.get('#v12-ini-caso').should('exist');
    cy.get('#v12-fim-caso').should('exist');
  });

  it('deve ordenar por ID ao clicar no cabeçalho', () => {
    cy.get('#tabelaContainer th').contains('ID').click();
    cy.get('#tabelaContainer tbody tr').first().should('contain', 'CT-001');
  });
});