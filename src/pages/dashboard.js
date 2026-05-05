export function renderDashboard(container, State) {
  if (State.userType === 'student') {
    const s = State.user;
    container.innerHTML = `
      <div class="stats-grid">
        <div class="card">
          <div class="stat-label">Média Geral Acadêmica</div>
          <div class="stat-val ${s.average >= 7 ? 'text-success' : 'text-danger'}">${s.average}</div>
        </div>
        <div class="card">
          <div class="stat-label">Frequência Semestral</div>
          <div class="stat-val">${s.attendance}%</div>
        </div>
      </div>
      <div class="card flex-between-center action-banner">
        <div class="action-banner-text">
          <h3 class="action-banner-title">Inscrição para o TCC</h3>
          <p class="text-secondary text-sm">O prazo letivo encerra em 20 de Novembro de 2026.</p>
        </div>
        <button class="btn-primary w-auto" onclick="alert('Funcionalidade em desenvolvimento!')">Inscrever-se</button>
      </div>
    `;
  } else {
    // Teacher
    const p = State.user;
    const allStudents = State.db.students;
    let enrolled = 0;
    let totalGrades = 0;
    const lowAttBySubject = {};
    let hasLowAtt = false;
    const pendingRequests = [];
    
    allStudents.forEach(s => {
      const sSubjects = s.subjects || [];
      const sub = sSubjects.find(sub => sub.name === p.subject);
      if (sub) {
        enrolled++;
        totalGrades += sub.grade || 0;
        if (sub.attendanceRecords) {
          sub.attendanceRecords.forEach(r => {
            if (r.status === 'under_review') {
              pendingRequests.push({ s, sub, record: r });
            }
          });
        }
      }
      
      // Group all students with low attendance by subject
      sSubjects.forEach(subj => {
        if (subj.attendance < 75) {
          hasLowAtt = true;
          if (!lowAttBySubject[subj.name]) lowAttBySubject[subj.name] = [];
          lowAttBySubject[subj.name].push({ 
            id: s.id, 
            name: s.name, 
            registration: s.registration, 
            attendance: subj.attendance,
            shift: s.shift
          });
        }
      });
    });

    const classAvg = enrolled > 0 ? (totalGrades / enrolled).toFixed(1) : '-';
    
    const pendingRequestsCount = pendingRequests.length;
    let pendingRequestsHTML = '';
    
    if (pendingRequestsCount > 0) {
      pendingRequestsHTML = `
        <div class="card status-card alert-warning mt-24">
          <div>
            <h3 class="status-title text-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Justificativas Pendentes
            </h3>
            <p class="status-subtitle">Você possui ${pendingRequestsCount} atestado(s)/justificativa(s) aguardando avaliação.</p>
          </div>
          <button id="btn-dashboard-pending-just" class="btn-primary w-auto btn-warning">Revisar Justificativas</button>
        </div>
      `;
      
      // Store globally for the modal
      window.currentPendingRequests = pendingRequests;
    }

    let lowAttHTML = '';
    if (hasLowAtt) {
      const subjectAccordions = Object.entries(lowAttBySubject).map(([subName, students]) => `
        <details class="accordion-card">
          <summary class="accordion-summary">
            ${subName}
            <span class="pill danger no-pointer">${students.length} aluno(s)</span>
          </summary>
          <div class="accordion-content">
            <ul class="student-list">
              ${students.map(s => `
                <li class="btn-view-student list-item-card" data-sid="${s.id}">
                  <div class="list-item-info">
                    <span class="list-item-title">${s.name}</span>
                    <span class="list-item-subtitle">${s.registration} | Turno: ${s.shift || 'Geral'}</span>
                  </div>
                  <span class="text-danger fw-bold">${s.attendance}%</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </details>
      `).join('');

      lowAttHTML = `
        <div class="card status-card alert-danger mt-24">
          <h3 class="status-title text-danger mb-16">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Alunos com Frequência Crítica (< 75%)
          </h3>
          ${subjectAccordions}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="stats-grid">
        <div class="card">
          <div class="stat-label">Alunos Matriculados</div>
          <div class="stat-val">${enrolled}</div>
        </div>
        <div class="card">
          <div class="stat-label">Média da Turma: ${p.subject}</div>
          <div class="stat-val">${classAvg}</div>
        </div>
      </div>
      <div class="card mt-24">
        <h3>Próximos Passos</h3>
        <p class="text-secondary text-sm mt-8">A revisão bimestral precisa ser encerrada até a pŕoxima semana para o conselho de classe.</p>
      </div>
      ${pendingRequestsHTML}
      ${lowAttHTML}
    `;
  }
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DO DASHBOARD
 * Lida com eventos de cliques, revisão de justificativas e modais
 * @param {Object} State Estado global
 */
export function setupDashboardInteractions(State, navigateTo) {
  const btnPending = document.getElementById('btn-dashboard-pending-just');
  if (btnPending) {
    btnPending.addEventListener('click', () => {
      const requests = window.currentPendingRequests || [];
      if (requests.length === 0) return;

      // Agrupa solicitações por disciplina
      const bySubject = {};
      requests.forEach(req => {
        if (!bySubject[req.sub.name]) bySubject[req.sub.name] = [];
        bySubject[req.sub.name].push(req);
      });

      let html = `<div class="modal-list-wrapper">`;
      for (const [subjectName, reqs] of Object.entries(bySubject)) {
        html += `
          <div class="modal-list-group">
            <h4 class="modal-list-title">${subjectName}</h4>
            <ul class="modal-list">
        `;
        reqs.forEach(req => {
          html += `
            <li class="modal-list-item">
              <div class="modal-list-content">
                <div>
                  <span class="modal-list-item-title">${req.s.name} <span class="modal-list-item-date">(${new Date(req.record.date).toLocaleDateString('pt-BR')})</span></span>
                  <p class="modal-list-item-desc">${req.record.justification || 'Nenhuma justificativa em texto.'}</p>
                  ${req.record.attachment ? `<a href="${req.record.attachment}" target="_blank" class="document-link">📄 Ver Atestado Anexado</a>` : ''}
                </div>
                <div class="modal-list-actions">
                  <button class="btn-primary btn-approve-just-modal btn-success btn-sm w-auto" data-sid="${req.s.id}" data-rid="${req.record.id}">Aceitar</button>
                  <button class="btn-primary btn-reject-just-modal btn-danger btn-sm w-auto" data-sid="${req.s.id}" data-rid="${req.record.id}">Rejeitar</button>
                </div>
              </div>
            </li>
          `;
        });
        html += `
            </ul>
          </div>
        `;
      }
      html += `</div>`;

      // Aqui precisaremos importar o Modal. Como não podemos mudar as importações de forma segura agora sem quebrar dependência circular
      // Usamos a window global ou os importamos diretamente
      import('../modal.js').then(({ Modal }) => {
        Modal.open('Revisão de Justificativas', html, () => {
          // Modal aberto, registrar eventos nos botões recém adicionados
          document.querySelectorAll('.btn-approve-just-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const sid = e.target.dataset.sid;
              const rid = e.target.dataset.rid;
              updateJustificationStatus(sid, rid, 'justified', State, navigateTo, Modal);
              e.target.closest('li').remove();
              if (document.querySelectorAll('.btn-approve-just-modal').length === 0) Modal.close();
            });
          });

          document.querySelectorAll('.btn-reject-just-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const sid = e.target.dataset.sid;
              const rid = e.target.dataset.rid;
              updateJustificationStatus(sid, rid, 'rejected', State, navigateTo, Modal);
              e.target.closest('li').remove();
              if (document.querySelectorAll('.btn-reject-just-modal').length === 0) Modal.close();
            });
          });
        });
      });
    });
  }
}

/**
 * Atualiza no banco local o status da justificativa de falta
 */
function updateJustificationStatus(sid, rid, newStatus, State, navigateTo, Modal) {
  const allStudents = State.db.students;
  const student = allStudents.find(s => s.id === sid);
  
  if (student) {
    const sub = student.subjects.find(s => s.name === State.user.subject);
    if (sub && sub.attendanceRecords) {
      const rec = sub.attendanceRecords.find(r => r.id === rid);
      if (rec) {
        rec.status = newStatus;
        if (newStatus === 'justified') {
          // Reverte a falta pois foi justificada médica
          rec.present = true; 
          const absences = sub.attendanceRecords.filter(r => !r.present).length;
          sub.attendance = Math.max(0, 100 - (absences * 5));
          const attAvg = Math.floor(student.subjects.reduce((acc, sub_a) => acc + sub_a.attendance, 0) / student.subjects.length);
          student.attendance = attAvg;
        }
        State.db.saveStudents(allStudents);
        
        State.addNotification(sid, 'Atestado Avaliado', `Seu atestado na disciplina de ${State.user.subject} foi ${newStatus === 'justified' ? 'aceito' : 'rejeitado'}.`, newStatus === 'justified' ? 'success' : 'danger');

        const msg = 'Justificativa ' + (newStatus === 'justified' ? 'aceita' : 'rejeitada');
        import('../notifications.js').then(({ Notifications }) => {
           Notifications.show('Atestado', msg, newStatus === 'justified' ? 'success' : 'danger');
        });
        
        navigateTo('dashboard');
      }
    }
  }
}