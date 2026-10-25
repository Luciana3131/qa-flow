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

  it('deve ter o banco IndexedDB inicializado (com retry)', () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve, reject) => {
      let tentativas = 0;
      const max = 50;
      const verificar = () => {
        tentativas++;
        if (win.db) {
          resolve();
        } else if (tentativas >= max) {
          reject(new Error('db não inicializou em 5s'));
        } else {
          setTimeout(verificar, 100);
        }
      };
      verificar();
    });
  }).then(() => {
    cy.window().should('have.property', 'db').and('not.be.null');
    });
  });
});