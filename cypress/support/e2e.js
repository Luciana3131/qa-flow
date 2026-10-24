// ***********************************************************
// Configurações globais do Cypress
// Este arquivo roda antes de todos os testes
// ***********************************************************

import './commands';

// Ignora erros de "uncaught exception" que não são do teste
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar erros de logo.jpg não encontrado
  if (err.message && err.message.includes('logo.jpg')) {
    return false;
  }
  return true;
});

// Comando customizado: limpar dados antes de cada teste
Cypress.Commands.add('limparDados', () => {
  cy.window().then((win) => {
    // Limpa localStorage
    win.localStorage.clear();

    // Limpa IndexedDB (se existir)
    if (win.indexedDB && win.indexedDB.deleteDatabase) {
      win.indexedDB.deleteDatabase('qa_evid_db');
    }
  });
  cy.reload();
});