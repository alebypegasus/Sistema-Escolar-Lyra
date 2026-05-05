/**
 * PÁGINA ADMINISTRATIVA (SECRETARIA) - REESCRITA DO ZERO
 * 
 * Este módulo gerencia a gestão centralizada do sistema educacional Lyra.
 * Funções principais:
 * - Gestão de Professores (CRUD)
 * - Gestão de Alunos (CRUD)
 * - Gestão de Administradores (CRUD)
 * - Gestão de Cursos e Módulos
 * - Customização de Identidade Visual
 * 
 * @author Lyra Engine
 * @version 3.0.0
 */

/**
 * Renderiza o layout estrutural da administração.
 */
export function renderAdmin(container, State) {
  // Verificação de Segurança (Redundância de UI)
  if (!State.user || !State.user.isAdmin) {
    container.innerHTML = `
      <div class="card flex-center flex-col p-64 text-center">
        <h2 class="text-danger fw-bold mb-16">Acesso Privado</h2>
        <p class="text-secondary">Apenas membros da secretaria podem visualizar estes dados.</p>
      </div>
    `;
    return;
  }

  // Estado da aba ativa (persiste no objeto global ou na busca da URL)
  const activeTab = window.adminActiveTab || 'profs';

  // Template Principal
  container.innerHTML = `
    <div class="flex-col gap-32 animate-fade-in" id="page-admin">
      
      <!-- HEADER INSTITUCIONAL -->
      <header class="flex-between-center flex-wrap gap-16">
        <div class="flex-col gap-4">
          <div class="flex-align-center gap-8 text-xs text-secondary mb-4 opacity-70">
            <span class="pill bg-panel border px-8 py-2">Secretaria Central</span>
            <span class="divider-v" style="height: 12px; margin: 0 4px;"></span>
            <span class="capitalize fw-medium">${activeTab}</span>
          </div>
          <h1 class="font-display fw-bold" style="font-size: 32px; letter-spacing: -1px; color: var(--color-text-primary);">Configurações do Sistema</h1>
          <p class="text-secondary" style="max-width: 500px;">Controle absoluto sobre usuários, matrizes curriculares e branding institucional.</p>
        </div>
        
        <div class="flex-row gap-12">
          <div class="bg-panel p-12 border-radius-12 border flex-align-center gap-12 shadow-sm">
             <div class="w-8 h-8 rounded-full bg-success animate-pulse"></div>
             <div class="flex-col">
                <span class="text-xs fw-bold">DB Status</span>
                <span class="text-tiny opacity-50 uppercase">Online & Persistente</span>
             </div>
          </div>
        </div>
      </header>

      <!-- BARRA DE NAVEGAÇÃO PRINCIPAL (NAV) -->
      <nav class="flex-row gap-4 border-bottom pb-2" id="admin-tabs" style="overflow-x: auto; white-space: nowrap;">
        <button class="tab-btn ${activeTab === 'profs' ? 'active' : ''}" data-tab="profs" id="tab-btn-profs">
          Corpo Docente
        </button>
        <button class="tab-btn ${activeTab === 'students' ? 'active' : ''}" data-tab="students" id="tab-btn-students">
          Alunos
        </button>
        <button class="tab-btn ${activeTab === 'admins' ? 'active' : ''}" data-tab="admins" id="tab-btn-admins">
          Administradores
        </button>
        <button class="tab-btn ${activeTab === 'courses' ? 'active' : ''}" data-tab="courses" id="tab-btn-courses">
          Cursos / Módulos
        </button>
        <button class="tab-btn ${activeTab === 'branding' ? 'active' : ''}" data-tab="branding" id="tab-btn-branding">
          Branding
        </button>
      </nav>

      <!-- CONTEÚDO DA ABA (DINÂMICO) -->
      <div id="admin-active-content" class="animate-slide-up" style="min-height: 500px;">
        ${renderTabContent(activeTab, State)}
      </div>

    </div>

    <!-- MODAIS DE GESTÃO (UNIFICADOS) -->
    <div id="admin-modals-container">
       ${renderModals(State)}
    </div>
  `;
}

/**
 * Renderiza o conteúdo interno de cada aba.
 */
function renderTabContent(tab, State) {
  switch (tab) {
    case 'profs':
      return `
        <div class="card p-0 border-none shadow-sm overflow-hidden">
          <div class="flex-between-center p-24 bg-surface border-bottom">
            <div>
              <h2 class="fw-bold text-lg">Professores Cadastrados</h2>
              <p class="text-xs text-secondary">${State.db.professors.length} docentes ativos no sistema.</p>
            </div>
            <button class="btn-primary" id="btn-add-prof">+ Novo Docente</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nome do Docente</th>
                  <th>Cursos / Disciplinas</th>
                  <th>ID de Acesso</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${State.db.professors.map(p => `
                  <tr>
                    <td>
                      <div class="flex-align-center gap-12">
                        <img src="${p.photo || 'https://i.pravatar.cc/150?u='+p.id}" class="w-32 h-32 rounded-full object-cover border">
                        <div class="fw-bold">${p.name}</div>
                      </div>
                    </td>
                    <td><span class="status-pill primary">${p.subject || 'Geral'}</span></td>
                    <td><code>${p.id}</code></td>
                    <td class="text-right">
                      <div class="flex-row gap-8 justify-end">
                        <button class="btn-icon btn-edit-prof" data-id="${p.id}" title="Editar">
                           <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon text-danger btn-delete" data-type="professor" data-id="${p.id}" title="Excluir">
                           <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    
    case 'students':
      return `
        <div class="card p-0 border-none shadow-sm overflow-hidden">
          <div class="flex-between-center p-24 bg-surface border-bottom">
            <div>
              <h2 class="fw-bold text-lg">Matrículas Ativas</h2>
              <p class="text-xs text-secondary">Gerencie o ingresso e dados dos alunos.</p>
            </div>
            <button class="btn-primary" id="btn-add-student">+ Matricular Aluno</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Estudante</th>
                  <th>RA / Matrícula</th>
                  <th>Módulo Atual</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${State.db.students.map(s => `
                  <tr>
                    <td><div class="fw-bold">${s.name}</div></td>
                    <td><code>${s.registration}</code></td>
                    <td><span class="status-pill success">${s.courseName}</span></td>
                    <td class="text-right">
                      <div class="flex-row gap-8 justify-end">
                        <button class="btn-icon btn-edit-student" data-id="${s.id}">
                           <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon text-danger btn-delete" data-type="student" data-id="${s.id}">
                           <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'admins':
      return `
        <div class="card p-0 border-none shadow-sm overflow-hidden">
          <div class="flex-between-center p-24 bg-surface border-bottom">
            <div>
              <h2 class="fw-bold text-lg">Equipe de Administração</h2>
              <p class="text-xs text-secondary">Usuários com acesso total à secretaria.</p>
            </div>
            <button class="btn-primary" id="btn-add-admin">+ Novo Gestor</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Responsável</th>
                  <th>Login (ID)</th>
                  <th>Nível</th>
                  <th class="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-panel">
                  <td><div class="fw-bold">Administrador System (Master)</div></td>
                  <td><code>admin</code></td>
                  <td><span class="status-pill warning">Proprietário</span></td>
                  <td class="text-right text-xs opacity-50 italic">Inativo para exclusão</td>
                </tr>
                ${State.db.admins.map(a => `
                  <tr>
                    <td><div class="fw-bold">${a.name}</div></td>
                    <td><code>${a.id}</code></td>
                    <td><span class="status-pill primary">Operador</span></td>
                    <td class="text-right">
                      <button class="btn-icon text-danger btn-delete" data-type="admin" data-id="${a.id}">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'courses':
      return `
        <div class="card border-none shadow-sm">
          <div class="flex-between-center mb-24">
            <h2 class="fw-bold text-lg">Matriz de Módulos</h2>
            <button class="btn-primary" id="btn-add-course">+ Criar Módulo</button>
          </div>
          <div class="grid-3-cols gap-16">
            ${State.db.courses.map(c => `
              <div class="bg-panel p-20 border-radius-16 border flex-between-center group hover-border-brand transition-all hover-translate-y">
                <div>
                  <div class="fw-bold text-sm mb-4">${c.name}</div>
                  <div class="text-xs text-secondary uppercase tracking-widest">${c.id}</div>
                </div>
                <div class="flex-row gap-8 justify-end">
                   <button class="btn-icon btn-edit-course" data-id="${c.id}" title="Editar">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                   </button>
                   <button class="btn-icon text-danger opacity-0 group-hover-opacity-100 btn-delete" data-type="course" data-id="${c.id}">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                </div>
              </div>
            `).join('')}
            ${State.db.courses.length === 0 ? '<p class="col-span-full text-center p-32 text-secondary">Nenhum curso cadastrado.</p>' : ''}
          </div>
        </div>
      `;

    case 'branding':
      return `
        <div class="card border-none shadow-sm">
          <h2 class="fw-bold text-lg mb-24">Identidade Visual</h2>
          <div class="grid-2-cols gap-48">
            <div class="flex-col gap-12">
               <label class="text-xs uppercase fw-bold opacity-50">Preview da Logo Ativa</label>
               <div class="bg-panel p-64 border-radius-24 border flex-center flex-col gap-16 bg-checkered">
                  <img src="${State.getLogo()}" alt="Logo Escola" style="max-height: 80px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));" id="preview-logo-img">
               </div>
            </div>
            <div class="flex-col gap-24 py-12">
              <div class="input-group">
                <label>URL da Logomarca (PNG/SVG)</label>
                <div class="flex-row gap-8">
                  <input type="text" id="logo-url-input" class="input-field" placeholder="https://..." value="${State.db.customLogo || ''}">
                  <button class="btn-primary" id="btn-save-logo-url">Salvar</button>
                </div>
              </div>
              <div class="divider-h"></div>
              <div class="input-group">
                <label>Arquivo Local</label>
                <input type="file" id="logo-file-input" class="input-field" accept="image/*">
                <p class="text-tiny text-secondary mt-8 italic">* Recomendado: SVG com fundo transparente para melhor nitidez em resoluções variadas.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    
    default: return '';
  }
}

/**
 * Renderiza todos os modais necessários para a página.
 */
function renderModals(State) {
  return `
    <!-- MODAL PROFESSOR -->
    <div id="modal-prof" class="modal-overlay hidden">
      <div class="modal-content animate-slide-up" style="max-width: 480px;">
        <div class="flex-between-center mb-24">
          <h3 class="fw-bold" id="prof-modal-title">Gestão de Docente</h3>
          <button class="btn-icon closeModal">&times;</button>
        </div>
        <form id="form-prof" class="flex-col gap-16">
          <input type="hidden" id="prof-edit-id">
          <div class="input-group">
            <label>Nome Completo</label>
            <input type="text" id="prof-name" class="input-field" placeholder="Ex: Maria Montessori" required>
          </div>
          <div class="grid-2-cols gap-12">
            <div class="input-group">
              <label>ID / Usuário</label>
              <input type="text" id="prof-id" class="input-field" placeholder="prof.maria">
            </div>
            <div class="input-group">
              <label>Senha Provisória</label>
              <input type="text" id="prof-pass" class="input-field" value="admin123">
            </div>
          </div>
          <div class="input-group">
            <label>Especialidade / Matéria</label>
            <select id="prof-subject-select" class="input-field">
               <option value="">Selecione...</option>
               ${State.db.courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
               <option value="NEW">+ Digitar Novo</option>
            </select>
          </div>
          <div id="prof-subject-new-wrap" class="input-group hidden">
             <input type="text" id="prof-subject-new" class="input-field" placeholder="Nome da Disciplina">
          </div>
          <div class="flex-row gap-8 mt-12">
            <button type="submit" class="btn-primary flex-1">Confirmar Cadastro</button>
            <button type="button" class="btn-outline closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL ALUNO -->
    <div id="modal-student" class="modal-overlay hidden">
      <div class="modal-content animate-slide-up" style="max-width: 480px;">
        <div class="flex-between-center mb-20">
          <h3 class="fw-bold" id="student-modal-title">Dados do Aluno</h3>
          <button class="btn-icon closeModal">&times;</button>
        </div>
        <form id="form-student" class="flex-col gap-16">
          <input type="hidden" id="student-edit-id">
          <div class="input-group">
            <label>Nome do Estudante</label>
            <input type="text" id="student-name" class="input-field" required>
          </div>
          <div class="input-group">
             <label>Módulo Principal</label>
             <select id="student-course" class="input-field" required>
                <option value="">Escolha o curso...</option>
                ${State.db.courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
             </select>
          </div>
          <div class="grid-2-cols gap-12">
             <div class="input-group">
                <label>RA / Login</label>
                <input type="text" id="student-ra" class="input-field" placeholder="Ex: 2024001">
             </div>
             <div class="input-group">
                <label>Turno</label>
                <select id="student-shift" class="input-field">
                   <option value="Manhã">Manhã</option>
                   <option value="Tarde">Tarde</option>
                   <option value="Noite">Noite</option>
                </select>
             </div>
          </div>
          <div class="input-group">
             <label>Senha Inicial</label>
             <input type="text" id="student-pass" class="input-field" value="123">
          </div>
          <div class="flex-row gap-8 mt-12">
            <button type="submit" class="btn-primary flex-1">Finalizar Registro</button>
            <button type="button" class="btn-outline closeModal">Voltar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- MODAL ADMIN -->
    <div id="modal-admin" class="modal-overlay hidden">
      <div class="modal-content animate-slide-up" style="max-width: 400px;">
        <div class="flex-between-center mb-20">
          <h3 class="fw-bold">Novo Membro Secretaria</h3>
          <button class="btn-icon closeModal">&times;</button>
        </div>
        <form id="form-admin" class="flex-col gap-16">
          <input type="text" id="admin-name" class="input-field" placeholder="Nome Completo" required>
          <input type="text" id="admin-id" class="input-field" placeholder="Usuário de Acesso" required>
          <input type="password" id="admin-pass" class="input-field" placeholder="Senha Forte" required>
          <div class="flex-row gap-8 mt-12">
            <button type="submit" class="btn-primary flex-1">Habilitar Acesso</button>
            <button type="button" class="btn-outline closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL CURSO -->
    <div id="modal-course" class="modal-overlay hidden" style="z-index: 1000;">
      <div class="modal-content animate-slide-up" style="max-width: 400px;">
        <div class="flex-between-center mb-20">
          <h3 class="fw-bold">Gestão de Curso</h3>
          <button class="btn-icon closeModal">&times;</button>
        </div>
        <form id="form-course" class="flex-col gap-16">
          <input type="hidden" id="course-edit-id">
          <input type="text" id="course-name" class="input-field" placeholder="Título do Curso" required>
          <input type="text" id="course-id" class="input-field" placeholder="Sigla (Ex: ADS)">
          <div class="flex-row gap-8 mt-12">
            <button type="submit" class="btn-primary flex-1">Salvar</button>
            <button type="button" class="btn-outline closeModal">Sair</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * Configure as interações da página de administração.
 */
export function setupAdminInteractions(State, onNavigate) {
  
  // Função auxiliar para re-renderizar mantendo o estado suavemente
  const refresh = () => onNavigate('admin');

  // --- NAVEGAÇÃO ENTRE ABAS ---
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      window.adminActiveTab = btn.dataset.tab;
      refresh();
    };
  });

  // --- GESTÃO DE MODAIS GERAL ---
  const modals = {
    prof: document.getElementById('modal-prof'),
    student: document.getElementById('modal-student'),
    admin: document.getElementById('modal-admin'),
    course: document.getElementById('modal-course')
  };

  const closeModals = () => {
    Object.values(modals).forEach(m => m && m.classList.add('hidden'));
  };

  document.querySelectorAll('.closeModal').forEach(btn => btn.onclick = closeModals);

  // --- INTERAÇÕES: PROFESSORES ---
  document.getElementById('btn-add-prof')?.addEventListener('click', () => {
    document.getElementById('form-prof').reset();
    document.getElementById('prof-modal-title').innerText = 'Cadastrar Novo Docente';
    document.getElementById('prof-edit-id').value = '';
    modals.prof.classList.remove('hidden');
  });

  document.querySelectorAll('.btn-edit-prof').forEach(btn => {
    btn.onclick = () => {
      const p = State.db.professors.find(prof => prof.id === btn.dataset.id);
      if (p) {
        document.getElementById('prof-modal-title').innerText = 'Editar Professor';
        document.getElementById('prof-edit-id').value = p.id;
        document.getElementById('prof-name').value = p.name;
        document.getElementById('prof-id').value = p.id;
        document.getElementById('prof-pass').value = p.password || 'admin123';
        document.getElementById('prof-subject-select').value = State.db.courses.some(c => c.name === p.subject) ? p.subject : (p.subject ? 'NEW' : '');
        if (document.getElementById('prof-subject-select').value === 'NEW') {
          document.getElementById('prof-subject-new-wrap').classList.remove('hidden');
          document.getElementById('prof-subject-new').value = p.subject;
        }
        modals.prof.classList.remove('hidden');
      }
    };
  });

  document.getElementById('prof-subject-select')?.addEventListener('change', (e) => {
    document.getElementById('prof-subject-new-wrap').classList.toggle('hidden', e.target.value !== 'NEW');
  });

  document.getElementById('form-prof')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selSub = document.getElementById('prof-subject-select').value;
    const finalSub = selSub === 'NEW' ? document.getElementById('prof-subject-new').value : selSub;
    
    if (!finalSub) return alert('Por favor, informe a especialidade do docente.');

    const data = {
      name: document.getElementById('prof-name').value,
      id: document.getElementById('prof-id').value.trim() || undefined,
      password: document.getElementById('prof-pass').value,
      subject: finalSub
    };

    const editId = document.getElementById('prof-edit-id').value;
    const result = editId ? State.updateProfessor(editId, data) : State.registerProfessor(data);
    
    if (result.success) {
      alert(result.message);
      closeModals();
      refresh();
    } else alert(result.message);
  });

  // --- INTERAÇÕES: ESTUDANTES ---
  const btnAddStudent = document.getElementById('btn-add-student');
  if (btnAddStudent) {
    btnAddStudent.onclick = () => {
      document.getElementById('form-student').reset();
      document.getElementById('student-modal-title').innerText = 'Nova Matrícula';
      document.getElementById('student-edit-id').value = '';
      modals.student.classList.remove('hidden');
    };
  }

  document.querySelectorAll('.btn-edit-student').forEach(btn => {
    btn.onclick = () => {
      const s = State.db.students.find(stud => stud.id === btn.dataset.id);
      if (s) {
        document.getElementById('student-modal-title').innerText = 'Atualizar Matrícula';
        document.getElementById('student-edit-id').value = s.id;
        document.getElementById('student-name').value = s.name;
        document.getElementById('student-course').value = s.courseName;
        document.getElementById('student-ra').value = s.registration;
        document.getElementById('student-shift').value = s.shift || 'Manhã';
        document.getElementById('student-pass').value = s.password || '123';
        modals.student.classList.remove('hidden');
      }
    };
  });

  const formStudent = document.getElementById('form-student');
  if (formStudent) {
    formStudent.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        id_orig: document.getElementById('student-edit-id').value,
        name: document.getElementById('student-name').value,
        courseName: document.getElementById('student-course').value,
        registration: document.getElementById('student-ra').value.trim() || undefined,
        shift: document.getElementById('student-shift').value,
        password: document.getElementById('student-pass').value
      };

      const res = State.registerStudent(data);
      if (res.success) {
        alert(res.message);
        closeModals();
        refresh();
      } else alert(res.message);
    };
  }

  // --- INTERAÇÕES: ADMINS ---
  const btnAddAdmin = document.getElementById('btn-add-admin');
  if (btnAddAdmin) btnAddAdmin.onclick = () => modals.admin.classList.remove('hidden');

  const formAdmin = document.getElementById('form-admin');
  if (formAdmin) {
    formAdmin.onsubmit = (e) => {
      e.preventDefault();
      const res = State.registerAdmin({
        name: document.getElementById('admin-name').value,
        id: document.getElementById('admin-id').value.trim(),
        password: document.getElementById('admin-pass').value
      });
      if (res.success) {
        alert(res.message);
        closeModals();
        refresh();
      } else alert(res.message);
    };
  }

  // --- INTERAÇÕES: CURSOS ---
  document.getElementById('btn-add-course')?.addEventListener('click', () => {
    document.getElementById('form-course').reset();
    document.getElementById('course-edit-id').value = '';
    modals.course.classList.remove('hidden');
  });

  document.querySelectorAll('.btn-edit-course').forEach(btn => {
    btn.onclick = () => {
      const c = State.db.courses.find(course => course.id === btn.dataset.id);
      if (c) {
        document.getElementById('course-edit-id').value = c.id;
        document.getElementById('course-name').value = c.name;
        document.getElementById('course-id').value = c.id;
        modals.course.classList.remove('hidden');
      }
    };
  });

  const btnAddCourse = document.getElementById('btn-add-course');
  // if (btnAddCourse) ... handled above by addEventListener for clarity, removing duplicate setup below
  
  const formCourse = document.getElementById('form-course');
  if (formCourse) {
    formCourse.onsubmit = (e) => {
      e.preventDefault();
      const editId = document.getElementById('course-edit-id').value;
      const data = {
        name: document.getElementById('course-name').value,
        id: document.getElementById('course-id').value.trim() || undefined
      };
      
      const res = editId ? 
        (State.updateCourse(editId, data) ? {success: true} : {success: false, message: 'Erro ao atualizar'}) : 
        State.registerCourse(data);

      if (res.success) {
        alert('Curso atualizado/cadastrado!');
        closeModals();
        refresh();
      } else alert(res.message);
    };
  }

  // --- EXCLUSÃO DE ENTIDADES ---
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = () => {
      const { id, type } = btn.dataset;
      const confirmMsg = `Tem certeza que deseja remover este ${type}? Todos os dados vinculados podem ser perdidos.`;
      if (confirm(confirmMsg)) {
        const res = State.deleteEntity(id, type);
        if (res.success) {
          refresh();
        } else alert(res.message);
      }
    };
  });

  // --- BRANDING (LOGOMARCA) ---
  document.getElementById('btn-save-logo-url')?.addEventListener('click', () => {
    const url = document.getElementById('logo-url-input').value.trim();
    if (url) {
      State.setCustomLogo(url);
      alert('Identidade Visual Atualizada!');
      setTimeout(() => location.reload(), 1000);
    }
  });

  document.getElementById('logo-file-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        State.setCustomLogo(ev.target.result);
        alert('Logo carregada com sucesso!');
        setTimeout(() => location.reload(), 1000);
      };
      reader.readAsDataURL(file);
    }
  });
}
