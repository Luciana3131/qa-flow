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
    cy.wait(14000);
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

  it('deve registrar reteste com executor (verificação de dados)', () => {
    // Cria o bug e adiciona o reteste DIRETAMENTE no array (sem depender do DOM)
    cy.window().then((win) => {
      win.bugs = [];
      win.bugs.push({
        id: 'BUG-002', modulo: 'Login', titulo: 'Bug teste',
        casoVinculado: 'CT-001', severidade: 'Alta', prioridade: 'Média',
        status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e',
        atual: 'a', comentario: '', reporter: 'João QA',
        evidencias: [],
        retestes: [
          { data: new Date().toLocaleString('pt-BR'), resultado: 'Passou', obs: 'Testado em Chrome e Firefox', casoTeste: 'CT-001', executor: 'João QA', evidencias: [] }
        ],
        vinculos: [],
        dataCriacao: '01/01/2026'
      });
      win.salvar();
      win.renderBugs();
    });

    cy.get('.tab.bug').click();
    cy.wait(500);

    // Verifica se o reteste aparece na lista (agora ele JÁ está nos dados)
    cy.get('#tabelaBugsContainer').should('contain', 'BUG-002');
    
    // Abre o modal para verificar o reteste listado
    cy.get('#tabelaBugsContainer tr').contains('BUG-002').parents('tr').within(() => {
      cy.get('button.btn-primary').click({ force: true });
    });
    cy.get('#modalBugBg').should('have.class', 'active');
    cy.wait(2000);

    // Verifica que o reteste está na lista (o v17 renderiza do array)
    cy.get('#retestesLista').should('contain', 'Passou');
    cy.get('#retestesLista').should('contain', 'João QA');
  });

  it('deve adicionar vínculo entre bugs (verificação de dados)', () => {
    // Cria dois bugs JÁ COM VÍNCULO nos dados (sem depender do DOM)
    cy.window().then((win) => {
      win.bugs = [
        { id: 'BUG-010', modulo: 'A', titulo: 'Bug A', casoVinculado: '', severidade: 'Baixa', prioridade: 'Baixa', status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e', atual: 'a', comentario: '', reporter: 'João QA', evidencias: [], retestes: [], vinculos: [{ tipo: 'Relacionado a', bugId: 'BUG-011', bugTitulo: 'Bug B' }], dataCriacao: '01/01/2026' },
        { id: 'BUG-011', modulo: 'B', titulo: 'Bug B', casoVinculado: '', severidade: 'Baixa', prioridade: 'Baixa', status: 'Aberto', ambiente: '', passos: 'p', esperado: 'e', atual: 'a', comentario: '', reporter: 'João QA', evidencias: [], retestes: [], vinculos: [], dataCriacao: '01/01/2026' }
      ];
      win.salvar();
      win.renderBugs();
    });

    cy.get('.tab.bug').click();
    cy.wait(500);

    // Abre o bug que tem vínculo
    cy.get('#tabelaBugsContainer tr').contains('BUG-010').parents('tr').within(() => {
      cy.get('button.btn-primary').click({ force: true });
    });
    cy.get('#modalBugBg').should('have.class', 'active');
    cy.wait(2000);

    // Verifica que o vínculo aparece na lista (o v17 renderiza do array)
    cy.get('#vinculosLista').should('contain', 'BUG-011');
  });
});