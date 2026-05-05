export function renderStudentDetails(container, State) {
  const sid = window.currentViewStudentId;
  const s = State.db.students.find(s => s.id === sid);

  if (!s) {
    container.innerHTML = `<p>Aluno não encontrado.</p>`;
    return;
  }

  const isTeacher = State.userType === 'teacher';
  
  // Consolidar notas
  let generalAverage = 0;
  if (s.subjects.length > 0) {
     generalAverage = s.subjects.reduce((acc, sub) => acc + sub.grade, 0) / s.subjects.length;
  }

  container.innerHTML = `
    <div class="flex-between-center align-start mb-24">
      <div class="profile-header align-start">
        <img src="${s.photo}" alt="Foto" class="profile-avatar-large">
        <div>
          <h2 class="fw-bolder" style="font-size: 24px;">${s.name}</h2>
          <p class="text-secondary text-sm mt-4">Matrícula: ${s.registration} | Curso: ${s.courseName || 'Geral'} | Turno: ${s.shift || 'Não definido'}</p>
          <div class="flex-start-center mt-12 gap-12">
             <span class="pill ${generalAverage >= 7 ? 'success' : 'danger'}">Média Geral: ${generalAverage.toFixed(1)}</span>
             <span class="pill accent">Idade: ${calculateAge(s.dob)} anos</span>
          </div>
        </div>
      </div>
      <div>
        <button id="btn-export-grades" class="btn-primary btn-outline" style="border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-inline"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Exportar Histórico
        </button>
      </div>
    </div>

    <!-- Informações detalhadas -->
    <div class="card mb-24">
      <h3 class="mb-16" style="font-size: 18px;">Dados Cadastrais</h3>
      <div class="grid-auto-fit text-sm gap-16">
         <div><span class="label-block">CPF</span><strong>${s.cpf}</strong></div>
         <div><span class="label-block">RG</span><strong>${s.rg}</strong></div>
         <div><span class="label-block">Data Nasc.</span><strong>${formatDate(s.dob)}</strong></div>
         <div><span class="label-block">Telefone</span><strong>${s.phone || 'Não informado'}</strong></div>
         <div class="grid-span-full"><span class="label-block">Endereço</span><strong>${s.address}</strong></div>
      </div>
    </div>

    <h3 class="fw-bolder mb-16" style="font-size: 18px;">Desempenho Atual (Este Semestre)</h3>
    <div class="table-wrapper mb-24">
      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Professor(a)</th>
            <th>Nota</th>
            <th>Frequência</th>
            <th>Média Turma</th>
          </tr>
        </thead>
        <tbody>
          ${s.subjects.map(sub => `
             <tr>
               <td class="fw-bold">${sub.name}</td>
               <td class="text-secondary">${sub.professor}</td>
               <td><span class="pill ${sub.grade >= 7 ? 'success' : 'danger'}">${sub.grade.toFixed(1)}</span></td>
               <td><strong class="${sub.attendance >= 75 ? 'text-primary' : 'text-danger'}">${sub.attendance}%</strong></td>
               <td class="text-secondary text-xs">${sub.classAverage ? sub.classAverage.toFixed(1) : '-'}</td>
             </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${s.history && s.history.length > 0 ? `
    <h3 class="fw-bolder mb-16" style="font-size: 18px;">Histórico de Semestres Anteriores</h3>
    ${s.history.map(hist => `
      <div class="card card-padded mb-16">
        <h4 class="mb-12" style="font-size: 15px;">Semestre: ${hist.semester} <span class="fw-normal text-secondary ml-12">Média: ${hist.gpa.toFixed(1)}</span></h4>
        <div class="grid-auto-fit gap-12 text-sm">
           ${hist.subjects.map(hsub => `
             <div class="summary-box">
               <div class="fw-bold text-sm mb-4">${hsub.name}</div>
               <div class="flex-between-center text-xs">
                 <span>Nota: <strong class="${hsub.grade >= 7 ? 'text-success' : 'text-danger'}">${hsub.grade.toFixed(1)}</strong></span>
                 <span>Freq: <strong>${hsub.attendance}%</strong></span>
               </div>
             </div>
           `).join('')}
        </div>
      </div>
    `).join('')}
    ` : ''}
  `;
}

/**
 * CONFIGURAÇÃO DE INTERAÇÕES DE DETALHES DO ESTUDANTE
 * Exportação de Notas em PDF e CSV
 */
export function setupStudentDetailsInteractions(State, navigateTo) {
  const sid = window.currentViewStudentId;
  const s = State.db.students.find(student => student.id === sid);

  const exportBtn = document.getElementById('btn-export-grades');
  if (exportBtn && s) {
    exportBtn.addEventListener('click', () => {
      // Gera um CSV simples para exportação
      let csv = "Disciplina,Professor,Nota,Frequencia,Media Turma\n";
      s.subjects.forEach(sub => {
        csv += `"${sub.name}","${sub.professor}",${sub.grade.toFixed(1)},${sub.attendance},${sub.classAverage || '-'}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historico_${s.name.replace(/\s+/g, '_')}.csv`;
      a.click();
      
      // Aciona o modo de impressão do navegador para gerar PDF
      setTimeout(() => {
         window.print();
      }, 500);
    });
  }
}

/**
 * Função utilitária para calcular a idade
 */
function calculateAge(dobStr) {
  if (!dobStr) return 0;
  const dob = new Date(dobStr);
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms); 
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

/**
 * Função utilitária para formatar a data para pt-BR
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}