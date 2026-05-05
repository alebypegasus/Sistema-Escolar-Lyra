export function renderGrades(container, State) {
  if (State.userType === 'student') {
    const s = State.user;
    container.innerHTML = `
      <div class="stats-overview-grid mb-32">
        <div class="card stat-card-flex">
          <div class="stat-label">Média Filtrada</div>
          <div id="filter-avg" class="stat-val ${s.average >= 7 ? 'text-success' : 'text-danger'}">${s.average}</div>
        </div>
        <div class="card stat-card-flex">
          <div class="stat-label">Frequência Filtrada</div>
          <div id="filter-att" class="stat-val">${s.attendance}%</div>
        </div>
      </div>

      <div class="table-wrapper mb-32">
        <div class="table-header-flex">
          <h3 class="fw-bolder">Boletim Atual</h3>
          <div class="flex-start-center gap-12">
            <select id="subject-filter" class="input-field select-min">
              <option value="all">Todas as Disciplinas</option>
              ${s.subjects.map(sub => `<option value="${sub.name}">${sub.name}</option>`).join('')}
            </select>
            <button id="btn-export-my-grades" class="btn-primary btn-outline btn-outline-neutral w-auto text-sm px-16 py-10">
              Exportar
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Nota</th>
              <th>Presença (Faltas)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="grades-tbody">
            ${s.subjects.map(sub => {
              // Calculate class average dynamically
              const allDocs = State.db.students;
              let total = 0;
              let count = 0;
              allDocs.forEach(doc => {
                const docSub = doc.subjects.find(ds => ds.name === sub.name);
                if (docSub && typeof docSub.grade === 'number') {
                  total += docSub.grade;
                  count++;
                }
              });
              const classAvg = count > 0 ? (total / count) : 0;
              const absencesCount = (sub.attendanceRecords || []).filter(r => !r.present).length;
              
              return `
              <tr class="grade-row" data-subject="${sub.name}" data-grade="${sub.grade}" data-attendance="${sub.attendance}">
                <td class="fw-bold">${sub.name}</td>
                <td class="text-secondary">${sub.professor}</td>
                <td>
                  <div class="flex-start-center gap-8">
                    <span class="pill ${sub.grade >= 7 ? 'success' : 'danger'}">${sub.grade.toFixed(1)}</span>
                    <span class="text-xs text-secondary" title="Média da Turma">Turma: ${classAvg.toFixed(1)}</span>
                  </div>
                </td>
                <td class="fw-bold">${sub.attendance}% <span class="fw-normal text-danger text-xs ml-4">(${absencesCount} faltas)</span></td>
                <td>
                  <button class="btn-primary btn-absences btn-outline btn-outline-neutral btn-sm w-auto" data-subject="${sub.name}">Ver Faltas</button>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-wrapper">
        <div class="card-header">
          <h3 class="fw-bolder">Histórico Consolidado</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Semestre</th>
              <th>CR (Coeficiente)</th>
              <th>Status Geral</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${s.history.map(h => `
              <tr class="${h.subjects ? 'no-border-bottom' : ''}">
                <td class="fw-bold">${h.semester}</td>
                <td>${h.gpa.toFixed(1)}</td>
                <td><span class="pill success">Concluído</span></td>
                <td>
                  ${h.subjects ? `<button class="btn-primary toggle-details btn-outline btn-outline-neutral btn-sm w-auto" data-target="details-${h.semester.replace('.','-')}">Ver Detalhes</button>` : ''}
                </td>
              </tr>
              ${h.subjects ? `
              <tr id="details-${h.semester.replace('.','-')}" class="details-row bg-surface hidden-row">
                <td colspan="4" class="details-cell p-24" style="background: var(--bg-panel); border-top: 1px solid var(--border-color); box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                  <div class="mb-12">
                     <h4 class="text-sm fw-bold uppercase tracking-wide text-secondary mb-4">Detalhamento Acadêmico - ${h.semester}</h4>
                     <p class="text-xs text-secondary">Abaixo estão as notas e frequências obtidas na consolidação deste período.</p>
                  </div>
                  <div class="grid-auto-fit gap-16" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
                    ${h.subjects.map(subh => `
                      <div class="card p-16" style="background: var(--bg-surface); border: 1px solid var(--border-color);">
                        <div class="fw-bold text-sm mb-12 flex-align-center gap-8">
                           <div style="width: 8px; height: 8px; border-radius: 50%; background: ${subh.grade >= 7 ? 'var(--success-color)' : 'var(--danger-color)'};"></div>
                           ${subh.name}
                        </div>
                        <div class="flex-between-center text-sm">
                          <div class="flex-col gap-4">
                             <span class="text-xs text-secondary">Média Final</span>
                             <strong class="${subh.grade >= 7 ? 'text-success' : 'text-danger'} text-lg">${subh.grade.toFixed(1)}</strong>
                          </div>
                          <div class="flex-col gap-4 text-right">
                             <span class="text-xs text-secondary">Frequência</span>
                             <strong class="${subh.attendance >= 75 ? 'text-text-primary' : 'text-danger'} text-lg">${subh.attendance}%</strong>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </td>
              </tr>
              ` : ''}
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Teacher View -> Editing Grades
    const p = State.user;
    const studentsWithMySubject = State.db.students.filter(s => (s.subjects || []).some(sub => sub.name === p.subject));
    
    container.innerHTML = `
      <div class="table-wrapper">
        <div class="table-header-flex">
          <div>
            <h3 class="fw-bolder">Lançamento de Notas e Chamada</h3>
            <p class="text-secondary text-sm">${p.subject} (Hoje: ${new Date().toLocaleDateString('pt-BR')})</p>
          </div>
          <div class="flex-start-center gap-12 flex-wrap">
            <select id="teacher-shift-filter" class="input-field select-min-150 w-auto">
              <option value="all">Todos os Turnos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            <input type="text" id="teacher-search" class="input-field w-full max-w-250" placeholder="Buscar por aluno...">
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Matrícula / Turno</th>
              <th>Nota Atual</th>
              <th class="w-180">Presença (Hoje)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${studentsWithMySubject.map(s => {
              const sub = (s.subjects || []).find(sub => sub.name === p.subject);
              if (!sub) return '';
              const today = new Date().toISOString().split('T')[0];
              const attendanceRecord = (sub.attendanceRecords || []).find(r => r.date === today);
              const isPresentToday = attendanceRecord ? attendanceRecord.present : true; // Default present
              
              return `
              <tr class="teacher-grade-row" data-name="${s.name.toLowerCase()}" data-reg="${s.registration.toLowerCase()}" data-shift="${s.shift || ''}" data-student-id="${s.id}">
                <td>
                  <div class="fw-bold">${s.name}</div>
                </td>
                <td>
                  <div class="text-secondary text-sm font-mono">${s.registration}</div>
                  <div class="tag-outline mt-4">${s.shift || 'Não definido'}</div>
                </td>
                <td class="relative">
                  <div class="flex-start-center">
                    <input type="number" step="0.1"
                      class="input-field grade-input grade-input-center p-8 w-80"
                      value="${sub.grade.toFixed(1)}"
                      data-sid="${s.id}" data-subject="${p.subject}">
                    <svg class="check-feedback" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </td>
                <td>
                  <select class="input-field presence-selector p-6 text-sm fw-bold ${isPresentToday ? 'border-success text-success' : 'border-danger text-danger'}" data-sid="${s.id}" data-subject="${p.subject}">
                    <option value="true" ${isPresentToday ? 'selected' : ''} class="text-success">Presente</option>
                    <option value="false" ${!isPresentToday ? 'selected' : ''} class="text-danger">Faltou</option>
                  </select>
                </td>
                <td>
                  <button class="btn-primary btn-view-student btn-outline btn-outline-neutral btn-sm w-auto" data-sid="${s.id}">Detalhes</button>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DE ALUNOS (NOTAS E FALTAS)
 * Manipula a página de filtro, justificativa e exportação (Aluno)
 */
export function setupStudentInteractions(State, navigateTo) {
  const filterSelect = document.getElementById('subject-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      const rows = document.querySelectorAll('.grade-row');
      
      let totalGrade = 0;
      let totalAtt = 0;
      let count = 0;

      rows.forEach(row => {
        const subject = row.dataset.subject;
        if (selected === 'all' || subject === selected) {
          row.classList.remove('hidden-row');
          totalGrade += parseFloat(row.dataset.grade);
          totalAtt += parseFloat(row.dataset.attendance);
          count++;
        } else {
          row.classList.add('hidden-row');
        }
      });

      // Atualiza valores nas caixas de estatísticas
      const avgEl = document.getElementById('filter-avg');
      const attEl = document.getElementById('filter-att');
      
      if (avgEl && count > 0) {
        const newAvg = (totalGrade / count).toFixed(1);
        avgEl.textContent = newAvg;
        avgEl.className = `stat-val ${newAvg >= 7 ? 'text-success' : 'text-danger'}`;
      }
      
      if (attEl && count > 0) {
        const newAtt = Math.floor(totalAtt / count);
        attEl.textContent = `${newAtt}%`;
      }
    });
  }

  // Exportar notas HTML para XLS
  document.getElementById('btn-export-my-grades')?.addEventListener('click', () => {
    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <tr><th>Disciplina</th><th>Professor</th><th>Nota</th><th>Frequencia</th></tr>
          ${State.user.subjects.map(sub => `<tr><td>${sub.name}</td><td>${sub.professor}</td><td>${sub.grade.toFixed(1).replace('.',',')}</td><td>${sub.attendance}%</td></tr>`).join('')}
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boletim_${State.user.name.replace(/\s+/g, '_')}.xls`;
    a.click();
    
    // Pequena pausa para a impressão nativa (PDF)
    setTimeout(() => window.print(), 800);
  });

  // Modal de justificativas de falta
  document.querySelectorAll('.btn-absences').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subjectName = e.target.dataset.subject;
      const sub = State.user.subjects.find(s => s.name === subjectName);
      if (!sub) return;
      
      const absences = (sub.attendanceRecords || []).filter(r => !r.present);
      
      let html = `<div class="flex-col gap-12">`;
      if (absences.length === 0) {
        html += `<p class="text-secondary text-sm">Nenhuma falta registrada para esta disciplina.</p>`;
      } else {
        absences.forEach(ab => {
          const statusText = ab.status === 'pending' ? '<span class="pill warning">Pendente de Justificativa</span>' : 
                             ab.status === 'justified' ? '<span class="pill success">Justificada</span>' : 
                             ab.status === 'rejected' ? '<span class="pill danger">Rejeitada</span>' : 
                             '<span class="pill warning">Aguardando Avaliação</span>';
          
          html += `
            <div class="summary-box">
              <div class="flex-between-center align-start mb-12">
                <span class="fw-bold">Data: ${new Date(ab.date).toLocaleDateString('pt-BR')}</span>
                ${statusText}
              </div>
              ${(ab.status === 'pending' || ab.status === 'rejected') ? `
                <div class="flex-col gap-8">
                  <textarea id="just-text-${ab.id}" class="input-field text-sm" placeholder="Escreva sua justificativa detalhada..." rows="2"></textarea>
                  <input type="url" id="just-url-${ab.id}" class="input-field text-sm" placeholder="URL do Atestado Médico ou Documento (Opcional)">
                  <button class="btn-primary btn-submit-just w-full text-sm p-8" data-id="${ab.id}" data-subject="${subjectName}">Enviar Justificativa e Anexos</button>
                </div>
              ` : `
                <p class="text-sm text-secondary mt-8">Justificativa enviada: ${(ab.justification || 'Sem texto')}</p>
                ${ab.attachment ? `<a href="${ab.attachment}" target="_blank" class="text-sm fw-bold mt-4 inline-block" style="color: var(--accent-color);">📄 Visualizar Anexo/Atestado</a>` : ''}
              `}
            </div>
          `;
        });
      }
      html += `</div>`;

      import('../modal.js').then(({ Modal }) => {
        Modal.open(`Faltas: ${subjectName}`, html, () => {
          document.querySelectorAll('.btn-submit-just').forEach(jb => {
            jb.addEventListener('click', (je) => {
              const abId = je.target.dataset.id;
              const text = document.getElementById(`just-text-${abId}`).value.trim();
              const url = document.getElementById(`just-url-${abId}`).value.trim();
              if (!text && !url) {
                alert('Por favor, digite uma justificativa ou adicione a URL do atestado.');
                return;
              }

              const allStudents = State.db.students;
              const currentStudent = allStudents.find(s => s.id === State.user.id);
              if (currentStudent) {
                const currentSub = currentStudent.subjects.find(cs => cs.name === subjectName);
                const rec = currentSub.attendanceRecords.find(r => r.id === abId);
                if (rec) {
                  rec.justification = text;
                  rec.attachment = url;
                  rec.status = 'under_review'; // professor precisará aprovar
                  State.db.saveStudents(allStudents);
                  Object.assign(State.user, currentStudent);
                  
                  const profs = State.db.professors.filter(p => p.subject === subjectName);
                  profs.forEach(prof => {
                    State.addNotification(prof.id, 'Nova Justificativa', `O aluno ${currentStudent.name.split(' ')[0]} enviou um atestado em ${subjectName}.`, 'warning');
                  });

                  import('../notifications.js').then(({ Notifications }) => {
                    Notifications.show('Atestado Enviado', 'A justificativa foi enviada para avaliação pelo professor.', 'success');
                  });
                  Modal.close();
                  navigateTo('grades'); // recarrega a view
                }
              }
            });
          });
        });
      });
    });
  });

  // Toggle de histórico/boletim passado
  document.querySelectorAll('.toggle-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.target.dataset.target;
      const targetRow = document.getElementById(targetId);
      if (targetRow) {
        if (targetRow.style.display === 'none') {
          targetRow.style.display = 'table-row';
          e.target.textContent = 'Ocultar Detalhes';
        } else {
          targetRow.style.display = 'none';
          e.target.textContent = 'Ver Detalhes';
        }
      }
    });
  });
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DO PROFESSOR (NOTAS E FALTAS)
 * Lida com mudança de notas, buscas e presenças.
 */
export function setupTeacherInteractions(State, navigateTo) {
  // Salvar alterações de notas ao sair do input
  document.querySelectorAll('.grade-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const sid = e.target.dataset.sid;
      const sub = e.target.dataset.subject;
      const val = e.target.value;

      if (State.updateGrade(sid, sub, val)) {
        State.addNotification(sid, 'Nota Atualizada', `Sua nota na disciplina de ${sub} foi atualizada para ${val}.`, 'info');
        
        // Feedback Visual
        const row = e.target.closest('tr');
        row.classList.remove('row-saved');
        void row.offsetWidth; // Força paint re-flow (reset na animação)
        row.classList.add('row-saved');

        const check = e.target.nextElementSibling;
        if (check && check.classList.contains('check-feedback')) {
          check.classList.add('show');
          setTimeout(() => check.classList.remove('show'), 1500);
        }
      }
    });
  });

  // Filtro na tabela para professores (Turno e Nome)
  const shiftFilter = document.getElementById('teacher-shift-filter');
  const searchInput = document.getElementById('teacher-search');

  function applyTeacherFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const shift = shiftFilter ? shiftFilter.value : 'all';
    
    document.querySelectorAll('.teacher-grade-row').forEach(row => {
      const name = row.dataset.name || '';
      const reg = row.dataset.reg || '';
      const rShift = row.dataset.shift || '';
      
      const matchesSearch = name.includes(query) || reg.includes(query);
      const matchesShift = shift === 'all' || rShift === shift;
      
      if (matchesSearch && matchesShift) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyTeacherFilters);
  if (shiftFilter) shiftFilter.addEventListener('change', applyTeacherFilters);

  // Manipular evento de select Presença/Falta
  document.querySelectorAll('.presence-selector').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const sid = e.target.dataset.sid;
      const sub = e.target.dataset.subject;
      const isPresent = e.target.value === 'true';
      
      e.target.style.color = isPresent ? 'var(--success)' : 'var(--danger)';
      e.target.style.borderColor = isPresent ? 'var(--success)' : 'var(--danger)';

      if (State.togglePresence(sid, sub, isPresent)) {
        const allStudents = State.db.students;
        const student = allStudents.find(s => s.id === sid);
        const subject = student?.subjects.find(s_sub => s_sub.name === sub);
        
        State.addNotification(sid, 'Frequência Atualizada', `O professor alterou sua presença em ${sub}. Frequência atual: ${subject?.attendance}%.`, isPresent ? 'success' : 'warning');

        import('../notifications.js').then(({ Notifications }) => {
          if (student && subject && subject.attendance < 75) {
            Notifications.show('Alerta de Frequência', `A frequência de ${student.name.split(' ')[0]} caiu para ${subject.attendance}%.`, 'warning');
          } else {
            Notifications.show('Chamada', `Presença atualizada para ${student.name.split(' ')[0]}`, 'success');
          }
        });
      }
    });
  });
}