export function renderGrades(container, State) {
  if (State.userType === 'student') {
    const s = State.user;
    const staggeredCards = s.subjects.map((sub, idx) => {
      const delay = (idx * 0.1).toFixed(1);
      return `
        <div class="card hover-fluid p-24" >
          <div class="flex-between-center">
            <h4 class="text-lg fw-bold" style="color: var(--color-brand-primary)">${sub.name}</h4>
            <span class="text-sm font-medium text-secondary">Prof. ${sub.professor}</span>
          </div>
          <div class="flex-between-start mt-16">
            <div class="flex-col gap-4">
              <span class="text-xs text-secondary uppercase tracking-wider">Média Final</span>
              <span class="text-3xl fw-bolder ${sub.grade >= 7 ? 'text-success' : 'text-danger'}">${sub.grade.toFixed(1)}</span>
            </div>
            <div class="flex-col gap-4 text-right">
              <span class="text-xs text-secondary uppercase tracking-wider">Frequência</span>
              <span class="text-3xl fw-bolder ${sub.attendance >= 75 ? 'text-success' : 'text-danger'}">${sub.attendance}%</span>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="w-full bg-border rounded-full h-1 overflow-hidden" style="margin-top: 1.5rem; background: rgba(0,0,0,0.05);">
            <div class="h-full rounded-full" style="width: ${(sub.grade/10)*100}%; background-color: ${sub.grade >= 7 ? '#10b981' : '#ef4444'}; transition: width 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${parseFloat(delay) + 0.3}s;"></div>
          </div>
          <div class="mt-16 text-center">
            <button class="btn-primary btn-absences w-full" style="background: rgba(99, 102, 241, 0.1); color: var(--color-brand-primary); border: none;" data-subject="${sub.name}">Detalhes de Faltas</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <!-- Glass Header -->
      <div class="card p-32 mb-32 flex-between-center flex-wrap gap-24 relative overflow-hidden" >
        <div class="flex-col gap-8 z-10">
          <h2 class="text-3xl fw-bolder tracking-tight" style="color: var(--color-brand-primary)">${s.name}</h2>
          <p class="text-md text-secondary font-mono">${s.registration}</p>
        </div>
        <div class="flex-row gap-32 z-10">
          <div class="flex-col gap-4 text-right">
            <span class="text-sm text-secondary uppercase tracking-wider">Média Geral</span>
            <span class="text-4xl fw-bolder ${s.average >= 7 ? 'text-success' : 'text-danger'}">${s.average}</span>
          </div>
          <div class="flex-col gap-4 text-right border-l pl-32" style="border-color: rgba(0,0,0,0.1);">
            <span class="text-sm text-secondary uppercase tracking-wider">Frequência</span>
            <span class="text-4xl fw-bolder">${s.attendance}%</span>
          </div>
        </div>
        <div style="position: absolute; right: 2rem; opacity: 0.1; transform: scale(3) rotate(-15deg); pointer-events: none;">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        </div>
      </div>

      <div class="flex-between-center mb-16" style="animation: liquid-enter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s backwards;">
        <h3 class="fw-bolder text-xl">Disciplinas e Notas</h3>
        <button id="btn-export-my-grades" class="btn-icon" title="Exportar Notas" style="width: 44px; height: 44px; border-radius: 12px; border: none; background: rgba(99, 102, 241, 0.1); color: var(--color-brand-primary);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
      </div>

      <!-- Subject Grid -->
      <div class="grid-3-cols gap-24 mb-32">
        ${staggeredCards}
      </div>
      
      <div class="card" >
        <div class="p-24 border-bottom" style="border-color: rgba(0,0,0,0.05);">
          <h3 class="fw-bolder text-lg">Histórico Consolidado</h3>
        </div>
        <div class="data-table-container pb-16">
          <table class="data-table">
            <thead>
              <tr>
                <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Semestre</th>
                <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">CR (Coeficiente)</th>
                <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Status Geral</th>
                <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${s.history.map(h => `
                <tr class="hover-row-fluid ${h.subjects ? 'no-border-bottom' : ''}">
                  <td class="fw-bold" style="border-bottom: 1px solid rgba(0,0,0,0.03);">${h.semester}</td>
                  <td style="border-bottom: 1px solid rgba(0,0,0,0.03);">${h.gpa.toFixed(1)}</td>
                  <td style="border-bottom: 1px solid rgba(0,0,0,0.03);"><span class="status-pill success">Concluído</span></td>
                  <td style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                    ${h.subjects ? `<button class="btn-primary toggle-details btn-sm w-auto" style="background: rgba(99, 102, 241, 0.1); color: var(--color-brand-primary); border: none;" data-target="details-${h.semester.replace('.','-')}">Ver Detalhes</button>` : ''}
                  </td>
                </tr>
                ${h.subjects ? `
                <tr id="details-${h.semester.replace('.','-')}" class="details-row bg-surface hidden-row">
                  <td colspan="4" class="details-cell p-24" style="background: rgba(0,0,0,0.01); border-top: 1px solid var(--border-color); box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                    <div class="mb-12">
                       <h4 class="text-sm fw-bold uppercase tracking-wide text-secondary mb-4">Detalhamento Acadêmico - ${h.semester}</h4>
                       <p class="text-xs text-secondary">Abaixo estão as notas e frequências obtidas na consolidação deste período.</p>
                    </div>
                    <div class="grid-auto-fit gap-16" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
                      ${h.subjects.map(subh => `
                        <div class="card p-16" >
                          <div class="fw-bold text-sm mb-12 flex-align-center gap-8">
                             <div style="width: 8px; height: 8px; border-radius: 50%; background: ${subh.grade >= 7 ? '#10b981' : '#ef4444'};"></div>
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
      </div>
    `;
  } else {
    // Teacher View -> Editing Grades
    const p = State.user;
    const studentsWithMySubject = State.db.students.filter(s => (s.subjects || []).some(sub => sub.name === p.subject));
    
    container.innerHTML = `
      <div class="card p-24 mb-24 flex-between-center flex-wrap gap-16" >
        <div>
          <h3 class="fw-bolder text-2xl tracking-tight" style="color: var(--color-brand-primary)">Lançamento de Notas e Chamada</h3>
          <p class="text-secondary mt-4">${p.subject} &bull; Hoje: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="flex-start-center gap-12 flex-wrap">
          <select id="teacher-shift-filter" class="input-field" >
            <option value="all">Todos os Turnos</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
          <input type="text" id="teacher-search" class="input-field"  placeholder="Buscar por aluno...">
        </div>
      </div>

      <div class="data-table-container card" >
        <table class="data-table">
          <thead>
            <tr>
              <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Aluno</th>
              <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Matrícula / Turno</th>
              <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Nota Atual</th>
              <th class="w-180" style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Presença (Hoje)</th>
              <th style="background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05);">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${studentsWithMySubject.map((s, idx) => {
              const sub = (s.subjects || []).find(sub => sub.name === p.subject);
              if (!sub) return '';
              const today = new Date().toISOString().split('T')[0];
              const attendanceRecord = (sub.attendanceRecords || []).find(r => r.date === today);
              const isPresentToday = attendanceRecord ? attendanceRecord.present : true; // Default present
              const delay = (idx * 0.05).toFixed(2);
              
              return `
              <tr class="teacher-grade-row hover-row-fluid" style="animation: liquid-enter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}s backwards;" data-name="${s.name.toLowerCase()}" data-reg="${s.registration.toLowerCase()}" data-shift="${s.shift || ''}" data-student-id="${s.id}">
                <td style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                  <div class="fw-bold text-md">${s.name}</div>
                </td>
                <td style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                  <div class="text-secondary text-sm font-mono">${s.registration}</div>
                  <div class="tag-outline mt-4" style="background: rgba(99,102,241,0.05); color: var(--color-brand-primary); border: none;">${s.shift || 'Não definido'}</div>
                </td>
                <td class="relative" style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                  <div class="flex-start-center relative">
                    <input type="number" step="0.1"
                      class="input-field grade-input p-8 w-80 text-lg fw-bold"
                      style="background: rgba(255,255,255,0.5); border-radius: 0.75rem; text-align: center; border-color: rgba(0,0,0,0.1);"
                      value="${sub.grade.toFixed(1)}"
                      data-sid="${s.id}" data-subject="${p.subject}">
                    <svg class="check-feedback" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; right: -30px; opacity: 0; transform: scale(0.5); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </td>
                <td style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                  <div class="mac-toggle-wrapper">
                    <input type="checkbox" class="mac-toggle presence-selector-toggle" ${isPresentToday ? 'checked' : ''} data-sid="${s.id}" data-subject="${p.subject}">
                    <span class="mac-toggle-label ${isPresentToday ? 'text-success' : 'text-danger'}">${isPresentToday ? 'Presente' : 'Faltou'}</span>
                  </div>
                </td>
                <td style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                  <button class="btn-icon btn-view-student hover-fluid" data-sid="${s.id}" style="width: 36px; height: 36px; border-radius: 10px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
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
  // Salvar alterações de notas ao sair do input (Blur ou Change)
  document.querySelectorAll('.grade-input').forEach(input => {
    // Escutamos o focus para guardar o valor original
    input.addEventListener('focus', (e) => {
      e.target.dataset.original = e.target.value;
    });

    input.addEventListener('blur', (e) => {
      const sid = e.target.dataset.sid;
      const sub = e.target.dataset.subject;
      const val = e.target.value;
      const original = e.target.dataset.original;

      // Só processa se o valor realmente mudou
      if (val !== original) {
        if (State.updateGrade(sid, sub, val)) {
          State.addNotification(sid, 'Nota Atualizada', `Sua nota na disciplina de ${sub} foi atualizada para ${val}.`, 'info');
          
          // Feedback Visual Sutil Animated Checkmark
          const check = e.target.nextElementSibling;
          if (check && (check.classList.contains('check-feedback') || check.tagName.toLowerCase() === 'svg')) {
             check.style.opacity = '1';
             check.style.transform = 'scale(1)';
             setTimeout(() => {
               check.style.opacity = '0';
               check.style.transform = 'scale(0.5)';
             }, 1500);
          }
          
          // Atualiza o original para futuras mudancas sem sair do foco se usar enter
          e.target.dataset.original = val;
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

  // Manipular evento de toggle Presença/Falta
  document.querySelectorAll('.presence-selector-toggle').forEach(t => {
    t.addEventListener('change', (e) => {
      const sid = e.target.dataset.sid;
      const sub = e.target.dataset.subject;
      const isPresent = e.target.checked;
      
      const label = e.target.nextElementSibling;
      if (label) {
        label.textContent = isPresent ? 'Presente' : 'Faltou';
        label.className = `mac-toggle-label ${isPresent ? 'text-success' : 'text-danger'}`;
      }

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