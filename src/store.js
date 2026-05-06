import initialStudents from './db/db_students.json';
import initialProfessors from './db/db_professors.json';
import initialCourses from './db/db_courses.json';
import initialNotifications from './db/db_notifications.json';
import initialAdmins from './db/db_admins.json';

const DB_VERSION = "15"; // Versão do Banco (mutável para forçar reset no cache dos clientes)

/**
 * INIT: PREENCHIMENTO INICIAL DO BANCO
 * localStorage é um mini-banco de dados que todo navegador possui.
 * Ele guarda "textos" pra sempre (ou até o usuário limpar o cache).
 * Se o 'lyra_db_version' não bater com a constante acima, nós apagamos tudo 
 * e reinjetamos o que está "hard-coded" na pasta "./db/".
 */
if (localStorage.getItem('lyra_db_version') !== DB_VERSION) {
  // localStorage guarda apenas Strings. Então usamos JSON.stringify para transformar nossos JSONs ou Arrays em 'textos'.
  localStorage.setItem('lyra_students', JSON.stringify(initialStudents));
  localStorage.setItem('lyra_professors', JSON.stringify(initialProfessors));
  localStorage.setItem('lyra_courses', JSON.stringify(initialCourses));
  localStorage.setItem('lyra_admins', JSON.stringify(initialAdmins));
  localStorage.setItem('lyra_notifications', JSON.stringify(initialNotifications || []));
  localStorage.setItem('lyra_db_version', DB_VERSION);
}

// --- SISTEMA DE PERSISTÊNCIA (MOCK DB) ---
// Este objeto `db` "finge" ser uma API que vai em um servidor SQL ou Firebase.
// Na realidade, ele só empacota e desempacota coisas para o LocalStorage usando setters/getters.
const db = {
  // O cache impede que o sistema chame JSON.parse (que é uma operação pesada)
  // 300 vezes na tela. Ele lê o localstorage a 1ª vez, salva nessa RAM efêmera (_cache), e só re-puxa se mudarmos.
  _cache: {
    students: null,
    professors: null,
    courses: null,
    admins: null,
    notifications: null
  },

  // Um Get! Toda vez que eu chamo db.students (sem parênteses), essa função invisível roda:
  get students() { 
    if (!this._cache.students) {
      this._cache.students = JSON.parse(localStorage.getItem('lyra_students')) || [];
    }
    return this._cache.students;
  },
  
  get professors() { 
    if (!this._cache.professors) {
      this._cache.professors = JSON.parse(localStorage.getItem('lyra_professors')) || [];
    }
    return this._cache.professors;
  },
  
  get courses() { 
    if (!this._cache.courses) {
      this._cache.courses = JSON.parse(localStorage.getItem('lyra_courses')) || [];
    }
    return this._cache.courses;
  },
  
  get admins() { 
    if (!this._cache.admins) {
      this._cache.admins = JSON.parse(localStorage.getItem('lyra_admins')) || [];
    }
    return this._cache.admins; 
  },
  
  get notifications() { 
    if (!this._cache.notifications) {
      this._cache.notifications = JSON.parse(localStorage.getItem('lyra_notifications')) || [];
    }
    return this._cache.notifications; 
  },
  
  // --- SETTERS: Usados para atirar dados modificados de volta para o Local Storage ---
  saveStudents(data) { 
    this._cache.students = data; // Atualiza a RAM
    localStorage.setItem('lyra_students', JSON.stringify(data)); // Atualiza o HD(Navegador)
  },
  saveProfessors(data) { 
    this._cache.professors = data;
    localStorage.setItem('lyra_professors', JSON.stringify(data)); 
  },
  saveCourses(data) { 
    this._cache.courses = data;
    localStorage.setItem('lyra_courses', JSON.stringify(data)); 
  },
  saveAdmins(data) { 
    this._cache.admins = data;
    localStorage.setItem('lyra_admins', JSON.stringify(data)); 
  },
  saveNotifications(data) { 
    this._cache.notifications = data;
    localStorage.setItem('lyra_notifications', JSON.stringify(data)); 
  },
  
  // ---- Configurações de Identidade Visual e Escola (Guardadas paralelamente) ----
  get customLogo() { return localStorage.getItem('lyra_custom_logo'); },
  saveLogo(url) { localStorage.setItem('lyra_custom_logo', url); },
  get customColor() { return localStorage.getItem('lyra_custom_color'); },
  saveColor(hex) { localStorage.setItem('lyra_custom_color', hex); },
  get themeConfig() { return JSON.parse(localStorage.getItem('lyra_theme_config')) || null; },
  saveThemeConfig(config) { localStorage.setItem('lyra_theme_config', JSON.stringify(config)); },
  get schoolInfo() { return JSON.parse(localStorage.getItem('lyra_school_info')) || { name: 'Escola Lyra', cnpj: '', address: '', phone: '' }; },
  saveSchoolInfo(info) { localStorage.setItem('lyra_school_info', JSON.stringify(info)); }
};

/**
 * ========================================================
 * STATE (ESTADO GLOBAL)
 * Pense no "State" como um quadro branco na sala dos professores.
 * Todo arquivo que precisa de dados do site olha pra esse quadro pra saber o que desenhar.
 * Se o State muda, nossa função de SPA atualiza o visual correspondente.
 * ========================================================
 */
export const State = {
  // Contexto Atual da Sessão:
  user: null, // Guardará Objeto do Usuário logado
  userType: '', // 'student' ou 'teacher' (Dita se posso ver/mudar notas ou não)
  currentPage: '', // 'courses', 'dashboard', etc.
  
  db: db, // Embutindo nosso mock DB acima pra facilitar chamadas (ex: State.db.students)

  /**
   * --- SISTEMA DE CTI (Notificações) ---
   * Injeta um aviso na base global de notificações para um usuário específico.
   */
  addNotification(userId, title, message, type = 'info') {
    const notifs = this.db.notifications;
    notifs.push({
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      userId,
      title,
      message,
      type, // 'info', 'warning', 'success', 'danger'
      date: new Date().toISOString(),
      read: false
    });
    this.db.saveNotifications(notifs);
  },

  getUnreadNotifications(userId) {
    return this.db.notifications.filter(n => n.userId === userId && !n.read);
  },

  getAllUserNotifications(userId) {
    return this.db.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  markNotificationsAsRead(userId) {
    const notifs = this.db.notifications;
    let changed = false;
    notifs.forEach(n => {
      // Modificando objetos dentro de um foreach afeta automaticamente o elemento base (pointers de obj JS)
      if (n.userId === userId && !n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) this.db.saveNotifications(notifs); // Transforma em lida fisicamente
  },

  // Helpers UI DB
  setCustomLogo(url) { this.db.saveLogo(url); },
  getLogo() { return this.db.customLogo || 'https://cdn.brandfetch.io/idZAgjz-AF/w/172/h/40/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1770247213514'; },
  setCustomColor(hex) { this.db.saveColor(hex); },
  getCustomColor() { return this.db.customColor || '#3b82f6'; }, // Azul default
  setThemeConfig(config) { this.db.saveThemeConfig(config); },
  getThemeConfig() { return this.db.themeConfig || {}; },
  setSchoolInfo(info) { this.db.saveSchoolInfo(info); },
  getSchoolInfo() { return this.db.schoolInfo; },

  /**
   * --- SISTEMA DE AUTENTICAÇÃO ---
   * Vasculha 3 Arrays (Admins->Professores->Alunos) tentando achar alguém com esse login e pass.
   */
  login(reg, pass) {
    let foundUser = null;
    let type = '';

    const admin = this.db.admins.find(a => a.id === reg || a.id === reg.toLowerCase());
    if (admin && admin.password === pass) {
      this.user = admin;
      this.userType = 'teacher'; // Admins recebem admin true e tools de teacher
      return true;
    }

    const prof = this.db.professors.find(p => p.id === reg || p.id === reg.toLowerCase());
    if (prof && prof.password === pass) {
      foundUser = prof;
      type = 'teacher';
    } else {
      const stud = this.db.students.find(s => s.registration === reg || s.id === reg);
      if (stud && stud.password === pass) {
        foundUser = stud;
        type = 'student';
      }
    }

    if (foundUser) {
      this.user = foundUser;
      this.userType = type;
      return true;
    }
    return false;
  },

  logout() {
    this.user = null;
    this.userType = '';
    this.currentPage = '';
  },

  refreshUser() {
    if (!this.user) return;
    if (this.userType === 'teacher') {
      if (this.user.isAdmin) return; // Admin é separado
      this.user = this.db.professors.find(p => p.id === this.user.id) || this.user;
    } else {
      this.user = this.db.students.find(s => s.id === this.user.id) || this.user;
    }
  },

  /**
   * --- CRUDs COMPLEXOS (Create Read Update Delete) de Admin ---
   */

  registerProfessor(data) {
    const profs = this.db.professors;
    const isEdit = !!data.id_orig; // Veio id_orig no payload? É alteração via Modal de Edit.
    
    // Atualização
    if (isEdit) {
      const idx = profs.findIndex(p => p.id === data.id_orig);
      if (idx > -1) {
        profs[idx] = { 
          ...profs[idx], 
          name: data.name,
          password: data.password || profs[idx].password,
          subject: data.subject,
          rg: data.rg || profs[idx].rg,
          cpf: data.cpf || profs[idx].cpf
        };
        this.db.saveProfessors(profs);
        return { success: true, message: 'Professor atualizado!' };
      }
    }

    // Criação nova
    const id = data.id || `p${Date.now()}`;
    if (profs.find(p => p.id === id)) return { success: false, message: 'ID já em uso.' };

    profs.push({
      id,
      name: data.name,
      password: data.password || "admin123", // Default brabo se adm não setar
      subject: data.subject,
      rg: data.rg || '',
      cpf: data.cpf || '',
      photo: `https://i.pravatar.cc/150?u=${id}`, // API Legal P/ Foto falsa (random com id)
      notifications: []
    });

    this.db.saveProfessors(profs);
    return { success: true, message: 'Professor cadastrado!' };
  },

  registerAdmin(adminData) {
    const admins = this.db.admins;
    const isEdit = !!adminData.id_orig;

    if (isEdit) {
      const idx = admins.findIndex(a => a.id === adminData.id_orig);
      if (idx > -1) {
        admins[idx] = { 
          ...admins[idx], 
          name: adminData.name,
          password: adminData.password || admins[idx].password
        };
        this.db.saveAdmins(admins);
        return { success: true, message: 'Gestor atualizado!' };
      }
    }

    const id = adminData.id || `adm${Date.now()}`;
    
    if (admins.find(a => a.id === id) || id === 'admin') {
      return { success: false, message: 'ID de admin indisponível.' };
    }

    admins.push({
      id,
      name: adminData.name,
      password: adminData.password || 'admin123',
      isAdmin: true, // FLAG DE PODER SUPERIOR
      photo: `https://i.pravatar.cc/150?u=${id}`
    });

    this.db.saveAdmins(admins);
    return { success: true, message: 'Administrador cadastrado!' };
  },

  registerCourse(data) {
    const courses = this.db.courses;
    const isEdit = !!data.id_orig;

    if (isEdit) {
      const idx = courses.findIndex(c => c.id === data.id_orig);
      if (idx > -1) {
        courses[idx].name = data.name;
        this.db.saveCourses(courses);
        return { success: true, message: 'Curso atualizado!' };
      }
    }

    const id = data.id || `c${Date.now()}`;
    if (courses.find(c => c.id === id)) return { success: false, message: 'Cód já em uso.' };

    courses.push({ id, name: data.name });
    this.db.saveCourses(courses);
    return { success: true, message: 'Curso cadastrado!' };
  },

  registerStudent(data) {
    const students = this.db.students;
    const isEdit = !!data.id_orig;

    if (isEdit) {
      const idx = students.findIndex(s => s.id === data.id_orig);
      if (idx > -1) {
        students[idx] = { 
          ...students[idx], 
          name: data.name,
          courseName: data.courseName,
          shift: data.shift || students[idx].shift,
          password: data.password || students[idx].password
        };
        this.db.saveStudents(students);
        return { success: true, message: 'Aluno atualizado!' };
      }
    }

    const id = data.id || `s${Date.now()}`;
    // Inventando um Register Alphanumerico (RA) de 5 dígitos pra galera. (ex: RA40231)
    const registration = data.registration || `RA${Math.floor(Math.random() * 90000) + 10000}`;

    students.push({
      id,
      name: data.name,
      registration,
      password: data.password || "123",
      courseName: data.courseName,
      shift: data.shift || "Manhã",
      photo: `https://i.pravatar.cc/150?u=${id}`,
      // Quando recém cadastrado, botamos uma graxa genérica no boletim zerada
      subjects: [{ name: data.courseName, professor: 'A definir', grade: 0, attendance: 100, attendanceRecords: [] }],
      attendance: 100,
      average: 0
    });

    this.db.saveStudents(students);
    return { success: true, message: 'Aluno matriculado!' };
  },

  deleteEntity(id, type) {
    switch (type) {
      case 'professor':
        // Filta pra manter todo mundo que seja diferente deste ID... Salva no lugar.
        this.db.saveProfessors(this.db.professors.filter(p => p.id !== id));
        break;
      case 'student':
        this.db.saveStudents(this.db.students.filter(s => s.id !== id));
        break;
      case 'admin':
        if (id === 'admin') return { success: false, message: 'Impossível remover master.' };
        this.db.saveAdmins(this.db.admins.filter(a => a.id !== id));
        break;
      case 'course':
        this.db.saveCourses(this.db.courses.filter(c => c.id !== id));
        break;
    }
    return { success: true, message: 'Excluído!' };
  },

  updateCourse(id, data) {
    return this.registerCourse({ ...data, id_orig: id });
  },

  updateProfessor(id, data) {
    return this.registerProfessor({ ...data, id_orig: id });
  },

  /**
   * --- SISTEMA DE CÁLCULOS EDUCATIVOS ---
   * Responsável por Matemática de Notas e Chamada do Diário Escolar (Atualiza Notas, Faz Medias, Calc %)
   */
  updateGrade(studentId, subjectName, newGrade) {
    const students = this.db.students;
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    // Acha a caixinha "Matemática" na mochila do studante
    const subject = student.subjects.find(sub => sub.name === subjectName);
    if (!subject) return false;

    // Alreta local de var
    subject.grade = parseFloat(newGrade);
    
    // Recalcular média global do aluno de todas as matérias
    const total = student.subjects.reduce((sum, s) => sum + (s.grade || 0), 0);
    student.average = parseFloat((total / student.subjects.length).toFixed(1));

    this.db.saveStudents(students); // Save DB
    return true;
  },

  togglePresence(studentId, subjectName, isPresent) {
    const students = this.db.students;
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    const subject = student.subjects.find(sub => sub.name === subjectName);
    if (!subject) return false;

    // String Crua Ex: "2024-05-18"
    const today = new Date().toISOString().split('T')[0];
    if (!subject.attendanceRecords) subject.attendanceRecords = [];

    const existingIdx = subject.attendanceRecords.findIndex(r => r.date === today);
    if (existingIdx > -1) {
      // Já bateu o ponto na aula de hoje, altera só true por false
      subject.attendanceRecords[existingIdx].present = isPresent;
    } else {
      // Primeira vez hoje! Cria!
      subject.attendanceRecords.push({
        id: Math.random().toString(36).substring(2, 11),
        date: today, // Guardado no db como "2024-05-18" e não em string gigantona local
        present: isPresent,
        status: isPresent ? 'confirmed' : 'pending',
        justification: null // Pedido p/ abono ficara aqui 
      });
    }

    // A PARTIR DO NOVO LOG, CALCULA NOVA FREQUÊNCIA (%) MATÉRIA
    const totalDays = subject.attendanceRecords.length;
    const presenceDays = subject.attendanceRecords.filter(r => r.present).length;
    subject.attendance = totalDays > 0 ? Math.round((presenceDays / totalDays) * 100) : 100;

    // Recalcular Frequência Global 
    const totalAtt = student.subjects.reduce((sum, s) => sum + (s.attendance || 0), 0);
    student.attendance = Math.round(totalAtt / student.subjects.length);

    this.db.saveStudents(students);
    return true;
  }
};
