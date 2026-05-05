import initialStudents from './db_students.json';
import initialProfessors from './db_professors.json';
import initialCourses from './db_courses.json';
import initialNotifications from './db_notifications.json';

const DB_VERSION = "14";

// Initialize DB into LocalStorage
if (localStorage.getItem('lyra_db_version') !== DB_VERSION) {
  localStorage.setItem('lyra_students', JSON.stringify(initialStudents));
  localStorage.setItem('lyra_professors', JSON.stringify(initialProfessors));
  localStorage.setItem('lyra_courses', JSON.stringify(initialCourses));
  localStorage.setItem('lyra_notifications', JSON.stringify(initialNotifications || []));
  localStorage.setItem('lyra_db_version', DB_VERSION);
}

// --- SISTEMA DE PERSISTÊNCIA (MOCK DB) ---
// Este objeto db abstrai o acesso ao localStorage, simulando um banco de dados NoSQL.
// Utilizamos getters e setters para garantir que os dados estejam sempre sincronizados com o navegador.
const db = {
  // Retorna a lista de estudantes. Se não existir, retorna um array vazio.
  get students() { return JSON.parse(localStorage.getItem('lyra_students')) || []; },
  
  // Retorna a lista de professores.
  get professors() { return JSON.parse(localStorage.getItem('lyra_professors')) || []; },
  
  // Retorna a lista de cursos/módulos cadastrados.
  get courses() { return JSON.parse(localStorage.getItem('lyra_courses')) || []; },
  
  // Retorna a lista de administradores da secretaria.
  get admins() { return JSON.parse(localStorage.getItem('lyra_admins')) || []; },
  
  // Retorna o histórico global de notificações.
  get notifications() { return JSON.parse(localStorage.getItem('lyra_notifications')) || []; },
  
  // Métodos de salvamento (Persistência)
  saveStudents(data) { localStorage.setItem('lyra_students', JSON.stringify(data)); },
  saveProfessors(data) { localStorage.setItem('lyra_professors', JSON.stringify(data)); },
  saveCourses(data) { localStorage.setItem('lyra_courses', JSON.stringify(data)); },
  saveAdmins(data) { localStorage.setItem('lyra_admins', JSON.stringify(data)); },
  saveNotifications(data) { localStorage.setItem('lyra_notifications', JSON.stringify(data)); },
  
  // Identidade Visual
  get customLogo() { return localStorage.getItem('lyra_custom_logo'); },
  saveLogo(url) { localStorage.setItem('lyra_custom_logo', url); }
};

/**
 * OBJETO GLOBAL DE ESTADO (ENGINE)
 * Gerencia toda a lógica de negócio, autenticação e mutações de dados da aplicação.
 */
export const State = {
  user: null, // Usuário logado no momento
  userType: '', // Tipo de acesso: 'student' | 'teacher' (admins também entram como teacher para ver interface docente)
  currentPage: '',
  db: db,

  /**
   * Envia uma notificação para um usuário específico.
   */
  addNotification(userId, title, message, type = 'info') {
    const notifs = this.db.notifications;
    notifs.push({
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      userId,
      title,
      message,
      type,
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
      if (n.userId === userId && !n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) this.db.saveNotifications(notifs);
  },

  setCustomLogo(url) {
    this.db.saveLogo(url);
  },

  getLogo() {
    return this.db.customLogo || 'https://cdn.brandfetch.io/idZAgjz-AF/w/172/h/40/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1770247213514';
  },

  login(reg, pass) {
    let foundUser = null;
    let type = '';

    // Admin backdoor para quando o banco estiver zerado
    if (reg === 'admin' && pass === 'admin') {
      this.user = {
        id: 'admin',
        name: 'Administrador do Sistema',
        subject: 'Geral',
        password: 'admin',
        isAdmin: true,
        photo: 'https://cdn-icons-png.flaticon.com/512/9706/9706593.png'
      };
      this.userType = 'teacher'; 
      return true;
    }

    const admin = this.db.admins.find(a => a.id === reg || a.id === reg.toLowerCase());
    if (admin && admin.password === pass) {
      this.user = admin;
      this.userType = 'teacher';
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
      if (this.user.isAdmin) return; // Admin is virtual
      this.user = this.db.professors.find(p => p.id === this.user.id) || this.user;
    } else {
      this.user = this.db.students.find(s => s.id === this.user.id) || this.user;
    }
  },

  registerProfessor(profData) {
    const profs = this.db.professors;
    // Simple ID generation if not provided
    if (!profData.id) {
      profData.id = 'p' + (profs.length + 1);
    }
    
    // Check if ID already exists
    if (profs.find(p => p.id === profData.id)) {
      return { success: false, message: 'ID já existente.' };
    }

    profs.push({
      id: profData.id,
      name: profData.name || 'Novo Professor',
      role: profData.role || 'Professor Titular',
      subject: profData.subject || 'Indefinida',
      courses: profData.courses || [],
      password: profData.password || '123',
      dob: profData.dob || '',
      rg: profData.rg || '',
      cpf: profData.cpf || '',
      phone: profData.phone || '',
      address: profData.address || '',
      photo: profData.photo || `https://i.pravatar.cc/150?u=${profData.id}`,
      additionalInfo: profData.additionalInfo || ''
    });

    this.db.saveProfessors(profs);
    return { success: true, message: 'Professor cadastrado com sucesso!' };
  },

  registerAdmin(adminData) {
    const admins = this.db.admins;
    if (!adminData.id) {
      adminData.id = 'adm' + (admins.length + 1);
    }
    
    if (admins.find(a => a.id === adminData.id) || adminData.id === 'admin') {
      return { success: false, message: 'ID de admin já existente.' };
    }

    admins.push({
      id: adminData.id,
      name: adminData.name || 'Novo Admin',
      password: adminData.password || 'admin123',
      isAdmin: true,
      photo: adminData.photo || `https://i.pravatar.cc/150?u=${adminData.id}`,
      subject: 'Administração'
    });

    this.db.saveAdmins(admins);
    return { success: true, message: 'Usuário administrador cadastrado!' };
  },

  registerCourse(courseData) {
    const courses = this.db.courses;
    if (!courseData.id) {
      courseData.id = 'C' + (courses.length + 101);
    }
    
    if (courses.find(c => c.id === courseData.id)) {
      return { success: false, message: 'ID de módulo já existente.' };
    }

    courses.push({
      id: courseData.id,
      name: courseData.name || 'Novo Módulo'
    });

    this.db.saveCourses(courses);
    return { success: true, message: 'Módulo cadastrado com sucesso!' };
  },

  updateGrade(studentId, subjectName, newGrade) {
    const allStudents = this.db.students;
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return false;

    const subject = student.subjects.find(sub => sub.name === subjectName);
    if (subject) {
      subject.grade = parseFloat(newGrade);
      const total = student.subjects.reduce((acc, sub) => acc + sub.grade, 0);
      student.average = parseFloat((total / student.subjects.length).toFixed(1));
      this.db.saveStudents(allStudents);
      this.refreshUser(); // Updates active user info if needed
      return true;
    }
    return false;
  },

  /**
   * Atualiza a presença de um aluno em tempo real.
   */
  togglePresence(studentId, subjectName, isPresent = undefined) {
    const allStudents = this.db.students;
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return false;

    const subject = student.subjects.find(sub => sub.name === subjectName);
    if (subject) {
      const today = new Date().toISOString().split('T')[0];
      if (!subject.attendanceRecords) subject.attendanceRecords = [];
      const recordIndex = subject.attendanceRecords.findIndex(r => r.date === today);

      let newStatus = isPresent;
      if (isPresent === undefined) { 
        newStatus = recordIndex > -1 ? !subject.attendanceRecords[recordIndex].present : false;
      }
      
      if (recordIndex > -1) {
        subject.attendanceRecords[recordIndex].present = newStatus;
      } else {
        subject.attendanceRecords.push({
          id: Date.now().toString(),
          date: today,
          present: newStatus,
          status: 'pending'
        });
      }

      const absences = subject.attendanceRecords.filter(r => !r.present).length;
      subject.attendance = Math.max(0, 100 - (absences * 5));

      const attAvg = Math.floor(student.subjects.reduce((acc, sub) => acc + sub.attendance, 0) / student.subjects.length);
      student.attendance = attAvg;
      
      this.db.saveStudents(allStudents);
      this.refreshUser();
      return true;
    }
    return false;
  },

  // --- MÉTODOS ADMINISTRATIVOS ---

  /**
   * Atualiza dados de um professor existente.
   */
  updateProfessor(id, data) {
    const profs = this.db.professors;
    const idx = profs.findIndex(p => p.id === id);
    if (idx > -1) {
      profs[idx] = { 
        ...profs[idx], 
        ...data,
        id: profs[idx].id // Previne mudança acidental de ID
      };
      this.db.saveProfessors(profs);
      return { success: true, message: 'Prontuário do docente atualizado!' };
    }
    return { success: false, message: 'Professor não encontrado.' };
  },

  /**
   * Remove qualquer registro do sistema com confirmação de tipo.
   */
  deleteEntity(id, type) {
    switch (type) {
      case 'professor':
        const profs = this.db.professors.filter(p => p.id !== id);
        this.db.saveProfessors(profs);
        break;
      case 'student':
        const studs = this.db.students.filter(s => s.id !== id);
        this.db.saveStudents(studs);
        break;
      case 'admin':
        if (id === 'admin') return { success: false, message: 'O admin principal não pode ser removido.' };
        const adms = this.db.admins.filter(a => a.id !== id);
        this.db.saveAdmins(adms);
        break;
      case 'course':
        // Antes de remover curso, seria ideal avisar que alunos ficarão órfãos de curso
        const courses = this.db.courses.filter(c => c.id !== id);
        this.db.saveCourses(courses);
        break;
    }
    return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1)} removido com sucesso.` };
  },

  /**
   * Registra ou Atualiza um Estudante.
   */
  registerStudent(studentData) {
    const students = this.db.students;
    const isEdit = !!studentData.id_orig;
    
    const student = {
      id: studentData.id || `s${Date.now()}`,
      name: studentData.name,
      registration: studentData.registration || `RA${Math.floor(Math.random() * 90000) + 10000}`,
      password: studentData.password || "123",
      photo: studentData.photo || `https://i.pravatar.cc/150?u=${studentData.name}`,
      courseName: studentData.courseName || "Novo Aluno",
      shift: studentData.shift || "Manhã",
      courses: [], // IDs de matérias cursadas
      subjects: [], // Objetos de notas/presenças
      history: [],
      attendance: 100,
      average: 0,
      notifications: []
    };

    if (isEdit) {
      const idx = students.findIndex(s => s.id === studentData.id_orig);
      if (idx > -1) {
        // Mantém dados sensíveis de histórico se existirem
        const existing = students[idx];
        students[idx] = { 
          ...existing, 
          name: studentData.name,
          courseName: studentData.courseName,
          shift: studentData.shift || existing.shift,
          password: studentData.password || existing.password,
          registration: studentData.registration || existing.registration
        };
        this.db.saveStudents(students);
        return { success: true, message: 'Cadastro do aluno atualizado!' };
      }
    }

    if (students.find(s => s.id === student.id)) return { success: false, message: 'ID já em uso.' };
    
    // Inicialização básica de sujeitos baseada no curso
    const course = this.db.courses.find(c => c.name === student.courseName);
    if (course) {
       // Se o curso exists, poderíamos vincular matérias aqui se houvesse uma estrutura mais complexa.
       // Por enquanto, apenas inicializamos um array vazio ou com uma disciplina padrão.
       student.subjects = [
         { name: course.name, professor: "A definir", grade: 0, attendance: 100, attendanceRecords: [] }
       ];
    }
    
    students.push(student);
    this.db.saveStudents(students);
    return { success: true, message: 'Aluno matriculado com sucesso!' };
  },

  /**
   * Atualiza um Cursos de forma genérica.
   */
  updateCourse(id, data) {
    const courses = this.db.courses;
    const idx = courses.findIndex(c => c.id === id);
    if (idx > -1) {
      courses[idx] = { ...courses[idx], ...data };
      this.db.saveCourses(courses);
      return true;
    }
    return false;
  },
};
