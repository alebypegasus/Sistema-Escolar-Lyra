import { State } from "./store.js";
import { Notifications } from "./notifications.js";
import { navigateTo } from "./script.js";

// Global Modal Functions
export const Modal = {
  open: (title, htmlContent, onReady) => {
    const overlay = document.getElementById('global-modal');
    const contentBox = document.getElementById('global-modal-content');

    contentBox.innerHTML = `
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" onclick="document.getElementById('global-modal').classList.add('hidden')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body">
        ${htmlContent}
      </div>
    `;

    overlay.classList.remove('hidden');

    if (onReady) onReady();
  },
  close: () => {
    document.getElementById('global-modal').classList.add('hidden');
  }
};

export function renderActionButtons() {
  let container = document.getElementById('fab-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'fab-container';
    container.className = 'fab-container';
    document.body.appendChild(container);
  }

  if (State.userType !== 'teacher') {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = `
    <button title="Adicionar Curso" id="btn-modal-add-course" class="btn-primary tooltip-host fab-btn fab-btn-secondary">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="12" y1="8" x2="12" y2="14"></line><line x1="9" y1="11" x2="15" y2="11"></line></svg>
    </button>
    <button title="Cadastrar Aluno" id="btn-modal-add-student" class="btn-primary tooltip-host fab-btn fab-btn-primary">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
    </button>
  `;

  document.getElementById('btn-modal-add-course').addEventListener('click', () => {
    Modal.open("Novo Curso", `
      <form id="modal-course-form" style="display: grid; gap: 16px;">
        <input type="hidden" id="modal-course-id">
        <div class="input-group">
          <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Nome do Curso</label>
          <input type="text" id="modal-course-name" class="input-field" required placeholder="Digite o nome do curso (Ex: Direito)">
        </div>
        <button type="submit" class="btn-primary" id="btn-modal-save-course">Salvar Curso</button>
      </form>
    `, () => {
      document.getElementById('modal-course-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('modal-course-name').value.trim();
        if (!name) return;

        const courses = State.db.courses || [];
        // Generate Course Code implicitly: Highest code + 1
        let codeNum = 1000;
        courses.forEach(c => {
          const num = parseInt(c.id);
          if (!isNaN(num) && num > codeNum) codeNum = num;
        });
        const nextCode = (codeNum + 1).toString();

        courses.push({ id: nextCode, name: name });
        State.db.saveCourses(courses);
        Notifications.show('Cursos', 'Curso adicionado com sucesso.', 'success');
        Modal.close();
        if (State.currentPage === 'courses') navigateTo('courses');
      });
    });
  });

  document.getElementById('btn-modal-add-student').addEventListener('click', () => {
    Modal.open("Novo Aluno", `
      <form id="modal-add-student-form" style="display: grid; gap: 16px;">
        <!-- Identificação -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="input-group">
             <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Nome Completo</label>
             <input type="text" id="modal-new-sys-name" class="input-field" placeholder="Ex: João da Silva" required>
          </div>
          <div class="input-group">
             <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Curso</label>
             <select id="modal-new-sys-course" class="input-field" required>
                <!-- populated by JS -->
             </select>
          </div>
        </div>
        
        <!-- Pessoais -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="input-group">
            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Data de Nascimento</label>
            <input type="date" id="modal-new-sys-dob" class="input-field" required>
          </div>
          <div class="input-group">
            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">RG</label>
            <input type="text" id="modal-new-sys-rg" class="input-field" placeholder="Ex: 11.222.333-4" required>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="input-group">
            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">CPF</label>
            <input type="text" id="modal-new-sys-cpf" class="input-field" placeholder="Ex: 111.222.333-44" required>
          </div>
          <div class="input-group">
            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Foto (URL opcional)</label>
            <input type="url" id="modal-new-sys-photo" class="input-field" placeholder="https://...">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="input-group">
            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Endereço</label>
            <input type="text" id="modal-new-sys-address" class="input-field" placeholder="Endereço completo" required>
          </div>
          <div class="input-group">
            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Turno</label>
            <select id="modal-new-sys-shift" class="input-field" required>
               <option value="Manhã">Manhã</option>
               <option value="Tarde">Tarde</option>
               <option value="Noite">Noite</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn-primary" id="btn-modal-add-student-submit">Cadastrar no Sistema</button>
      </form>
    `, () => {
       const select = document.getElementById('modal-new-sys-course');
       const courses = State.db.courses || [];
       courses.forEach(c => {
         const opt = document.createElement('option');
         opt.value = c.id;
         opt.textContent = c.name;
         select.appendChild(opt);
       });

       document.getElementById('modal-add-student-form').addEventListener('submit', (e) => {
         e.preventDefault();
         const newName = document.getElementById('modal-new-sys-name').value.trim();
         const newCourseId = document.getElementById('modal-new-sys-course').value;
         const newCourse = courses.find(c => c.id === newCourseId);
         const newDob = document.getElementById('modal-new-sys-dob').value.trim();
         const newRg = document.getElementById('modal-new-sys-rg').value.trim();
         const newCpf = document.getElementById('modal-new-sys-cpf').value.trim();
         const newAddress = document.getElementById('modal-new-sys-address').value.trim();
         const newShift = document.getElementById('modal-new-sys-shift').value;
         let newPhoto = document.getElementById('modal-new-sys-photo').value.trim();

         if (!newName || !newCourseId) return;

         // Registration pattern: RegYear - CPF last 5 - Course ID
         const regYear = new Date().getFullYear().toString().slice(-2);
         const cpfDigits = newCpf.replace(/\\D/g, '').slice(-5) || Math.floor(10000 + Math.random() * 90000).toString();
         const newReg = `${regYear}-${cpfDigits}-${newCourseId}`;

         const allStudents = State.db.students;
         const newId = "s" + Date.now();
         if (!newPhoto) newPhoto = `https://i.pravatar.cc/150?u=${newId}`;

         const p = State.user;

         allStudents.unshift({
           id: newId,
           name: newName,
           registration: newReg,
           courseId: newCourseId,
           courseName: newCourse?.name || '',
           shift: newShift,
           password: "123",
           dob: newDob,
           rg: newRg,
           cpf: newCpf,
           address: newAddress,
           photo: newPhoto,
           average: 0,
           attendance: 100,
           subjects: [
             { name: p.subject, professor: p.name, grade: 0, attendance: 100, classAverage: 0 }
           ],
           history: []
         });

         State.db.saveStudents(allStudents);
         Notifications.show('Matrículas', `Aluno(a) cadastrado com matrícula ${newReg}`, 'success');
         Modal.close();
         if (State.currentPage === 'dashboard') navigateTo('dashboard');
       });
    });
  });
}
