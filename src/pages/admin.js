/**
 * PÁGINA ADMINISTRATIVA (SECRETARIA) - REESCRITA TOTAL
 * @version 4.0.0
 */

export function renderAdmin(container, State) {
  if (!State.user || !State.user.isAdmin) {
    container.innerHTML = `<div class="card p-64 text-center"><h2 class="text-danger fw-bold">Acesso Restrito</h2></div>`;
    return;
  }

  const activeTab = window.adminActiveTab || 'profs';

  container.innerHTML = `
    <div class="flex-col gap-32 animate-fade-in" id="page-admin">
      <header class="flex-between-center gap-16 flex-wrap">
        <div>
          <div class="flex-align-center gap-8 text-xs text-secondary mb-8 opacity-70">
            <span class="pill bg-panel border px-8 py-2">Painel de Controle</span>
            <span class="capitalize fw-medium">${activeTab}</span>
          </div>
          <h1 class="font-display fw-bold text-3xl">Secretaria Central</h1>
        </div>
        <div class="bg-panel p-12 border-radius-12 border flex-align-center gap-8 shadow-sm">
           <div class="w-8 h-8 rounded-full bg-success animate-pulse"></div>
           <span class="text-xs fw-bold">Sistema Ativo</span>
        </div>
      </header>

      <nav class="flex-row gap-4 border-bottom pb-2" id="admin-tabs" style="overflow-x: auto;">
        <button class="tab-btn ${activeTab === 'profs' ? 'active' : ''}" data-tab="profs">Professores</button>
        <button class="tab-btn ${activeTab === 'students' ? 'active' : ''}" data-tab="students">Alunos</button>
        <button class="tab-btn ${activeTab === 'admins' ? 'active' : ''}" data-tab="admins">Administradores</button>
        <button class="tab-btn ${activeTab === 'courses' ? 'active' : ''}" data-tab="courses">Matriz/Cursos</button>
        <button class="tab-btn ${activeTab === 'branding' ? 'active' : ''}" data-tab="branding">Branding</button>
      </nav>

      <div id="admin-active-content" class="animate-slide-up">
        ${renderTabContent(activeTab, State)}
      </div>

      <div id="admin-modals-root">
        ${renderAllModals(State)}
      </div>
    </div>
  `;
}

function renderTabContent(tab, State) {
  switch (tab) {
    case 'profs':
      return `
        <div class="card p-0 overflow-hidden border-none shadow-sm">
          <div class="flex-between-center p-24 bg-surface border-bottom">
            <h2 class="fw-bold text-lg">Corpo Docente</h2>
            <button class="btn-primary" id="btn-open-prof-modal">+ Novo Professor</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead><tr><th>Nome</th><th>Especialidade</th><th>ID</th><th class="text-right">Ações</th></tr></thead>
              <tbody>
                ${State.db.professors.map(p => `
                  <tr>
                    <td><div class="flex-align-center gap-12 font-medium">${p.name}</div></td>
                    <td><span class="status-pill primary">${p.subject}</span></td>
                    <td><code>${p.id}</code></td>
                    <td class="text-right">
                      <div class="flex-row gap-8 justify-end">
                        <button class="btn-icon edit-prof" data-id="${p.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn-icon text-danger delete-item" data-type="professor" data-id="${p.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    
    case 'students':
      return `
        <div class="card p-0 overflow-hidden border-none shadow-sm">
          <div class="flex-between-center p-24 bg-surface border-bottom">
            <h2 class="fw-bold text-lg">Matrículas</h2>
            <button class="btn-primary" id="btn-open-student-modal">+ Matricular Aluno</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead><tr><th>Aluno</th><th>RA</th><th>Curso</th><th>Turno</th><th class="text-right">Ações</th></tr></thead>
              <tbody>
                ${State.db.students.map(s => `
                  <tr>
                    <td class="fw-bold">${s.name}</td>
                    <td><code>${s.registration}</code></td>
                    <td><span class="status-pill success">${s.courseName}</span></td>
                    <td>${s.shift}</td>
                    <td class="text-right">
                       <button class="btn-icon edit-student" data-id="${s.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                       <button class="btn-icon text-danger delete-item" data-type="student" data-id="${s.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;

    case 'admins':
      return `
        <div class="card p-0 overflow-hidden border-none shadow-sm">
          <div class="flex-between-center p-24 bg-surface border-bottom">
            <h2 class="fw-bold text-lg">Equipe Administrativa</h2>
            <button class="btn-primary" id="btn-open-admin-modal">+ Novo Admin</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead><tr><th>Nome</th><th>Login</th><th>Ações</th></tr></thead>
              <tbody>
                <tr class="bg-panel"><td>Admin Master</td><td><code>admin</code></td><td class="opacity-50 italic">Protegido</td></tr>
                ${State.db.admins.map(a => `
                  <tr>
                    <td>${a.name}</td>
                    <td><code>${a.id}</code></td>
                    <td><button class="btn-icon text-danger delete-item" data-type="admin" data-id="${a.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;

    case 'courses':
      return `
        <div class="card border-none shadow-sm">
          <div class="flex-between-center mb-24">
            <h2 class="fw-bold text-lg">Matriz de Matérias</h2>
            <button class="btn-primary" id="btn-open-course-modal">+ Novo Curso</button>
          </div>
          <div class="grid-3-cols gap-16">
            ${State.db.courses.map(c => `
              <div class="bg-panel p-20 border-radius-16 border flex-between-center group hover-border-brand transition-all">
                <div><div class="fw-bold text-sm">${c.name}</div><div class="text-xs opacity-50 uppercase">${c.id}</div></div>
                <div class="flex-row gap-4 opacity-0 group-hover-opacity-100">
                  <button class="btn-icon edit-course" data-id="${c.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button class="btn-icon text-danger delete-item" data-type="course" data-id="${c.id}"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                </div>
              </div>`).join('')}
          </div>
        </div>`;

    case 'branding':
      return `
        <div class="card border-none shadow-sm">
           <h2 class="fw-bold text-lg mb-24">Identidade Visual</h2>
           <div class="grid-2-cols gap-48">
              <div class="flex-col gap-12">
                 <label class="text-xs uppercase fw-bold opacity-30">Preview</label>
                 <div class="bg-panel p-48 border-radius-24 border flex-center bg-checkered">
                    <img src="${State.getLogo()}" style="max-height: 80px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));">
                 </div>
              </div>
              <div class="flex-col gap-24">
                 <div class="input-group">
                    <label>URL da Logo</label>
                    <div class="flex-row gap-8">
                      <input type="text" id="logo-url" class="input-field" placeholder="https://..." value="${State.db.customLogo || ''}">
                      <button class="btn-primary" id="btn-save-logo">Salvar</button>
                    </div>
                 </div>
                 <div class="input-group">
                    <label>Carregar Arquivo</label>
                    <input type="file" id="logo-file" class="input-field" accept="image/*">
                 </div>
              </div>
           </div>
        </div>`;
  }
}

function renderAllModals(State) {
  return `
    <div id="modal-container" class="modal-overlay hidden">
      <div class="modal-content animate-slide-up" style="max-width: 440px;">
        <div class="flex-between-center mb-20">
          <h3 class="fw-bold" id="modal-title">Editar Item</h3>
          <button class="btn-icon close-modal">&times;</button>
        </div>
        <div id="modal-body"></div>
      </div>
    </div>
  `;
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
  modal.querySelector('.close-modal').onclick = closeModal;

  // TAB NAV
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      window.adminActiveTab = btn.dataset.tab;
      refresh();
    };
  });

  // PROFESSOR CRUD
  document.getElementById('btn-open-prof-modal')?.addEventListener('click', () => {
    openModal('Novo Professor', `
      <form id="form-prof" class="flex-col gap-12">
        <input type="text" name="name" class="input-field" placeholder="Nome" required>
        <input type="text" name="id" class="input-field" placeholder="ID de Usuário (Opcional)">
        <input type="text" name="subject" class="input-field" placeholder="Matéria" required>
        <input type="text" name="password" class="input-field" value="admin123" placeholder="Senha">
        <button type="submit" class="btn-primary mt-8">Cadastrar</button>
      </form>
    `);
    document.getElementById('form-prof').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      State.registerProfessor(Object.fromEntries(fd));
      closeModal(); refresh();
    };
  });

  document.querySelectorAll('.edit-prof').forEach(btn => {
    btn.onclick = () => {
      const p = State.db.professors.find(x => x.id === btn.dataset.id);
      openModal('Editar Professor', `
        <form id="form-prof-edit" class="flex-col gap-12">
          <input type="hidden" name="id_orig" value="${p.id}">
          <input type="text" name="name" class="input-field" value="${p.name}">
          <input type="text" name="subject" class="input-field" value="${p.subject}">
          <input type="text" name="password" class="input-field" value="${p.password}">
          <button type="submit" class="btn-primary mt-8">Atualizar</button>
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
  document.getElementById('btn-open-student-modal')?.addEventListener('click', () => {
    openModal('Matricular Aluno', `
      <form id="form-student" class="flex-col gap-12">
        <input type="text" name="name" class="input-field" placeholder="Nome" required>
        <select name="courseName" class="input-field" required>
          <option value="">Curso...</option>
          ${State.db.courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
        </select>
        <select name="shift" class="input-field">
          <option value="Manhã">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option>
        </select>
        <button type="submit" class="btn-primary">Salvar</button>
      </form>
    `);
    document.getElementById('form-student').onsubmit = (e) => {
      e.preventDefault();
      State.registerStudent(Object.fromEntries(new FormData(e.target)));
      closeModal(); refresh();
    };
  });

  document.querySelectorAll('.edit-student').forEach(btn => {
    btn.onclick = () => {
      const s = State.db.students.find(x => x.id === btn.dataset.id);
      openModal('Editar Aluno', `
        <form id="form-student-edit" class="flex-col gap-12">
          <input type="hidden" name="id_orig" value="${s.id}">
          <input type="text" name="name" class="input-field" value="${s.name}">
          <input type="text" name="password" class="input-field" value="${s.password}">
          <select name="courseName" class="input-field">
             ${State.db.courses.map(c => `<option value="${c.name}" ${c.name === s.courseName ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
          <button type="submit" class="btn-primary">Atualizar</button>
        </form>
      `);
      document.getElementById('form-student-edit').onsubmit = (e) => {
        e.preventDefault();
        State.registerStudent(Object.fromEntries(new FormData(e.target)));
        closeModal(); refresh();
      };
    };
  });

  // ADMIN CRUD
  const btnOpenAdmin = document.getElementById('btn-open-admin-modal');
  if (btnOpenAdmin) {
    btnOpenAdmin.onclick = () => {
      openModal('Novo Gestor', `
        <form id="form-admin" class="flex-col gap-12">
          <input type="text" id="admin-name" class="input-field" placeholder="Nome Completo" required>
          <input type="text" id="admin-id" class="input-field" placeholder="Usuário" required>
          <input type="password" id="admin-pass" class="input-field" placeholder="Senha" required>
          <button type="submit" class="btn-primary">Criar</button>
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
      openModal('Novo Curso', `
        <form id="form-course" class="flex-col gap-12">
          <input type="text" id="course-name" class="input-field" placeholder="Nome do Curso" required>
          <input type="text" id="course-id" class="input-field" placeholder="Sigla (Ex: ADS)">
          <button type="submit" class="btn-primary">Criar</button>
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
      openModal('Editar Curso', `
        <form id="form-course-edit" class="flex-col gap-12">
          <input type="hidden" name="id_orig" value="${c.id}">
          <input type="text" name="name" class="input-field" value="${c.name}">
          <button type="submit" class="btn-primary">Salvar</button>
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
      if (confirm(`Remover ${btn.dataset.type}?`)) {
        State.deleteEntity(btn.dataset.id, btn.dataset.type);
        refresh();
      }
    };
  });

  // BRANDING
  const btnSaveLogo = document.getElementById('btn-save-logo');
  if (btnSaveLogo) {
    btnSaveLogo.onclick = () => {
      const url = document.getElementById('logo-url').value;
      if (url) {
        State.setCustomLogo(url);
        alert('Logo atualizada!');
        location.reload();
      }
    };
  }

  const logoFile = document.getElementById('logo-file');
  if (logoFile) {
    logoFile.onchange = (e) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        State.setCustomLogo(ev.target.result);
        alert('Logo carregada!');
        location.reload();
      };
      reader.readAsDataURL(e.target.files[0]);
    };
  }
}
