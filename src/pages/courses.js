export function renderCourses(container, State) {
  if (State.userType === 'student') {
    const s = State.user;
    container.innerHTML = `
      <div class="mb-24">
        <h2 class="fw-bolder mb-4" style="font-size: 20px;">Meu Curso</h2>
        <p class="text-secondary text-sm">Você está matriculado(a) em: <strong class="text-primary">${s.courseName || 'Curso Padrão'}</strong></p>
      </div>
      <h3 class="fw-bold mb-16" style="font-size: 16px;">Minhas Disciplinas (Este Semestre)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        ${(s.subjects || []).map(sub => `
          <div class="card">
            <h3 class="mb-4">${sub.name}</h3>
            <p class="text-secondary text-xs mb-24">${sub.professor}</p>
            <div class="flex-between-center text-xs text-secondary mb-8">
              <span>Andamento do Semestre</span>
              <span>Em curso</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill progress-65"></div>
            </div>
          </div>
        `).join('')}
        ${!(s.subjects && s.subjects.length > 0) ? `<p class="text-secondary text-sm">Você não possui disciplinas vinculadas no momento.</p>` : ''}
      </div>
    `;
  } else {
    // Teacher Courses & Admin (Manage institution courses)
    const p = State.user;
    const courses = State.db.courses || [];
    container.innerHTML = `
      <div class="mb-24">
        <h2 class="fw-bolder mb-4" style="font-size: 20px;">Gerenciar Cursos da Instituição</h2>
        <p class="text-secondary text-sm">Crie, edite ou remova cursos do banco de dados utilizando os controles no topo da página e na tabela abaixo.</p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cód</th>
              <th>Nome do Curso</th>
              <th>Manhã</th>
              <th>Tarde</th>
              <th>Noite</th>
              <th style="width: 150px;">Ações</th>
            </tr>
          </thead>
          <tbody id="courses-tbody">
            ${courses.map(c => {
              const studentsInCourse = (State.db.students || []).filter(s => s.courseId === c.id);
              const manha = studentsInCourse.filter(s => s.shift === 'Manhã').length;
              const tarde = studentsInCourse.filter(s => s.shift === 'Tarde').length;
              const noite = studentsInCourse.filter(s => s.shift === 'Noite').length;
              
              return `
              <tr>
                <td class="fw-bold">${c.id}</td>
                <td>${c.name}</td>
                <td>${manha} aluno(s)</td>
                <td>${tarde} aluno(s)</td>
                <td>${noite} aluno(s)</td>
                <td>
                  <div class="flex-between-center" style="gap: 8px;">
                    <button class="btn-edit-course btn-outline btn-outline-accent btn-sm w-full" data-id="${c.id}" data-name="${c.name}">Editar</button>
                    <button class="btn-delete-course btn-outline btn-outline-danger btn-sm w-full" data-id="${c.id}">Excluir</button>
                  </div>
                </td>
              </tr>
            `}).join('')}
            ${courses.length === 0 ? `<tr><td colspan="6" class="text-center text-secondary">Nenhum curso cadastrado.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    `;
  }
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DE CURSOS
 * Lida com a edição e remoção de cursos para perfil de professor/admin
 * @param {Object} State Estado global
 * @param {Function} navigateTo Função de navegação
 */
export function setupCourseInteractions(State, navigateTo) {
  document.querySelectorAll('.btn-edit-course').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const name = e.target.dataset.name;
      
      import('../modal.js').then(({ Modal }) => {
        Modal.open("Editar Curso", `
          <form id="modal-course-form" style="display: grid; gap: 16px;">
            <input type="hidden" id="modal-course-id" value="${id}">
            <div class="input-group">
              <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Código do Curso</label>
              <input type="text" class="input-field" value="${id}" disabled>
            </div>
            <div class="input-group">
              <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Nome do Curso</label>
              <input type="text" id="modal-course-name" class="input-field" required value="${name}">
            </div>
            <button type="submit" class="btn-primary" id="btn-modal-save-course">Salvar Alterações</button>
          </form>
        `, () => {
          document.getElementById('modal-course-form').addEventListener('submit', (ev) => {
            ev.preventDefault();
            const newName = document.getElementById('modal-course-name').value.trim();
            if (!newName) return;
            
            const courses = State.db.courses || [];
            const index = courses.findIndex(c => c.id === id);
            if (index > -1) {
              courses[index] = { id: id, name: newName };
              State.db.saveCourses(courses);
              
              import('../notifications.js').then(({ Notifications }) => {
                Notifications.show('Cursos', 'Curso atualizado com sucesso.', 'success');
              });
              
              Modal.close();
              navigateTo('courses');
            }
          });
        });
      });
    });
  });

  document.querySelectorAll('.btn-delete-course').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (confirm(`Tem certeza que deseja remover o curso ${id}?`)) {
        let courses = State.db.courses;
        courses = courses.filter(c => c.id !== id);
        State.db.saveCourses(courses);
        
        import('../notifications.js').then(({ Notifications }) => {
          Notifications.show('Cursos', 'Curso excluído com sucesso.', 'success');
        });
        
        navigateTo('courses');
      }
    });
  });
}