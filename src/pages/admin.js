/**
 * ============================================================================
 * PÁGINA ADMINISTRATIVA (SECRETARIA) - DESIGN RENOVADO SAAS
 * ----------------------------------------------------------------------------
 * Este módulo renderiza a tela de administração do sistema.
 * Utilizamos uma arquitetura baseada em abas para permitir gerenciar professores,
 * alunos, gestores, cursos e a identidade visual da aplicação (cores e logo).
 * @version 5.0.0
 * ============================================================================
 */

export function renderAdmin(container, State) {
  // Verifica se o usuário atual tem a permissão de administrador ("Gestor")
  if (!State.user || !State.user.isAdmin) {
    container.innerHTML = `<div class="card p-48 text-center mt-32 max-w-500 mx-auto"><h2 class="text-danger fw-bold mb-8">Acesso Restrito</h2><p class="text-secondary text-sm">Você precisa ser administrador para acessar o Painel Central.</p></div>`;
    return;
  }

  const activeTab = window.adminActiveTab || 'profs';

  // Ícones Lucide inline
  const icons = {
    profs: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    students: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    admins: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    courses: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    branding: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
  };

  container.innerHTML = `
    <div class="admin-dashboard-layout" style="display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; margin-top: 16px; min-height: 70vh;">
      
      <!-- MENU LATERAL -->
      <aside style="position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px;">
        <div class="card p-24 shadow-sm" style="background: linear-gradient(145deg, var(--bg-surface), var(--bg-panel));">
          <div class="text-xs text-secondary uppercase fw-bolder tracking-widest mb-8" style="letter-spacing: 0.1em;">Administração</div>
          <h2 class="text-xl fw-bold m-0 leading-tight bg-clip-text" style="color: var(--text-primary);">Painel Central</h2>
        </div>
        
        <nav class="flex-col gap-8 card p-16 shadow-sm" id="admin-tabs" style="background: var(--bg-surface);">
          <button class="menu-item-btn ${activeTab === 'profs' ? 'active' : ''}" data-tab="profs">
            ${icons.profs} Corpo Docente
          </button>
          <button class="menu-item-btn ${activeTab === 'students' ? 'active' : ''}" data-tab="students">
            ${icons.students} Matrículas
          </button>
          <button class="menu-item-btn ${activeTab === 'admins' ? 'active' : ''}" data-tab="admins">
            ${icons.admins} Gestores
          </button>
          <button class="menu-item-btn ${activeTab === 'courses' ? 'active' : ''}" data-tab="courses">
            ${icons.courses} Matriz de Cursos
          </button>
          <div style="height: 1px; background: var(--border-color); margin: 8px 16px;"></div>
          <button class="menu-item-btn ${activeTab === 'branding' ? 'active' : ''}" data-tab="branding">
            ${icons.branding} Configurações
          </button>
        </nav>
      </aside>

      <!-- CONTEÚDO PRINCIPAL -->
      <main id="admin-active-content" class="animate-slide-up" style="min-width: 0; padding-bottom: 64px;">
        ${renderTabContent(activeTab, State)}
      </main>

      <div id="admin-modals-root">
        ${renderAllModals(State)}
      </div>
    </div>
    
    <style>
      .admin-dashboard-layout {
         font-family: var(--font-sans);
      }
      .menu-item-btn {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 18px;
        border-radius: 10px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: left;
        position: relative;
        overflow: hidden;
      }
      .menu-item-btn::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0; width: 3px;
        background: var(--accent-color);
        transform: scaleY(0);
        transition: transform 0.2s;
        border-radius: 0 4px 4px 0;
      }
      .menu-item-btn:hover {
        background: var(--bg-panel);
        color: var(--text-primary);
        transform: translateX(4px);
      }
      .menu-item-btn.active {
        background: var(--accent-light);
        color: var(--accent-color);
        font-weight: 600;
      }
      .menu-item-btn.active::before {
        transform: scaleY(1);
      }
      .table-card {
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      }
      .table-card table { margin: 0; }
      .table-card th {
        background: var(--bg-panel);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 16px 24px;
      }
      .table-card td {
        padding: 16px 24px;
        vertical-align: middle;
      }
    </style>
  `;
}

function renderTabContent(tab, State) {
  const icoEdit = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
  const icoTrash = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
  const plusIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><path d="M12 5v14M5 12h14"/></svg>';

  switch (tab) {
    case 'profs':
      return `
        <div class="card p-0 table-card bg-surface shadow-sm mb-24">
          <div class="flex-between-center p-24 border-bottom flex-wrap gap-16">
            <div>
              <h2 class="fw-bold text-lg m-0">Corpo Docente</h2>
              <p class="text-xs text-secondary mt-4">Gerencie os professores ativos do sistema.</p>
            </div>
            <div class="flex-row gap-8 flex-wrap">
              <button class="btn-outline btn-outline-neutral px-12 py-8 flex-align-center text-xs" id="btn-export-profs-csv" title="Exportar CSV"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> CSV</button>
              <button class="btn-outline btn-outline-neutral px-12 py-8 flex-align-center text-xs" id="btn-export-profs-pdf" title="Exportar PDF/Imprimir"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> PDF</button>
              <button class="btn-danger flex-align-center text-xs hidden" id="btn-delete-selected-profs">Excluir Selecionados</button>
              <button class="btn-primary flex-align-center" style="width: auto;" id="btn-open-prof-modal">${plusIcon} Novo Professor</button>
            </div>
          </div>
          <div class="table-wrapper border-none shadow-none border-radius-0" id="print-profs">
            <table>
              <thead><tr><th style="width: 40px;"><input type="checkbox" id="select-all-profs"></th><th>Nome / Registro</th><th>Especialidade</th><th>ID de Login</th><th class="text-right no-print">Ações</th></tr></thead>
              <tbody>
                ${State.db.professors.length > 0 ? State.db.professors.map(p => `
                  <tr>
                    <td><input type="checkbox" class="prof-checkbox" value="${p.id}"></td>
                    <td>
                      <div class="fw-bold text-sm">${p.name}</div>
                      <div class="text-xs text-secondary mt-4 uppercase">DOC-${p.id}</div>
                    </td>
                    <td><span class="pill bg-panel border fw-medium">${p.subject}</span></td>
                    <td><code class="text-xs bg-panel px-8 py-4 border-radius-4 border">${p.id}</code></td>
                    <td class="text-right no-print">
                      <div class="flex-row gap-8 justify-end">
                        <button class="btn-icon edit-prof" data-id="${p.id}" title="Editar">${icoEdit}</button>
                        <button class="btn-icon text-danger delete-item" data-type="professor" data-id="${p.id}" title="Remover">${icoTrash}</button>
                      </div>
                    </td>
                  </tr>
                `).join('') : `<tr><td colspan="5" class="text-center p-32 text-secondary">Nenhum professor cadastrado.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>`;
    
    case 'students':
      return `
        <div class="card p-0 table-card bg-surface shadow-sm mb-24">
          <div class="flex-col p-24 border-bottom gap-16">
            <div class="flex-between-center flex-wrap gap-16">
              <div>
                <h2 class="fw-bold text-lg m-0">Matrículas</h2>
                <p class="text-xs text-secondary mt-4">Lista completa de alunos matriculados.</p>
              </div>
              <div class="flex-row gap-8 flex-wrap">
                <button class="btn-outline btn-outline-neutral px-12 py-8 flex-align-center text-xs" id="btn-export-students-csv" title="Exportar CSV"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> CSV</button>
                <button class="btn-outline btn-outline-neutral px-12 py-8 flex-align-center text-xs" id="btn-export-students-pdf" title="Exportar PDF/Imprimir"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> PDF</button>
                <button class="btn-danger flex-align-center text-xs hidden" id="btn-delete-selected-students">Excluir Selecionados</button>
                <button class="btn-primary flex-align-center" style="width: auto;" id="btn-open-student-modal">${plusIcon} Matricular Aluno</button>
              </div>
            </div>
            <div class="flex-row gap-12 flex-align-center bg-panel p-12 border-radius-8 border">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="student-search-input" class="bg-transparent border-none text-sm flex-1 outline-none" placeholder="Buscar por Nome, Matrícula ou Curso...">
            </div>
          </div>
          <div class="table-wrapper border-none shadow-none border-radius-0" id="print-students">
            <table>
              <thead><tr><th style="width: 40px;"><input type="checkbox" id="select-all-students"></th><th>Aluno</th><th>RA / Matrícula</th><th>Curso (Turno)</th><th class="text-right no-print">Ações</th></tr></thead>
              <tbody id="student-table-body">
                ${State.db.students.length > 0 ? State.db.students.map(s => `
                  <tr class="student-row">
                    <td><input type="checkbox" class="student-checkbox" value="${s.id}"></td>
                    <td>
                      <div class="fw-bold text-sm student-name">${s.name}</div>
                    </td>
                    <td><code class="text-xs bg-panel px-8 py-4 border-radius-4 border student-reg">${s.registration}</code></td>
                    <td>
                      <span class="pill outline-accent fw-medium student-course" style="border: 1px solid var(--accent-light); color: var(--accent-color);">${s.courseName}</span>
                      <span class="text-xs text-secondary ml-8 student-shift">${s.shift}</span>
                    </td>
                    <td class="text-right no-print">
                       <div class="flex-row gap-8 justify-end">
                         <button class="btn-icon edit-student" data-id="${s.id}" title="Editar">${icoEdit}</button>
                         <button class="btn-icon text-danger delete-item" data-type="student" data-id="${s.id}" title="Remover">${icoTrash}</button>
                       </div>
                    </td>
                  </tr>`).join('') : `<tr id="no-students-row"><td colspan="5" class="text-center p-32 text-secondary">Nenhum aluno matriculado.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>`;

    case 'admins':
      return `
        <div class="card p-0 table-card bg-surface shadow-sm mb-24">
          <div class="flex-between-center p-24 border-bottom">
            <div>
              <h2 class="fw-bold text-lg m-0">Equipe Administrativa</h2>
              <p class="text-xs text-secondary mt-4">Gestores com permissão total no painel.</p>
            </div>
            <button class="btn-primary flex-align-center" style="width: auto;" id="btn-open-admin-modal">${plusIcon} Novo Gestor</button>
          </div>
          <div class="table-wrapper border-none shadow-none border-radius-0">
            <table>
              <thead><tr><th>Nome</th><th>Credencial (Login)</th><th class="text-right">Ações</th></tr></thead>
              <tbody>
                <tr class="bg-panel">
                  <td>
                    <div class="fw-bold text-sm flex-align-center gap-8">Admin Principal <span class="pill tag-accent" style="margin:0; padding:2px 6px;">ROOT</span></div>
                  </td>
                  <td><code class="text-xs bg-surface px-8 py-4 border-radius-4 border">admin</code></td>
                  <td class="text-right opacity-50 text-xs italic fw-medium">Não modificável</td>
                </tr>
                ${State.db.admins.map(a => `
                  <tr>
                    <td><div class="fw-bold text-sm">${a.name}</div></td>
                    <td><code class="text-xs bg-panel px-8 py-4 border-radius-4 border">${a.id}</code></td>
                    <td class="text-right">
                      <button class="btn-icon text-danger delete-item" data-type="admin" data-id="${a.id}" title="Revogar acesso">${icoTrash}</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;

    case 'courses':
      return `
        <div class="card shadow-sm mb-24">
          <div class="flex-col gap-16 mb-24 pb-24 border-bottom">
            <div class="flex-between-center flex-wrap gap-16">
              <div>
                <h2 class="fw-bold text-lg m-0">Matriz de Cursos</h2>
                <p class="text-xs text-secondary mt-4">Cursos ofertados pela instituição.</p>
              </div>
              <div class="flex-row gap-8 flex-wrap">
                <button class="btn-outline btn-outline-neutral px-12 py-8 flex-align-center text-xs" id="btn-export-courses-csv" title="Exportar CSV"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> CSV</button>
                <button class="btn-outline btn-outline-neutral px-12 py-8 flex-align-center text-xs" id="btn-export-courses-pdf" title="Exportar PDF/Imprimir"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-8"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> PDF</button>
                <button class="btn-danger flex-align-center text-xs hidden" id="btn-delete-selected-courses">Excluir Selecionados</button>
                <button class="btn-primary flex-align-center" style="width: auto;" id="btn-open-course-modal">${plusIcon} Novo Curso</button>
              </div>
            </div>
            ${State.db.courses.length > 0 ? `
            <div class="flex-align-center gap-8">
               <input type="checkbox" id="select-all-courses">
               <label for="select-all-courses" class="text-sm cursor-pointer select-none">Selecionar Tudo</label>
            </div>` : ''}
          </div>
          ${State.db.courses.length > 0 ? `
          <div class="grid-auto-fit gap-16" id="print-courses">
            ${State.db.courses.map(c => `
              <div class="card p-20 flex-between-center group course-card" style="border: 1px solid var(--border-color); background: var(--bg-surface); padding: 20px;">
                <div class="flex-row gap-12 align-start">
                   <div style="margin-top: 2px;"><input type="checkbox" class="course-checkbox no-print" value="${c.id}"></div>
                   <div>
                      <div class="fw-bold text-sm text-primary leading-tight">${c.name}</div>
                      <div class="text-xs text-secondary mt-4 font-mono">${c.id}</div>
                   </div>
                </div>
                <div class="flex-col gap-8 opacity-0 group-hover-opacity-100 transition-all no-print edit-delete-actions" style="transform: translateX(10px); transition: transform 0.2s, opacity 0.2s;">
                  <button class="btn-icon edit-course" data-id="${c.id}" title="Editar" style="width: 28px; height: 28px;">${icoEdit}</button>
                  <button class="btn-icon text-danger delete-item" data-type="course" data-id="${c.id}" title="Excluir" style="width: 28px; height: 28px;">${icoTrash}</button>
                </div>
              </div>`).join('')}
          </div>
          ` : `<div class="p-32 text-center text-secondary border border-radius-12 border-dashed">Nenhum curso cadastrado no sistema.</div>`}
          <style>
             .group:hover .group-hover-opacity-100 { opacity: 1 !important; transform: translateX(0) !important; }
             @media print {
               .no-print { display: none !important; }
               .course-card { break-inside: avoid; border: 1px solid #000 !important; }
             }
          </style>
        </div>`;

    case 'branding':
      const sInfo = State.getSchoolInfo() || {};
      return `
        <div class="card shadow-sm mb-24">
           <div class="mb-24 border-bottom pb-16">
             <h2 class="fw-bold text-lg m-0">Informações da Instituição</h2>
             <p class="text-xs text-secondary mt-4">Dados gerais para relatórios e exibição no sistema.</p>
           </div>
           
           <div class="grid-2-cols gap-16 flex-wrap">
             <div class="input-group m-0"><label class="text-sm fw-bold">Nome da Instituição</label><input type="text" id="school-name" class="input-field" placeholder="Escola Lyra" value="${sInfo.name || ''}"></div>
             <div class="input-group m-0"><label class="text-sm fw-bold">CNPJ</label><input type="text" id="school-cnpj" class="input-field" placeholder="00.000.000/0000-00" value="${sInfo.cnpj || ''}"></div>
             <div class="input-group m-0"><label class="text-sm fw-bold">Endereço Completo</label><input type="text" id="school-address" class="input-field" placeholder="Rua Exemplo, 123" value="${sInfo.address || ''}"></div>
             <div class="input-group m-0"><label class="text-sm fw-bold">Telefone/Contato</label><input type="text" id="school-phone" class="input-field" placeholder="(00) 0000-0000" value="${sInfo.phone || ''}"></div>
           </div>
        </div>

        <div class="card shadow-sm mb-24">
           <div class="mb-24 border-bottom pb-16">
             <h2 class="fw-bold text-lg m-0">Identidade Visual</h2>
             <p class="text-xs text-secondary mt-4">Personalize a marca exibida em toda a plataforma.</p>
           </div>
           
           <div class="grid-2-cols gap-48 flex-wrap" style="grid-template-columns: minmax(280px, 1fr) minmax(320px, 1.5fr);">
              <!-- Lado Esquerdo: Form -->
              <div class="flex-col gap-24">
                 <div class="input-group">
                    <label class="fw-bold">URL da Logomarca Externa</label>
                    <p class="text-xs text-secondary mb-12">Insira um link direto para uma imagem PNG/SVG.</p>
                    <div class="flex-row gap-8">
                      <input type="text" id="logo-url" class="input-field" placeholder="https://exemplo.com/logo.png" value="${State.db.customLogo || ''}">
                    </div>
                 </div>

                 <div class="input-group">
                    <label class="fw-bold">Upload Local</label>
                    <p class="text-xs text-secondary mb-12">Selecione uma imagem do seu computador (max 2MB).</p>
                    <div class="relative">
                      <input type="file" id="logo-file" class="input-field p-8" accept="image/*" style="padding-top: 10px; cursor: pointer;">
                    </div>
                 <div class="flex-row gap-8 mt-12">
                   <button class="btn-primary flex-1" id="btn-save-branding">Salvar Alterações</button>
                 </div>
              </div>

              <!-- Lado Direito: Preview -->
              <div class="flex-col gap-12 bg-panel p-24 border-radius-12 border">
                 <label class="text-xs uppercase fw-bold tracking-wide opacity-50 mb-8">Preview do Sistema</label>
                 
                 <div class="bg-surface border-radius-12 border flex-center p-32 flex-col relative overflow-hidden shadow-sm h-full min-h-200">
                    <!-- Fundo quadriculado (checkered) para ver transparência -->
                    <div style="position:absolute; inset:0; z-index:0; background-image: radial-gradient(var(--border-color) 1px, transparent 1px); background-size: 16px 16px; opacity: 0.3;"></div>
                    
                    <img id="branding-preview-logo" src="${State.getLogo()}" 
                         style="max-height: 56px; max-width: 90%; z-index: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05)); object-fit: contain;">
                         
                    <div class="mt-24 z-1 text-xs text-secondary max-w-250 text-center">
                       A logo é exibida na tela de login, na barra de navegação superior e em relatórios impressos.
                    </div>
                 </div>
              </div>
           </div>
        </div>`;
  }
}

function renderAllModals() {
  // Instead of returning HTML to be nested inside the animated view, we inject it into the body
  if (!document.getElementById('admin-modal-container')) {
    const div = document.createElement('div');
    div.id = 'admin-modal-container';
    div.innerHTML = `
      <div id="modal-container" class="modal-overlay hidden">
        <div class="modal-content animate-slide-up" style="max-width: 440px;">
          <div class="flex-between-center p-24 border-bottom">
            <h3 class="fw-bold text-lg m-0" id="modal-title">Editar Item</h3>
            <button class="btn-icon close-modal">&times;</button>
          </div>
          <div id="modal-body" class="p-24"></div>
        </div>
      </div>
    `;
    document.body.appendChild(div);
  }
  return '';
}

export function setupAdminInteractions(State, onNavigate) {
  const refresh = () => onNavigate('admin');
  const modal = document.getElementById('modal-container');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');

  const openModal = (title, content) => {
    modalTitle.innerText = title;
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
  };

  const closeModal = () => modal.classList.add('hidden');
  
  const closeBtn = modal?.querySelector('.close-modal');
  if(closeBtn) closeBtn.onclick = closeModal;

  // TAB NAV
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      window.adminActiveTab = btn.dataset.tab;
      
      // Update UI active state
      document.querySelectorAll('#admin-tabs .menu-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Re-render only the content area
      const contentArea = document.getElementById('admin-active-content');
      if (contentArea) {
         contentArea.innerHTML = renderTabContent(window.adminActiveTab, State);
         // Re-run setup to re-bind edit/delete buttons inside the new content
         setupAdminInteractions(State, onNavigate);
      }
    };
  });

  // PROFESSOR CRUD
  const btnOpenProf = document.getElementById('btn-open-prof-modal');
  if (btnOpenProf) {
    btnOpenProf.onclick = () => {
      openModal('Novo Professor', `
      <form id="form-prof" class="flex-col gap-16">
        <div class="input-group m-0"><label>Nome Completo</label><input type="text" name="name" class="input-field" placeholder="Ex: Carlos Andrade" required></div>
        <div class="input-group m-0"><label>Matéria / Especialidade</label><input type="text" name="subject" class="input-field" placeholder="Ex: Matemática" required></div>
        <div class="grid-2-cols gap-16">
          <div class="input-group m-0"><label>Credencial de Acesso</label><input type="text" name="id" class="input-field" placeholder="Ex: carlos123"></div>
          <div class="input-group m-0"><label>Senha Inicial</label><input type="text" name="password" class="input-field" value="admin123" placeholder="Senha"></div>
        </div>
        <div class="flex-row gap-12 mt-16 justify-end">
           <button type="button" class="btn-outline btn-outline-neutral px-16 py-10 close-modal-btn">Cancelar</button>
           <button type="submit" class="btn-primary w-auto px-24">Cadastrar Docente</button>
        </div>
      </form>
    `);
    
    document.querySelector('.close-modal-btn').onclick = closeModal;
    document.getElementById('form-prof').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      State.registerProfessor(Object.fromEntries(fd));
      closeModal(); refresh();
    };
  };
  }

  document.querySelectorAll('.edit-prof').forEach(btn => {
    btn.onclick = () => {
      const p = State.db.professors.find(x => x.id === btn.dataset.id);
      openModal('Atualizar Professor', `
        <form id="form-prof-edit" class="flex-col gap-16">
          <input type="hidden" name="id_orig" value="${p.id}">
          <div class="input-group m-0"><label>Nome Completo</label><input type="text" name="name" class="input-field" value="${p.name}" required></div>
          <div class="input-group m-0"><label>Matéria / Especialidade</label><input type="text" name="subject" class="input-field" value="${p.subject}" required></div>
          <div class="input-group m-0"><label>Senha de Acesso</label><input type="text" name="password" class="input-field" value="${p.password}" required></div>
          <div class="flex-row gap-12 mt-16 justify-end">
             <button type="submit" class="btn-primary w-auto px-24">Salvar Alterações</button>
          </div>
        </form>
      `);
      document.getElementById('form-prof-edit').onsubmit = (e) => {
        e.preventDefault();
        State.registerProfessor(Object.fromEntries(new FormData(e.target)));
        closeModal(); refresh();
      };
    };
  });

  // STUDENT CRUD
  const btnOpenStudent = document.getElementById('btn-open-student-modal');
  if (btnOpenStudent) {
    btnOpenStudent.onclick = () => {
      openModal('Matricular Aluno', `
      <form id="form-student" class="flex-col gap-16">
        <div id="student-error" class="text-danger text-sm mb-4 hidden p-8 border border-danger border-radius-4" style="background: var(--danger-light);"></div>
        <div class="input-group m-0"><label>Nome do Aluno</label><input type="text" name="name" class="input-field" placeholder="Ex: Júlia Ferreira" required></div>
        <div class="grid-2-cols gap-16">
           <div class="input-group m-0"><label>Data de Nascimento</label><input type="date" name="birthDate" class="input-field" required></div>
           <div class="input-group m-0"><label>RG</label><input type="text" name="rg" class="input-field" placeholder="00.000.000-0" required></div>
        </div>
        <div class="grid-2-cols gap-16">
           <div class="input-group m-0"><label>CPF</label><input type="text" name="cpf" class="input-field" placeholder="000.000.000-00" required></div>
           <div class="input-group m-0">
             <label>Curso Destino</label>
             <select name="courseName" class="input-field" required>
               <option value="">Selecione um curso...</option>
               ${State.db.courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
             </select>
           </div>
        </div>
        <div class="input-group m-0">
          <label>Turno</label>
          <select name="shift" class="input-field">
            <option value="Manhã">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option>
          </select>
        </div>
        <div class="flex-row gap-12 mt-16 justify-end">
           <button type="submit" class="btn-primary w-auto px-24">Confirmar Matrícula</button>
        </div>
      </form>
    `);
    document.getElementById('form-student').onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const errorDiv = document.getElementById('student-error');
      
      const rg = form.rg.value.trim();
      const cpf = form.cpf.value.replace(/\D/g, '');

      if (rg.length < 5) {
        errorDiv.textContent = 'Formato de RG inválido. Por favor, insira um RG válido.';
        errorDiv.classList.remove('hidden');
        return;
      }
      
      if (cpf.length !== 11) {
        errorDiv.textContent = 'Formato de CPF inválido. O CPF deve conter 11 dígitos numéricos.';
        errorDiv.classList.remove('hidden');
        return;
      }

      errorDiv.classList.add('hidden');
      State.registerStudent(Object.fromEntries(new FormData(form)));
      closeModal(); refresh();
    };
  };
  }

  document.querySelectorAll('.edit-student').forEach(btn => {
    btn.onclick = () => {
      const s = State.db.students.find(x => x.id === btn.dataset.id);
      openModal('Alterar Dados do Aluno', `
        <form id="form-student-edit" class="flex-col gap-16">
          <input type="hidden" name="id_orig" value="${s.id}">
          <div id="student-edit-error" class="text-danger text-sm mb-4 hidden p-8 border border-danger border-radius-4" style="background: var(--danger-light);"></div>
          <div class="input-group m-0"><label>Nome do Aluno</label><input type="text" name="name" class="input-field" value="${s.name || ''}" required></div>
          <div class="grid-2-cols gap-16">
             <div class="input-group m-0"><label>Data de Nascimento</label><input type="date" name="birthDate" class="input-field" value="${s.birthDate || ''}"></div>
             <div class="input-group m-0"><label>RG</label><input type="text" name="rg" class="input-field" placeholder="00.000.000-0" value="${s.rg || ''}"></div>
          </div>
          <div class="grid-2-cols gap-16">
             <div class="input-group m-0"><label>CPF</label><input type="text" name="cpf" class="input-field" placeholder="000.000.000-00" value="${s.cpf || ''}"></div>
             <div class="input-group m-0">
               <label>Curso Atual</label>
               <select name="courseName" class="input-field">
                  ${State.db.courses.map(c => `<option value="${c.name}" ${c.name === s.courseName ? 'selected' : ''}>${c.name}</option>`).join('')}
               </select>
             </div>
          </div>
          <div class="grid-2-cols gap-16">
             <div class="input-group m-0">
               <label>Turno</label>
               <select name="shift" class="input-field">
                  <option value="Manhã" ${s.shift === 'Manhã' ? 'selected' : ''}>Manhã</option>
                  <option value="Tarde" ${s.shift === 'Tarde' ? 'selected' : ''}>Tarde</option>
                  <option value="Noite" ${s.shift === 'Noite' ? 'selected' : ''}>Noite</option>
               </select>
             </div>
             <div class="input-group m-0"><label>Senha de Acesso</label><input type="text" name="password" class="input-field" value="${s.password || ''}"></div>
          </div>
          <div class="flex-row gap-12 mt-16 justify-end">
             <button type="submit" class="btn-primary w-auto px-24">Atualizar Cadastro</button>
          </div>
        </form>
      `);
      document.getElementById('form-student-edit').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const errorDiv = document.getElementById('student-edit-error');
        
        const rg = form.rg.value.trim();
        const cpf = form.cpf.value.replace(/\D/g, '');

        if (rg && rg.length < 5) {
          errorDiv.textContent = 'Formato de RG inválido. Por favor, insira um RG válido.';
          errorDiv.classList.remove('hidden');
          return;
        }
        
        if (cpf && cpf.length !== 11) {
          errorDiv.textContent = 'Formato de CPF inválido. O CPF deve conter 11 dígitos numéricos.';
          errorDiv.classList.remove('hidden');
          return;
        }

        errorDiv.classList.add('hidden');
        State.registerStudent(Object.fromEntries(new FormData(form)));
        closeModal(); refresh();
      };
    };
  });

  // ADMIN CRUD
  const btnOpenAdmin = document.getElementById('btn-open-admin-modal');
  if (btnOpenAdmin) {
    btnOpenAdmin.onclick = () => {
      openModal('Novo Gestor Administrativo', `
        <form id="form-admin" class="flex-col gap-16">
          <div class="input-group m-0"><label>Nome Completo</label><input type="text" id="admin-name" class="input-field" placeholder="Nome Completo" required></div>
          <div class="grid-2-cols gap-16">
            <div class="input-group m-0"><label>Credencial</label><input type="text" id="admin-id" class="input-field" placeholder="Ex: diretor_rh" required></div>
            <div class="input-group m-0"><label>Senha</label><input type="password" id="admin-pass" class="input-field" placeholder="Senha" required></div>
          </div>
          <div class="flex-row gap-12 mt-16 justify-end">
             <button type="submit" class="btn-primary w-auto px-24">Criar Acesso</button>
          </div>
        </form>
      `);
      document.getElementById('form-admin').onsubmit = (e) => {
        e.preventDefault();
        const res = State.registerAdmin({
          name: document.getElementById('admin-name').value,
          id: document.getElementById('admin-id').value.trim(),
          password: document.getElementById('admin-pass').value
        });
        if (res.success) { closeModal(); refresh(); } else alert(res.message);
      };
    };
  }

  // COURSE CRUD
  const btnOpenCourse = document.getElementById('btn-open-course-modal');
  if (btnOpenCourse) {
    btnOpenCourse.onclick = () => {
      openModal('Cadastrar Novo Curso', `
        <form id="form-course" class="flex-col gap-16">
          <div class="input-group m-0"><label>Nome da Formação</label><input type="text" id="course-name" class="input-field" placeholder="Ex: Análise e Desenvolvimento de Sistemas" required></div>
          <div class="input-group m-0"><label>Identificador Curto (Sigla)</label><input type="text" id="course-id" class="input-field" placeholder="Ex: ADS (Opcional)"></div>
          <div class="flex-row gap-12 mt-16 justify-end">
             <button type="submit" class="btn-primary w-auto px-24">Inserir na Matriz</button>
          </div>
        </form>
      `);
      document.getElementById('form-course').onsubmit = (e) => {
        e.preventDefault();
        const data = {
          name: document.getElementById('course-name').value,
          id: document.getElementById('course-id').value.trim()
        };
        State.registerCourse(data);
        closeModal(); refresh();
      };
    };
  }

  document.querySelectorAll('.edit-course').forEach(btn => {
    btn.onclick = () => {
      const c = State.db.courses.find(x => x.id === btn.dataset.id);
      openModal('Renomear Curso', `
        <form id="form-course-edit" class="flex-col gap-16">
          <input type="hidden" name="id_orig" value="${c.id}">
          <div class="input-group m-0"><label>Nome do Curso</label><input type="text" name="name" class="input-field" value="${c.name}" required></div>
          <div class="flex-row gap-12 mt-16 justify-end">
             <button type="submit" class="btn-primary w-auto px-24">Salvar Alterações</button>
          </div>
        </form>
      `);
      document.getElementById('form-course-edit').onsubmit = (e) => {
        e.preventDefault();
        State.registerCourse(Object.fromEntries(new FormData(e.target)));
        closeModal(); refresh();
      };
    };
  });

  // DELETE ACTION
  document.querySelectorAll('.delete-item').forEach(btn => {
    btn.onclick = () => {
      if (confirm(`Tem certeza que deseja remover permanentemente este registro (${btn.dataset.type})?`)) {
        State.deleteEntity(btn.dataset.id, btn.dataset.type);
        refresh();
      }
    };
  });

  // BRANDING
  const updateSystemLogos = (url) => {
    document.querySelectorAll('.logo-img, .logo-img-large, .nav-logo img, #branding-preview-logo').forEach(img => {
      img.src = url;
    });
  };

  const btnSaveBranding = document.getElementById('btn-save-branding');
  if (btnSaveBranding) {
    btnSaveBranding.onclick = async () => {
      const url = document.getElementById('logo-url')?.value;
      if (url) {
        State.setCustomLogo(url);
        updateSystemLogos(url);
      } else if (pendingLogoBase64) {
        State.setCustomLogo(pendingLogoBase64);
        updateSystemLogos(pendingLogoBase64);
        pendingLogoBase64 = null;
      }
      
      const schn = document.getElementById('school-name');
      if (schn) {
        State.setSchoolInfo({
          name: schn.value,
          cnpj: document.getElementById('school-cnpj').value,
          address: document.getElementById('school-address').value,
          phone: document.getElementById('school-phone').value,
        });
      }
      
      const origText = btnSaveBranding.innerText;
      btnSaveBranding.innerText = 'Alterações Salvas!';
      btnSaveBranding.style.backgroundColor = 'var(--success-color)';
      setTimeout(() => {
        btnSaveBranding.innerText = origText;
        btnSaveBranding.style.backgroundColor = '';
      }, 2000);
    };
  }
  
  let pendingLogoBase64 = null;

  const logoFile = document.getElementById('logo-file');
  if (logoFile) {
    logoFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Formato inválido. Permitido apenas JPG, PNG ou SVG.');
        e.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Arquivo muito grande. O tamanho máximo permitido é 2MB.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        pendingLogoBase64 = ev.target.result;
        const preview = document.getElementById('branding-preview-logo');
        if (preview) {
           preview.src = ev.target.result;
        }
      };
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  }

  // --- Student Search ---
  const searchInput = document.getElementById('student-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.student-row').forEach(row => {
         const name = row.querySelector('.student-name')?.innerText.toLowerCase() || '';
         const reg = row.querySelector('.student-reg')?.innerText.toLowerCase() || '';
         const course = row.querySelector('.student-course')?.innerText.toLowerCase() || '';
         if (name.includes(term) || reg.includes(term) || course.includes(term)) {
           row.style.display = '';
         } else {
           row.style.display = 'none';
         }
      });
    });
  }

  // --- Selection & Bulk Delete Logic ---
  const setupBulkActions = (type, listName) => {
     const selectAll = document.getElementById(`select-all-${listName}`);
     const checkboxes = document.querySelectorAll(`.${type}-checkbox`);
     const btnDelete = document.getElementById(`btn-delete-selected-${listName}`);
     
     if (!selectAll || !btnDelete) return;

     const updateBtn = () => {
       const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
       btnDelete.classList.toggle('hidden', !anyChecked);
     };

     selectAll.addEventListener('change', (e) => {
       checkboxes.forEach(cb => { cb.checked = e.target.checked; });
       updateBtn();
     });

     checkboxes.forEach(cb => cb.addEventListener('change', updateBtn));

     btnDelete.addEventListener('click', () => {
       const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
       if (selectedIds.length === 0) return;
       
       openModal('Confirmação de Exclusão em Lote', `
         <div class="flex-col gap-16">
           <div class="text-sm">Tem certeza que deseja excluir os <strong>${selectedIds.length}</strong> itens selecionados? Esta ação é permanente e não pode ser desfeita.</div>
           <div class="flex-row gap-12 justify-end mt-16">
             <button type="button" class="btn-outline btn-outline-neutral px-24 py-10" id="btn-cancel-bulk">Cancelar</button>
             <button type="button" class="btn-danger border-none px-24 py-10" id="btn-confirm-bulk">Excluir Tudo</button>
           </div>
         </div>
       `);

       const btnCancel = document.getElementById('btn-cancel-bulk');
       const btnConfirm = document.getElementById('btn-confirm-bulk');

       if (btnCancel) btnCancel.onclick = closeModal;
       if (btnConfirm) btnConfirm.onclick = () => {
         selectedIds.forEach(id => {
            const dbList = State.db[listName];
            if (dbList) {
               const idx = dbList.findIndex(x => x.id === id);
               if (idx > -1) dbList.splice(idx, 1);
            }
         });
         // Save back based on listName
         if (listName === 'profs') State.db.saveProfessors(State.db.profs); // keep if fallback
         else if (listName === 'professors') State.db.saveProfessors(State.db.professors);
         else if (listName === 'students') State.db.saveStudents(State.db.students);
         else if (listName === 'courses') State.db.saveCourses(State.db.courses);
         closeModal();
         refresh();
       };
     });
  };

  setupBulkActions('prof', 'professors');
  // Handle case where id might be bound to 'profs'
  setupBulkActions('prof', 'profs'); 
  setupBulkActions('student', 'students');
  setupBulkActions('course', 'courses');

  // Remove the fix for professors save since we integrated it nicely with openModal now and setupBulkActions handles both names
  // However, I still need to make sure professors logic explicitly binds to the actual HTML ID which is btn-delete-selected-profs
  const btnDeleteProfs = document.getElementById('btn-delete-selected-profs');
  if (btnDeleteProfs) {
     const newBtn = btnDeleteProfs.cloneNode(true);
     btnDeleteProfs.parentNode.replaceChild(newBtn, btnDeleteProfs);
     newBtn.addEventListener('click', () => {
       const checkboxes = document.querySelectorAll('.prof-checkbox');
       const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
       if (selectedIds.length === 0) return;
       
       openModal('Confirmação de Exclusão', `
         <div class="flex-col gap-16">
           <div class="text-sm">Tem certeza que deseja excluir os <strong>${selectedIds.length}</strong> professores selecionados? Esta ação apaga os acessos e informações de modo permanente.</div>
           <div class="flex-row gap-12 justify-end mt-16">
             <button type="button" class="btn-outline btn-outline-neutral px-24 py-10" id="btn-cancel-prof-bulk">Cancelar</button>
             <button type="button" class="btn-danger border-none px-24 py-10" id="btn-confirm-prof-bulk">Excluir Professores</button>
           </div>
         </div>
       `);

       document.getElementById('btn-cancel-prof-bulk').onclick = closeModal;
       document.getElementById('btn-confirm-prof-bulk').onclick = () => {
         selectedIds.forEach(id => {
            const idx = State.db.professors.findIndex(x => x.id === id);
            if (idx > -1) State.db.professors.splice(idx, 1);
         });
         State.db.saveProfessors(State.db.professors);
         closeModal();
         refresh();
       };
     });
  }

  // --- Export Logic ---
  const handleExportCSV = (listName, headers, rowMapper) => {
    const list = State.db[listName] || [];
    let csv = headers.join(',') + '\n';
    list.forEach(item => { csv += rowMapper(item).map(x => `"${x}"`).join(',') + '\n'; });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `export_${listName}.csv`;
    a.click();
  };

  const handlePrint = (printId) => {
    const el = document.getElementById(printId);
    if (!el) return;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = el.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to re-bind events after tampering with body.innerHTML
  };

  document.getElementById('btn-export-profs-csv')?.addEventListener('click', () => 
     handleExportCSV('professors', ['Nome', 'ID', 'Especialidade'], p => [p.name, p.id, p.subject])
  );
  document.getElementById('btn-export-students-csv')?.addEventListener('click', () => 
     handleExportCSV('students', ['Nome', 'Matrícula', 'Curso', 'Turno'], s => [s.name, s.registration, s.courseName, s.shift])
  );
  document.getElementById('btn-export-courses-csv')?.addEventListener('click', () => 
     handleExportCSV('courses', ['Nome', 'Código'], c => [c.name, c.id])
  );

  document.getElementById('btn-export-profs-pdf')?.addEventListener('click', () => handlePrint('print-profs'));
  document.getElementById('btn-export-students-pdf')?.addEventListener('click', () => handlePrint('print-students'));
  document.getElementById('btn-export-courses-pdf')?.addEventListener('click', () => handlePrint('print-courses'));

}
