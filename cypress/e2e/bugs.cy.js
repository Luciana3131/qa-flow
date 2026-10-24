describe('Bugs — CRUD, reteste e vínculos', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
    // Cria um caso de teste para vincular
    cy.window().then((win) => {
      win.casos.push({
        id: 'CT-001', modulo: 'Login', titulo: 'Login válido',
        historia: '', pre: '', passos: '1. Login', esperado: 'OK',
        obtido: '', comentario: '', status: 'Passou', prioridade: 'Alta',
        evidencias: [], data: '01/01/2026', dataCriacao: '01/01/2026'
      });
      win.salvar();
      win.render();
    });
    // Cadastra pessoa para reporter
    cy.window().then((win) => {
      win.pessoas = [{ id: 'p1', nome: 'João QA' }];
      win.salvarPessoas();
    });
    cy.reload();
  });

  it('deve criar um bug', () => {
    cy.get('.tab.bug').click();
    cy.get('#btnNovoBug').click();
    cy.get('#modalBugBg').should('have.class', 'active');
    cy.get('#bId').clear().type('BUG-001');
    cy.get('#bModulo').type('Login');
    cy.get('#bTitulo').type('Botão Entrar não responde');
    cy.get('#bCasoVinculado').select('CT-001');
    cy.get('#bSeveridade').select('Alta');
    cy.get('#bPrioridade').select('Média');
    cy.get('#bStatus').select('Aberto');
    cy.get('#bPassos').type('1. Acessar login\n2. Clicar em Entrar');
    cy.get('#bEsperado').type('Login efetuado');
    cy.get('#bAtual').type('Nada acontece');
    // Reporter
    cy.get('#bReporter').then(($sel) => {
      if ($sel.find('option').length > 1) {
        cy.wrap($sel).select('João QA');
      }
    });
    cy.get('button[type="submit"]').contains('Salvar').click();
    cy.get('#modalBugBg').should('not.have.class', 'active');
    cy.get('#tabelaBugsContainer').should('contain', 'BUG-001');
    cy.get('#tabelaBugsContainer').should('contain', 'Botão Entrar não responde');
  });

  it('deve registrar reteste com executor', () => {
    // Cria bug via window
    cy.window().then((win) => {
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
    cy.get('#tabelaBugsContainer tr').contains('BUG-002').parents('tr').within(() => {
      cy.get('button.btn-primary').click();
    });
    cy.get('#rCasoTeste').then(($sel) => {
      if ($sel.find('option').length > 1) {
        cy.wrap($sel).select('CT-001');
      }
    });
    cy.get('#rResultado').select('Passou');
    cy.get('#rExecutor').then(($sel) => {
      if ($sel.find('option').length > 1) {
        cy.wrap($sel).select('João QA');
      }
    });
    cy.get('#rObs').type('Testado em Chrome e Firefox');
    cy.get('#btnRegistrarReteste').click();
    cy.get('#retestesLista').should('contain', 'Passou');
  });

  it('deve adicionar vínculo entre bugs', () => {
    cy.window().then((win) => {
      win.bugs.push(
        { id: 'BUG-010', modulo: 'A', titulo: 'Bug A', casoVinculado: '', severidade: 'Baixa', prioridade: 'Baixa', status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e', atual: 'a', comentario: '', reporter: 'João QA', evidencias: [], retestes: [], vinculos: [], dataCriacao: '01/01/2026' },
        { id: 'BUG-011', modulo: 'B', titulo: 'Bug B', casoVinculado: '', severidade: 'Baixa', prioridade: 'Baixa', status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e', atual: 'a', comentario: '', reporter: 'João QA', evidencias: [], retestes: [], vinculos: [], dataCriacao: '01/01/2026' }
      );
      win.salvar();
      win.renderBugs();
    });

    cy.get('.tab.bug').click();
    cy.get('#tabelaBugsContainer tr').contains('BUG-010').parents('tr').within(() => {
      cy.get('button.btn-primary').click();
    });
    cy.get('#vTipo').select('Relacionado a');
    cy.get('#vBugVinculado').select('BUG-011');
    cy.get('#btnAdicionarVinculo').click();
    cy.get('#vinculosLista').should('contain', 'BUG-011');
  });
});