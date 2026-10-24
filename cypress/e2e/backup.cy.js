describe('Backup e restauração', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
  });

  it('deve ter a função fazerBackupCompleto disponível', () => {
    cy.window().then((win) => {
      expect(win.fazerBackupCompleto).to.be.a('function');
      expect(win.restaurarBackup).to.be.a('function');
    });
  });

  it('deve ter o botão de backup visível', () => {
    cy.get('#btnBackupCompleto').should('be.visible');
    cy.get('#btnRestaurarBackup').should('be.visible');
  });

  it('deve mostrar aviso de backup no topo', () => {
    cy.get('#backupLembreteBar').should('exist');
    cy.get('#backupLembreteTexto').should('be.visible');
  });
});