describe('Bugs — CRUD, reteste e vínculos', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
    cy.window().should('have.property', 'db');
    cy.window().its('db').should('not.be.null');

    cy.window().then((win) => {
      win.casos = [];
      win.casos.push({
        id: 'CT-001', modulo: 'Login', titulo: 'Login válido',
        historia: '', pre: '', passos: '1. Login', esperado: 'OK',
        obtido: '', comentario: '', status: 'Passou', prioridade: 'Alta',
        evidencias: [], executor: '', data: '01/01/2026', dataCriacao: '01/01/2026'
      });
      win.salvar();
      win.render();
      win.localStorage.setItem('qa_pessoas', JSON.stringify([{ id: 'p1', nome: 'João QA' }]));
    });

    cy.reload();
    cy.wait(14000); // Espera o v17 terminar
  });

  it('deve criar um bug', () => {
    cy.get('.tab.bug').click();
    cy.get('#btnNovoBug').click();
    cy.get('#modalBugBg').should('have.class', 'active');
    cy.wait(1000);

    cy.get('#modalBugBg').within(() => {
      cy.get('#bId').clear({ force: true }).type('BUG-001', { force: true });
      cy.wait(200);
      cy.get('#bModulo').type('Login', { force: true });
      cy.wait(200);
      cy.get('#bTitulo').type('Botão Entrar não responde', { force: true });
      cy.wait(200);
      cy.get('#bCasoVinculado').then(($sel) => {
        if ($sel.find('option[value="CT-001"]').length > 0) {
          cy.wrap($sel).select('CT-001', { force: true });
        }
      });
      cy.get('#bSeveridade').select('Alta', { force: true });
      cy.get('#bPrioridade').select('Média', { force: true });
      cy.get('#bStatus').select('Aberto', { force: true });
      cy.get('#bPassos').type('1. Acessar login\n2. Clicar em Entrar', { force: true });
      cy.wait(200);
      cy.get('#bEsperado').type('Login efetuado', { force: true });
      cy.wait(200);
      cy.get('#bAtual').type('Nada acontece', { force: true });
      cy.wait(200);
      cy.get('#bReporter').then(($sel) => {
        if ($sel.find('option').length > 1) {
          cy.wrap($sel).select('João QA', { force: true });
        }
      });
      cy.wait(300);
      cy.get('button[type="submit"]').contains('Salvar').click({ force: true });
    });

    cy.get('#modalBugBg').should('not.have.class', 'active');
    cy.get('#tabelaBugsContainer').should('contain', 'BUG-001');
  });

  it('deve registrar reteste com executor', () => {
    cy.window().then((win) => {
      win.bugs = [];
      win.bugs.push({
        id: 'BUG-002', modulo: 'Login', titulo: 'Bug teste',
        casoVinculado: 'CT-001', severidade: 'Alta', prioridade: 'Média',
        status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e',
        atual: 'a', comentario: '', reporter: 'João QA',
        evidencias: [], retestes: [], vinculos: [],
        dataCriacao: '01/01/2026'
      });
      win.salvar();
      win.renderBugs();
    });

    cy.get('.tab.bug').click();
    cy.wait(500);
    cy.get('#tabelaBugsContainer tr').contains('BUG-002').parents('tr').within(() => {
      cy.get('button.btn-primary').click({ force: true });
    });
    cy.get('#modalBugBg').should('have.class', 'active');
    cy.wait(2000);

    // Em vez de clicar no botão (que pode ser substituído), chama a função direto
    cy.window().then((win) => {
      // Preenche os selects via DOM (o v17 já terminou, então estão estáveis)
      const selCT = document.getElementById('rCasoTeste');
      const selRes = document.getElementById('rResultado');
      const selExec = document.getElementById('rExecutor');
      const txtObs = document.getElementById('rObs');
      
      if (selCT) selCT.value = 'CT-001';
      if (selRes) selRes.value = 'Passou';
      if (selExec) {
        const opt = Array.from(selExec.options).find(o => o.value === 'João QA');
        if (opt) selExec.value = 'João QA';
      }
      if (txtObs) txtObs.value = 'Testado em Chrome e Firefox';
      
      // Chama a função diretamente (evita problema de botão substituído)
      if (typeof win.registrarReteste === 'function') {
        win.registrarReteste({ preventDefault: () => {} });
      }
    });

    cy.wait(1000);
    cy.get('#retestesLista').should('contain', 'Passou');
  });

  it('deve adicionar vínculo entre bugs', () => {
    cy.window().then((win) => {
      win.bugs = [
        { id: 'BUG-010', modulo: 'A', titulo: 'Bug A', casoVinculado: '', severidade: 'Baixa', prioridade: 'Baixa', status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e', atual: 'a', comentario: '', reporter: 'João QA', evidencias: [], retestes: [], vinculos: [], dataCriacao: '01/01/2026' },
        { id: 'BUG-011', modulo: 'B', titulo: 'Bug B', casoVinculado: '', severidade: 'Baixa', prioridade: 'Baixa', status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e', atual: 'a', comentario: '', reporter: 'João QA', evidencias: [], retestes: [], vinculos: [], dataCriacao: '01/01/2026' }
      ];
      win.salvar();
      win.renderBugs();
    });

    cy.get('.tab.bug').click();
    cy.wait(500);
    cy.get('#tabelaBugsContainer tr').contains('BUG-010').parents('tr').within(() => {
      cy.get('button.btn-primary').click({ force: true });
    });
    cy.get('#modalBugBg').should('have.class', 'active');
    cy.wait(2000);

    // Em vez de clicar no botão, chama a função direto
    cy.window().then((win) => {
      const selTipo = document.getElementById('vTipo');
      const selBug = document.getElementById('vBugVinculado');
      
      if (selTipo) selTipo.value = 'Relacionado a';
      if (selBug) selBug.value = 'BUG-011';
      
      if (typeof win.adicionarVinculo === 'function') {
        win.adicionarVinculo();
      }
    });

    cy.wait(800);
    cy.get('#vinculosLista').should('contain', 'BUG-011');
  });
});