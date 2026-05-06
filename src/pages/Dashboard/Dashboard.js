export function renderDashboard(container, State) {
  // O Dashboard mostra uma visão diferente se for estudante ou professor/admin
  if (State.userType === 'student') {
    const s = State.user;
    
    // Injetamos HTML direto na div container usando template literals (crase: ` `)
    // Isso é seguro porque controlamos os dados locais (nada de input de usuário direto não escapado)
    container.innerHTML = `
      <div class="stats-grid mb-32">
        <div class="card p-24" >
          <div class="stat-label mb-8">Média Geral Acadêmica</div>
          <!-- Operador Ternário JS (condition ? true : false) para pintar a nota de verde ou vermelho! -->
          <div class="text-4xl fw-bolder ${s.average >= 7 ? 'text-success' : 'text-danger'}">${s.average}</div>
        </div>
        <div class="card p-24" >
          <div class="stat-label mb-8">Frequência Semestral</div>
          <div class="text-4xl fw-bolder">${s.attendance}%</div>
        </div>
      </div>
      
      <!-- Card decorativo de "Avisos" p/ engajamento -->
      <div class="card p-24 flex-between-center flex-wrap gap-16 action-banner" >
        <div class="action-banner-text">
          <h3 class="text-xl fw-bolder text-primary mb-4">Inscrição para o TCC</h3>
          <p class="text-secondary text-sm">O prazo letivo encerra em 20 de Novembro de 2026.</p>
        </div>
        <button class="btn-primary w-auto"  onclick="alert('Funcionalidade em desenvolvimento!')">Inscrever-se</button>
      </div>
    `;
  } else {
    // VISÃO: PROFESSOR (Ou Admin logado para dar notas em alguma disciplina)
    const p = State.user;
    const allStudents = State.db.students;
    
    // Contadores matemáticos para o Header do Dashboard
    let enrolled = 0;
    let totalGrades = 0;
    // Agrupamento de alunos em risco separados por matéria = { "Matematica": [alunoObj, ...], ... }
    const lowAttBySubject = {};
    let hasLowAtt = false;
    
    // Array para guardar pedidos médicos ("Mãe, tô doente")
    const pendingRequests = [];
    
    // 1º Passo: Vasculhar o banco MOCKADO de TODOS os alunos da escola
    allStudents.forEach(s => {
      const sSubjects = s.subjects || [];
      // Esse aluno cursa a minha disciplina?
      const sub = sSubjects.find(sub => sub.name === p.subject);
      
      if (sub) {
        enrolled++; // Opa, mais um aluno matriculado
        totalGrades += sub.grade || 0; // Somatório da nota
        
        // Verifica se há alguma falta "Em análise" (under_review) com atestado
        if (sub.attendanceRecords) {
          sub.attendanceRecords.forEach(r => {
            if (r.status === 'under_review') {
              // Empurra(push) pros Requests
              pendingRequests.push({ s, sub, record: r });
            }
          });
        }
      }
      
      // 2º Passo (Para a Turma ou Todo Mundo) Alunos em Risco Crítico
      sSubjects.forEach(subj => {
        // Abaixo de 75% o aluno jubila!
        if (subj.attendance < 75) {
          hasLowAtt = true;
          // Se não existir a array dessa materia, cria uma.
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

    // Média real da Turma do respectivo orientador
    const classAvg = enrolled > 0 ? (totalGrades / enrolled).toFixed(1) : '-';
    
    // Preparo de Blocos Condicionais de HTML. 
    // Só mostro PENDENCIAS MÉDICAS se ouver > 0.
    const pendingRequestsCount = pendingRequests.length;
    let pendingRequestsHTML = '';
    
    if (pendingRequestsCount > 0) {
      pendingRequestsHTML = `
        <div class="card hover-fluid status-card alert-warning mt-24 p-24" >
          <div class="flex-col gap-8">
            <h3 class="status-title text-warning text-lg fw-bold">
              <!-- SVG Inline do Ícone -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Justificativas Pendentes
            </h3>
            <p class="text-sm" style="color: var(--warning-color); opacity: 0.8;">Você possui ${pendingRequestsCount} atestado(s)/justificativa(s) aguardando avaliação.</p>
          </div>
          <!-- Data-attribute p/ o setupInteraction identificar -->
          <button id="btn-dashboard-pending-just" class="btn-primary w-auto btn-warning" >Revisar</button>
        </div>
      `;
      
      // Storeing as vars globalmente no browser p/ facilitar passagem pro Modal Interceptor (evita memory leaks d+ vars soltas)
      window.currentPendingRequests = pendingRequests;
    }

    // Mesmo Esquema Condicional pro Frequencia Critica
    let lowAttHTML = '';
    if (hasLowAtt) {
      // Usamos Map pra renderizar listas diretamente do objeto.
      // Object.entries desmembra o Objt -> [["Matemática", [alun1, alun2]], ["Física", [alun3]]]
      const subjectAccordions = Object.entries(lowAttBySubject).map(([subName, students]) => `
        <details class="accordion-card" >
          <summary class="accordion-summary" style="padding: 16px;">
            ${subName}
            <span class="pill danger no-pointer">${students.length} aluno(s)</span>
          </summary>
          <div class="accordion-content" style="border-top: 1px dotted var(--border-color); background: transparent;">
            <ul class="student-list gap-8 flex-col">
              ${students.map(s => `
                <li class="btn-view-student list-item-card hover-fluid" data-sid="${s.id}" >
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
      `).join(''); // Usamos Join pq o "Map" retorna array com vírgulas. E pra setar HTML queremos uma string limpadinha de vírgulas.

      lowAttHTML = `
        <div class="card alert-danger mt-24 p-24" >
          <h3 class="status-title text-danger mb-16 text-lg fw-bold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Frequência Crítica (< 75%)
          </h3>
          ${subjectAccordions}
        </div>
      `;
    }

    // Por fim... O CUSPIR MÁXIMO da tela do Professor
    container.innerHTML = `
      <div class="stats-grid mb-32">
        <div class="card p-24 hover-fluid" >
          <div class="stat-label mb-8">Alunos Matriculados</div>
          <div class="text-4xl fw-bolder" style="color: var(--color-brand-primary)">${enrolled}</div>
        </div>
        <div class="card p-24 hover-fluid" >
          <div class="stat-label mb-8">Média da Turma</div>
          <div class="flex-between-center">
            <div class="text-4xl fw-bolder">${classAvg}</div>
            <span class="pill accent">${p.subject}</span>
          </div>
        </div>
      </div>
      <div class="card p-24 mt-24 hover-fluid" >
        <h3 class="text-xl fw-bold" style="color: var(--color-brand-primary)">Próximos Passos</h3>
        <p class="text-secondary text-sm mt-8">A revisão bimestral precisa ser encerrada até a pŕoxima semana para o conselho de classe.</p>
      </div>
      
      <!-- Injeção dos Blocos Condicionais criados acima (Caso seja vazio será invisível) -->
      ${pendingRequestsHTML}
      ${lowAttHTML}
    `;
  }
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DO DASHBOARD
 * Lida com clicks, atalhos, binds de events. É invocada 400ms DEPOIS do HTML renderizar ali em cima.
 * @param {Object} State Estado global
 */
export function setupDashboardInteractions(State, navigateTo) {
  // A professora clicou em "Revisar Pedidos Médicos?"
  const btnPending = document.getElementById('btn-dashboard-pending-just');
  
  if (btnPending) { // Só rola se o bloco HTML foi cuspido lá no loop condicional!
    btnPending.addEventListener('click', () => {
      const requests = window.currentPendingRequests || [];
      if (requests.length === 0) return;

      // Agrupa solicitações (reqs.s, reqs.sub) etc por disciplina para separar visualmente
      const bySubject = {};
      requests.forEach(req => {
        if (!bySubject[req.sub.name]) bySubject[req.sub.name] = [];
        bySubject[req.sub.name].push(req);
      });

      // Cria a tela do popup!
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
                  <!-- data-* attributes são vitais aqui pra passar o Student ID(sid) e Record ID(rid) pra frente -->
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

      // Lazy Loading: Importa dinamicamente a Modal do projeto. Ajuda a não criar Load Bloating no ínicio.
      import('../../components/Modal/Modal.js').then(({ Modal }) => {
        
        // Modal.open(titulo, StringHTML, callback (executado AGORA após Modal existir na tela))
        Modal.open('Revisão de Justificativas', html, () => {
          
          // Pra cada aluno do Popup, damos vida ao "Aceitar":
          document.querySelectorAll('.btn-approve-just-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const sid = e.target.dataset.sid;
              const rid = e.target.dataset.rid;
              updateJustificationStatus(sid, rid, 'justified', State, navigateTo, Modal);
              
              const row = e.target.closest('li');
              if (row) row.remove(); // Apague visualmente a row!
              
              // Se eu aprovar o último e zerar a lista, vaza a modal logo
              if (document.querySelectorAll('.btn-approve-just-modal').length === 0) Modal.close();
            });
          });

          // Idem pra Rejeitar
          document.querySelectorAll('.btn-reject-just-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const sid = e.target.dataset.sid;
              const rid = e.target.dataset.rid;
              updateJustificationStatus(sid, rid, 'rejected', State, navigateTo, Modal);
              const row = e.target.closest('li');
              if (row) row.remove();
              if (document.querySelectorAll('.btn-reject-just-modal').length === 0) Modal.close();
            });
          });
        });
      });
    });
  }
}

/**
 * ROTINA DE BANCO DE DADOS (Helper Exclusivo do Dashboard)
 * Atualiza no banco local o status da justificativa de falta e REFAZ a Matemática Da Bolachona.
 */
function updateJustificationStatus(sid, rid, newStatus, State, navigateTo, Modal) {
  const allStudents = State.db.students;
  const student = allStudents.find(s => s.id === sid); // Pega o Zequinha
  
  if (student) {
    const sub = student.subjects.find(s => s.name === State.user.subject); // Matemática do Zequinha
    
    if (sub && sub.attendanceRecords) {
      const rec = sub.attendanceRecords.find(r => r.id === rid); // A Falta em si de 26/02/2026
      
      if (rec) {
        rec.status = newStatus; // Alteramos o state dela (justified/rejected)
        
        if (newStatus === 'justified') {
          // SE O PROFESSOR ACEITOU ATD MÉDICO... A falta precisa virar presença!
          rec.present = true; 
          
          // Tem que Re-Corrigir e Refazer a matemática (%) desse aluno
          const absences = sub.attendanceRecords.filter(r => !r.present).length;
          // Considerando -5% de desconto p/ falta (Fictício pro nosso app)
          sub.attendance = Math.max(0, 100 - (absences * 5)); 
          
          // E tem que refazer tb a porcentagem GLOBAL das faltas e presenças nele.
          const attAvg = Math.floor(student.subjects.reduce((acc, sub_a) => acc + sub_a.attendance, 0) / student.subjects.length);
          student.attendance = attAvg;
        }
        
        // Submete toda galera pro HD dnv
        State.db.saveStudents(allStudents); 
        
        // Alerta o Zequinha que a mae dele safou ele // CTI Notification // Danger -> vermelho / Success -> Verde
        State.addNotification(sid, 'Atestado Avaliado', `Seu atestado na disciplina de ${State.user.subject} foi ${newStatus === 'justified' ? 'aceito' : 'rejeitado'}.`, newStatus === 'justified' ? 'success' : 'danger');

        // Notifica na Tela do Professor Tb
        const msg = 'Justificativa ' + (newStatus === 'justified' ? 'aceita' : 'rejeitada');
        import('../../components/Notification/Notification.js').then(({ Notifications }) => {
           Notifications.show('Atestado', msg, newStatus === 'justified' ? 'success' : 'danger');
        });
        
        // Recarrega a tela de fundo (Dash) inteira (SPA router) e limpa blocos amarelos vazios caso existam!
        navigateTo('dashboard', true); 
      }
    }
  }
}