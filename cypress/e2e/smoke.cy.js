describe('Smoke test — o sistema carrega', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
  });

  it('deve carregar a página sem erros críticos', () => {
    cy.contains('QA Flow').should('be.visible');
    cy.contains('Casos de Teste').should('be.visible');
    cy.contains('Bugs').should('be.visible');
    cy.contains('Histórias').should('be.visible');
  });

  it('deve mostrar a aba de casos ativa por padrão', () => {
    cy.get('#page-casos').should('have.class', 'active');
    cy.get('#btnNovoCaso').should('be.visible');
  });

  it('deve ter todas as funções críticas carregadas', () => {
    cy.window().then((win) => {
      expect(win.abrirModalCaso).to.be.a('function');
      expect(win.abrirModalBug).to.be.a('function');
      expect(win.salvarCaso).to.be.a('function');
      expect(win.salvarBug).to.be.a('function');
      expect(win.render).to.be.a('function');
      expect(win.renderBugs).to.be.a('function');
      expect(win.dbBuscar).to.be.a('function');
      expect(win.fazerBackupCompleto).to.be.a('function');
    });
  });

  it('deve ter o banco IndexedDB inicializado', () => {
    cy.window().then((win) => {
      expect(win.db).to.not.be.undefined;
      expect(win.db).to.not.be.null;
    });
  });
});