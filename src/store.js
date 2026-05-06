import initialStudents from './db/db_students.json';
import initialProfessors from './db/db_professors.json';
import initialCourses from './db/db_courses.json';
import initialNotifications from './db/db_notifications.json';
import initialAdmins from './db/db_admins.json';

const DB_VERSION = "15";

// Initialize DB into LocalStorage
if (localStorage.getItem('lyra_db_version') !== DB_VERSION) {
  localStorage.setItem('lyra_students', JSON.stringify(initialStudents));
  localStorage.setItem('lyra_professors', JSON.stringify(initialProfessors));
  localStorage.setItem('lyra_courses', JSON.stringify(initialCourses));
  localStorage.setItem('lyra_admins', JSON.stringify(initialAdmins));
  localStorage.setItem('lyra_notifications', JSON.stringify(initialNotifications || []));
  localStorage.setItem('lyra_db_version', DB_VERSION);
}

// --- SISTEMA DE PERSISTÊNCIA (MOCK DB) ---
// Este objeto db abstrai o acesso ao localStorage, simulando um banco de dados NoSQL.
// Utilizamos getters e setters para garantir que os dados estejam sempre sincronizados com o navegador.
const db = {
  // Cache em memória para reduzir latência e processamento de JSON.parse
  _cache: {
    students: null,
    professors: null,
    courses: null,
    admins: null,
    notifications: null
  },

  // Retorna a lista de estudantes. Se não existir, retorna um array vazio.
  get students() { 
    if (!this._cache.students) {
      this._cache.students = JSON.parse(localStorage.getItem('lyra_students')) || [];
    }
    return this._cache.students;
  },
  
  // Retorna a lista de professores.
  get professors() { 
    if (!this._cache.professors) {
      this._cache.professors = JSON.parse(localStorage.getItem('lyra_professors')) || [];
    }
    return this._cache.professors;
  },
  
  // Retorna a lista de cursos/módulos cadastrados.
  get courses() { 
    if (!this._cache.courses) {
      this._cache.courses = JSON.parse(localStorage.getItem('lyra_courses')) || [];
    }
    return this._cache.courses;
  },
  
  // Retorna a lista de administradores da secretaria.
  get admins() { 
    if (!this._cache.admins) {
      this._cache.admins = JSON.parse(localStorage.getItem('lyra_admins')) || [];
    }
    return this._cache.admins; 
  },
  
  // Retorna o histórico global de notificações.
  get notifications() { 
    if (!this._cache.notifications) {
      this._cache.notifications = JSON.parse(localStorage.getItem('lyra_notifications')) || [];
    }
    return this._cache.notifications; 
  },
  
  // Métodos de salvamento (Persistência)
  saveStudents(data) { 
    this._cache.students = data;
    localStorage.setItem('lyra_students', JSON.stringify(data)); 
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
  
  // Identidade Visual
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

  setCustomColor(hex) {
    this.db.saveColor(hex);
  },

  getCustomColor() {
    return this.db.customColor || '#3b82f6';
  },

  setThemeConfig(config) {
    this.db.saveThemeConfig(config);
  },

  getThemeConfig() {
    return this.db.themeConfig || {};
  },

  setSchoolInfo(info) {
    this.db.saveSchoolInfo(info);
  },

  getSchoolInfo() {
    return this.db.schoolInfo;
  },

  login(reg, pass) {
    let foundUser = null;
    let type = '';

    const admin = this.db.admins.find(a => a.id === reg || a.id === reg.toLowerCase());
    if (admin && admin.password === pass) {
      this.user = admin;
      this.userType = 'teacher'; // Admins use teacher interface/capabilities for some things but check isAdmin
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

  registerProfessor(data) {
    const profs = this.db.professors;
    const isEdit = !!data.id_orig;
    
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

    const id = data.id || `p${Date.now()}`;
    if (profs.find(p => p.id === id)) return { success: false, message: 'ID já em uso.' };

    profs.push({
      id,
      name: data.name,
      password: data.password || "admin123",
      subject: data.subject,
      rg: data.rg || '',
      cpf: data.cpf || '',
      photo: `https://i.pravatar.cc/150?u=${id}`,
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
      isAdmin: true,
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
    const registration = data.registration || `RA${Math.floor(Math.random() * 90000) + 10000}`;

    students.push({
      id,
      name: data.name,
      registration,
      password: data.password || "123",
      courseName: data.courseName,
      shift: data.shift || "Manhã",
      photo: `https://i.pravatar.cc/150?u=${id}`,
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

  updateGrade(studentId, subjectName, newGrade) {
    const students = this.db.students;
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    const subject = student.subjects.find(sub => sub.name === subjectName);
    if (!subject) return false;

    subject.grade = parseFloat(newGrade);
    
    // Recalcular média global do aluno
    const total = student.subjects.reduce((sum, s) => sum + (s.grade || 0), 0);
    student.average = parseFloat((total / student.subjects.length).toFixed(1));

    this.db.saveStudents(students);
    return true;
  },

  togglePresence(studentId, subjectName, isPresent) {
    const students = this.db.students;
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    const subject = student.subjects.find(sub => sub.name === subjectName);
    if (!subject) return false;

    const today = new Date().toISOString().split('T')[0];
    if (!subject.attendanceRecords) subject.attendanceRecords = [];

    const existingIdx = subject.attendanceRecords.findIndex(r => r.date === today);
    if (existingIdx > -1) {
      subject.attendanceRecords[existingIdx].present = isPresent;
    } else {
      subject.attendanceRecords.push({
        id: Math.random().toString(36).substring(2, 11),
        date: today,
        present: isPresent,
        status: isPresent ? 'confirmed' : 'pending',
        justification: null
      });
    }

    // Recalcular frequência do aluno (%)
    const totalDays = subject.attendanceRecords.length;
    const presenceDays = subject.attendanceRecords.filter(r => r.present).length;
    subject.attendance = totalDays > 0 ? Math.round((presenceDays / totalDays) * 100) : 100;

    // Recalcular frequência global
    const totalAtt = student.subjects.reduce((sum, s) => sum + (s.attendance || 0), 0);
    student.attendance = Math.round(totalAtt / student.subjects.length);

    this.db.saveStudents(students);
    return true;
  }
};
