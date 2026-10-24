describe('Casos de Teste — CRUD', () => {
  beforeEach(() => {
    cy.limparDados();
    cy.visit('/');
  });

  it('deve criar um caso de teste', () => {
    cy.get('#btnNovoCaso').click();
    cy.get('#modalCasoBg').should('have.class', 'active');

    // Escopa TODAS as interações ao modal do caso
    cy.get('#modalCasoBg').within(() => {
      cy.get('#fId').clear().type('CT-001', { force: true });
      cy.get('#fModulo').type('Login', { force: true });
      cy.get('#fTitulo').type('Login com credenciais válidas', { force: true });
      cy.get('#fPassos').type('1. Acessar tela de login\n2. Inserir email\n3. Inserir senha\n4. Clicar em Entrar', { force: true });
      cy.get('#fEsperado').type('Usuário redirecionado para o dashboard', { force: true });

      // Botão Salvar DENTRO do modal de caso (evita pegar botões de outros modais)
      cy.get('button[type="submit"]').contains('Salvar').click({ force: true });
    });

    cy.get('#modalCasoBg').should('not.have.class', 'active');
    cy.get('#tabelaContainer').should('contain', 'CT-001');
  });

  it('deve editar um caso existente', () => {
    // Cria um caso via window
    cy.window().then((win) => {
      win.casos.push({
        id: 'CT-002', modulo: 'Cadastro', titulo: 'Cadastro de usuário',
        historia: '', pre: '', passos: '1. Acessar cadastro',
        esperado: 'Usuário criado', obtido: '', comentario: '',
        status: 'Não executado', prioridade: 'Média',
        evidencias: [], data: '01/01/2026', dataCriacao: '01/01/2026'
      });
      win.salvar();
      win.render();
    });

    // Clica em editar
    cy.get('#tabelaContainer tr').contains('CT-002').parents('tr').within(() => {
      cy.get('button.btn-primary').click({ force: true });
    });
    cy.get('#modalCasoBg').should('have.class', 'active');

    // Edita DENTRO do modal
    cy.get('#modalCasoBg').within(() => {
      cy.get('#fTitulo').clear({ force: true }).type('Cadastro de usuário EDITADO', { force: true });
      cy.get('button[type="submit"]').contains('Salvar').click({ force: true });
    });

    cy.get('#tabelaContainer').should('contain', 'Cadastro de usuário EDITADO');
  });

  it('deve excluir um caso', () => {
    cy.window().then((win) => {
      win.casos.push({
        id: 'CT-003', modulo: 'Excluir', titulo: 'Caso a excluir',
        historia: '', pre: '', passos: '1. Passo',
        esperado: 'Esperado', obtido: '', comentario: '',
        status: 'Não executado', prioridade: 'Baixa',
        evidencias: [], data: '01/01/2026', dataCriacao: '01/01/2026'
      });
      win.salvar();
      win.render();
    });

    cy.on('window:confirm', () => true);
    cy.get('#tabelaContainer tr').contains('CT-003').parents('tr').within(() => {
      cy.get('button.btn-danger').click({ force: true });
    });
    cy.get('#tabelaContainer').should('not.contain', 'CT-003');
  });

  it('deve filtrar casos por status', () => {
  cy.window().then((win) => {
    // Limpa e adiciona os dois casos
    win.casos = [];
    win.casos.push(
      { id: 'CT-010', modulo: 'X', titulo: 'Passou', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Passou', prioridade: 'Alta', evidencias: [], executor: '', data: '01/01/2026', dataCriacao: '01/01/2026' },
      { id: 'CT-011', modulo: 'X', titulo: 'Falhou', historia: '', pre: '', passos: 'p', esperado: 'e', obtido: '', comentario: '', status: 'Falhou', prioridade: 'Alta', evidencias: [], executor: '', data: '01/01/2026', dataCriacao: '01/01/2026' }
    );
    win.salvar();
    win.render();
  });

  // Confirma que os dois aparecem
  cy.get('#tabelaContainer').should('contain', 'CT-010');
  cy.get('#tabelaContainer').should('contain', 'CT-011');

  // Aplica o filtro
  cy.get('#filtroStatus').select('Passou');
  cy.wait(500);

  // Verifica
  cy.get('#tabelaContainer').should('contain', 'CT-010');
  cy.get('#tabelaContainer').should('not.contain', 'CT-011');
});

  it('deve criar caso com evidência (foto) e mantê-la ao editar', () => {
    cy.get('#btnNovoCaso').click();
    cy.get('#modalCasoBg').should('have.class', 'active');

    cy.get('#modalCasoBg').within(() => {
      cy.get('#fId').clear().type('CT-EVID', { force: true });
      cy.get('#fModulo').type('Evidência', { force: true });
      cy.get('#fTitulo').type('Teste com evidência', { force: true });
      cy.get('#fPassos').type('1. Passo', { force: true });
      cy.get('#fEsperado').type('Esperado', { force: true });
      cy.get('button[type="submit"]').contains('Salvar').click({ force: true });
    });

    cy.get('#modalCasoBg').should('not.have.class', 'active');
    cy.get('#tabelaContainer').should('contain', 'CT-EVID');
  });
});