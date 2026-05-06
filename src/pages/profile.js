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

      ${!isAdmin && !isTeacher && State.userType === 'student' ? `
        <div class="mt-32 pt-24 border-top">
          <button id="btn-toggle-details" class="btn-outline w-full flex-between-center px-24 py-16 border-radius-12 transition-all hover:bg-panel">
            <div class="flex-align-center gap-12">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span class="fw-bold">Ver Histórico Acadêmico Detalhado</span>
            </div>
            <svg id="chevron-details" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="transition-all"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <div id="student-details-section" class="hidden animate-slide-up mt-24">
            <h3 class="fw-bold mb-16" style="font-size: 18px;">Histórico de Semestres</h3>
            <div class="flex-col gap-16">
              ${(State.user.history || []).length > 0 ? State.user.history.map(hist => `
                <div class="card p-20 bg-panel border">
                  <div class="flex-between-center mb-16 pb-8 border-bottom">
                    <span class="fw-bold">Semestre ${hist.semester}</span>
                    <span class="pill outline-accent">Média: ${hist.gpa.toFixed(1)}</span>
                  </div>
                  <div class="grid-2-cols gap-12 flex-wrap">
                    ${hist.subjects.map(sub => `
                      <div class="bg-surface p-12 border-radius-8 border flex-col gap-4">
                        <div class="text-xs fw-bold text-primary truncate" title="${sub.name}">${sub.name}</div>
                        <div class="flex-between-center text-xs">
                          <span class="text-secondary">Nota: <strong class="${sub.grade >= 7 ? 'text-success' : 'text-danger'}">${sub.grade.toFixed(1)}</strong></span>
                          <span class="text-secondary">Freq: <strong class="${sub.attendance >= 75 ? 'text-primary' : 'text-danger'}">${sub.attendance}%</strong></span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('') : '<p class="text-center p-24 text-secondary italic bg-panel border-radius-12">Nenhum histórico anterior encontrado.</p>'}
            </div>
            
            <div class="mt-24 bg-accent-light p-16 border-radius-12 border" style="border-color: var(--accent-light);">
               <h4 class="text-xs uppercase fw-bold text-accent mb-8">Resumo de Desempenho</h4>
               <p class="text-sm text-secondary" style="line-height: 1.6;">
                  Seu coeficiente de rendimento atual é calculado com base na média aritmética de todas as disciplinas cursadas até o momento. Mantenha sua frequência acima de 75% para evitar reprovação por faltas.
               </p>
            </div>
          </div>
        </div>
      ` : ''}
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
  
  // Toggle Detalhes Aluno
  const btnToggle = document.getElementById('btn-toggle-details');
  const detailsSection = document.getElementById('student-details-section');
  const chevron = document.getElementById('chevron-details');
  
  if (btnToggle && detailsSection) {
    btnToggle.onclick = () => {
      const isHidden = detailsSection.classList.contains('hidden');
      if (isHidden) {
        detailsSection.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      } else {
        detailsSection.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    };
  }

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