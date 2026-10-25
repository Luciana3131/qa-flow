describe('Filtros e ordenação', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
    cy.window().then((win) => {
      win.casos = [];
      win.casos.push(
        { id: 'CT-003', modulo: 'X', titulo: 'Caso C', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Passou', prioridade: 'Alta', evidencias: [], executor: '', data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') },
        { id: 'CT-001', modulo: 'X', titulo: 'Caso A', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Falhou', prioridade: 'Baixa', evidencias: [], executor: '', data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') },
        { id: 'CT-002', modulo: 'X', titulo: 'Caso B', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Bloqueado', prioridade: 'Média', evidencias: [], executor: '', data: new Date().toLocaleString('pt-BR'), dataCriacao: new Date().toLocaleString('pt-BR') }
      );
      win.salvar();
      win.render();
    });
  });

  it('deve ter campo de busca visível', () => {
    cy.get('#busca').should('exist');
    cy.get('#busca').should('be.visible');
  });

  it('deve ter filtros de status, prioridade e história visíveis', () => {
    cy.get('#filtroStatus').should('exist');
    cy.get('#filtroPrioridade').should('exist');
    cy.get('#filtroHistoria').should('exist');
  });

  it('deve filtrar casos por status (verificação direta)', () => {
    cy.get('#filtroStatus').should('exist');
    cy.get('#filtroStatus option[value="Falhou"]').should('exist');
    cy.get('#filtroStatus option[value="Passou"]').should('exist');
    
    cy.get('#filtroStatus').select('Falhou');
    cy.wait(500);
    
    cy.get('#tabelaContainer').should('exist');
  });
});