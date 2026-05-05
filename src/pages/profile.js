export function renderProfile(container, State) {
  const isTeacher = State.userType === 'teacher';
  const isAdmin = State.user && State.user.isAdmin;
  
  container.innerHTML = `
    <div class="card" style="max-width: 600px;">
      <div class="profile-header mb-24">
        ${State.user.photo ? `
          <img src="${State.user.photo}" alt="Foto de Perfil" class="profile-avatar">
        ` : ''}
        <div>
          <h2 class="fw-bold" style="font-size: 24px;">${State.user.name}</h2>
          <p class="text-secondary text-sm mt-4">${isAdmin ? 'Administrador do Sistema' : (isTeacher ? 'Corpo Docente' : 'Corpo Discente')}</p>
        </div>
      </div>

      <div class="bg-panel p-16 border-radius-12 border mb-24 flex-align-center gap-12">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <p class="text-xs text-secondary">
          ${isAdmin ? 'Você possui permissões totais de edição no sistema.' : 'Para segurança dos dados acadêmicos, alterações devem ser solicitadas diretamente à <strong>Secretaria Administrativa</strong>.'}
        </p>
      </div>

      <form id="profile-form">
        <div class="input-group">
          <label>Nome Completo</label>
          <input type="text" id="profile-name" class="input-field" value="${State.user.name}" ${!isAdmin ? 'disabled' : ''}>
        </div>
        <div class="input-group">
          <label>${isTeacher ? 'Disciplina Principal' : 'Matrícula'}</label>
          <input type="text" class="input-field input-disabled" value="${isAdmin ? 'Admin' : (isTeacher ? State.user.subject : State.user.registration)}" disabled>
        </div>
        
        <div class="grid-2-cols gap-16">
          <div class="input-group">
            <label>Data de Nascimento</label>
            <input type="date" id="profile-dob" class="input-field" value="${State.user.dob || ''}" ${!isAdmin ? 'disabled' : ''}>
          </div>
          <div class="input-group">
            <label>Identidade (RG)</label>
            <input type="text" id="profile-rg" class="input-field" value="${State.user.rg || ''}" ${!isAdmin ? 'disabled' : ''}>
          </div>
          <div class="input-group">
            <label>CPF</label>
            <input type="text" id="profile-cpf" class="input-field" value="${State.user.cpf || ''}" ${!isAdmin ? 'disabled' : ''}>
          </div>
          <div class="input-group">
            <label>Telefone</label>
            <input type="text" id="profile-phone" class="input-field" value="${State.user.phone || ''}" ${!isAdmin ? 'disabled' : ''}>
          </div>
        </div>
        <div class="input-group">
          <label>Endereço Completo</label>
          <input type="text" id="profile-address" class="input-field" value="${State.user.address || ''}" ${!isAdmin ? 'disabled' : ''}>
        </div>
        
        ${isAdmin ? `
          <button type="submit" class="btn-primary" id="btn-save-profile">Salvar Alterações</button>
        ` : ''}
      </form>
    </div>
  `;
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DO PERFIL
 * Lida com o salvamento de dados do usuário
 * @param {Object} State Estado global
 * @param {Function} navigateTo Função de navegação
 */
export function setupProfileInteractions(State, navigateTo) {
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('profile-name').value.trim();
      if (!newName) return;

      State.user.name = newName;
      if (State.userType === 'student') {
        const all = State.db.students;
        const s = all.find(s => s.id === State.user.id);
        if (s) {
          s.name = newName;
          s.dob = document.getElementById('profile-dob').value.trim();
          s.rg = document.getElementById('profile-rg').value.trim();
          s.cpf = document.getElementById('profile-cpf').value.trim();
          s.phone = document.getElementById('profile-phone')?.value.trim() || '';
          s.address = document.getElementById('profile-address').value.trim();
          s.photo = document.getElementById('profile-photo').value.trim() || `https://i.pravatar.cc/150?u=${s.id}`;
          
          Object.assign(State.user, s);
        }
        State.db.saveStudents(all);
      } else {
        const all = State.db.professors;
        const p = all.find(p => p.id === State.user.id);
        if (p) {
          p.name = newName;
          p.dob = document.getElementById('profile-dob').value.trim();
          p.rg = document.getElementById('profile-rg').value.trim();
          p.cpf = document.getElementById('profile-cpf').value.trim();
          p.phone = document.getElementById('profile-phone').value.trim();
          p.address = document.getElementById('profile-address').value.trim();
          p.photo = document.getElementById('profile-photo').value.trim() || `https://i.pravatar.cc/150?u=${p.id}`;
          p.additionalInfo = document.getElementById('profile-additional-info').value.trim();

          Object.assign(State.user, p);
        }
        State.db.saveProfessors(all);
      }
      
      const btn = document.getElementById('btn-save-profile');
      btn.textContent = 'Salvo com sucesso!';
      btn.style.background = 'var(--success)';
      
      import('../notifications.js').then(({ Notifications }) => {
        Notifications.show('Perfil', 'Perfil atualizado com sucesso.', 'success');
      });
      
      setTimeout(() => {
        const updateBtn = document.getElementById('btn-save-profile');
        if (updateBtn) {
          updateBtn.textContent = 'Salvar Alterações';
          updateBtn.style.background = 'var(--accent)';
        }
        navigateTo('profile'); // Atualiza a renderização da interface
      }, 1000);
    });
  }
}