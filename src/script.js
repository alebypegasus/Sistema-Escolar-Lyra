/**
 * ========================================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT (script.js)
 * Coração da nossa aplicação (Single Page Application - SPA).
 * Aqui configuramos:
 * 1. O carregamento da aplicação 
 * 2. Roteamento de telas (mudar de "página" sem carregar o browser)
 * 3. O sistema de entrada (login e logout)
 * 4. Interações globais e atalhos de teclado (Shortcuts)
 * ========================================================
 */

import { State } from './store.js';
import { renderDashboard, setupDashboardInteractions } from './pages/dashboard.js';
import { renderCourses, setupCourseInteractions } from './pages/courses.js';
import { renderGrades, setupTeacherInteractions, setupStudentInteractions } from './pages/grades.js';
import { renderProfile, setupProfileInteractions } from './pages/profile.js';
import { Notifications } from './notifications.js';
import { Modal, renderActionButtons } from './modal.js';
import { renderStudentDetails, setupStudentDetailsInteractions } from './pages/studentDetails.js';
import { renderAdmin, setupAdminInteractions } from './pages/admin.js';
import { renderPresentation } from './pages/presentation.js';

// Importando nossos Componentes isolados da Interface (Navbar, Header e Footer)
import { getNavbarHTML, setupNavbarInteractions, updateNotificationBadge as updateNavbarBadge } from './components/Navbar/Navbar.js';
import { getMainHTML, setGreeting, switchView } from './components/Main/Main.js';
import { getFooterHTML } from './components/Footer/Footer.js';
import { Skeleton } from './components/Skeleton/Skeleton.js';

import './style.css'; // Carrega nossos novos CSS automáticos

/**
 * Evento Mestre: Ocorre quando todo o código HTML original (index.html) terminou de carregar.
 * Dá o pontapé inicial na aplicação
 */
document.addEventListener('DOMContentLoaded', () => {
  applyBrandColor();
  setupLogin(); // Inicia a escuta da tela de login
  setupGlobalShortcuts(); // Inicia a escuta do teclado (Atalhos)
});

export function applyBrandColor() {
  const color = State.getCustomColor();
  if (color && color !== '#3b82f6') {
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-color', color);
    // Simple way to compute a light version with opacity (not perfect but works in modern browsers)
    document.documentElement.style.setProperty('--accent-light', `${color}25`); 
    document.documentElement.style.setProperty('--accent-hover', `${color}dd`); 
  } else {
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-color');
    document.documentElement.style.removeProperty('--accent-light');
    document.documentElement.style.removeProperty('--accent-hover');
  }

  const themeConfig = State.getThemeConfig();
  const applyIfSet = (key, val) => {
     if (val) document.documentElement.style.setProperty(key, val);
     else document.documentElement.style.removeProperty(key);
  };
  
  applyIfSet('--bg-body', themeConfig.bgBody);
  applyIfSet('--bg-surface', themeConfig.bgSurface);
  applyIfSet('--bg-panel', themeConfig.bgPanel);
  applyIfSet('--text-primary', themeConfig.textPrimary);
  applyIfSet('--text-secondary', themeConfig.textSecondary);
}

/**
 * Função responsável por criar Atahos Inteligentes pelo teclado (Ex: Apertar "Enter" para Logar)
 */
function setupGlobalShortcuts() {
  document.addEventListener('keydown', (e) => {
    // ---- Tela de Login ----
    const loginScreen = document.getElementById('login-screen');
    // Se a tela de login estiver visível na tela
    if (!loginScreen.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault(); // Evita reload ou quebra de fluxo padrão
        const btn = document.querySelector('#login-form button[type="submit"]');
        if (btn) btn.click(); // Imita o clique do rato
      }
      return;
    }

    // ---- Lançamento Répido de Notas ----
    // Facilita a vida do professor em desfocar (blur) as inputs de notas pra atualizar direto.
    if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('grade-input')) {
      e.preventDefault();
      document.activeElement.blur();
      return;
    }

    // ---- Controles de Modais Universais ----
    const globalModal = document.getElementById('global-modal');
    if (globalModal && !globalModal.classList.contains('hidden')) {
      // "Esc" pra fechar tudo rapidamente
      if (e.key === 'Escape') {
        Modal.close();
      } 
      // "Enter" p/ submeter forms dentro do modal (Mas evita se o usuário estiver digitando um textão no textarea)
      else if (e.key === 'Enter') {
        if (document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const confirmBtn = globalModal.querySelector('.btn-primary');
          if (confirmBtn) confirmBtn.click();
        }
      }
      return;
    }

    // ---- Atalhos Livres de Navbar (Alt + Numero) ----
    if (e.altKey) {
      // Ao apertar Alt+1, vai pro dashboard
      if (e.key === '1') { e.preventDefault(); navigateTo('dashboard'); }
      // Ao apertar Alt+2, vai pras disciplinas
      if (e.key === '2') { e.preventDefault(); navigateTo('courses'); }
      // Ao apertar Alt+3, vai para as notas
      if (e.key === '3') { e.preventDefault(); navigateTo('grades'); }
      // Ao apertar Alt+4, vai para conta
      if (e.key === '4') { e.preventDefault(); navigateTo('profile'); }
    }
  });
}

/**
 * LÓGICA DE LOGIN 
 * Verifica os campos inseridos, e se tudo OK, esconde a div do 
 * formulário e mostra o interior do App
 */
function setupLogin() {
  const loginForm = document.getElementById('login-form');
  const loginToggle = document.getElementById('login-toggle');
  const toggleLabelAcademic = document.getElementById('toggle-label-academic');
  const toggleLabelAdmin = document.getElementById('toggle-label-admin');
  let currentMode = 'academic';
  
  if(!loginForm) return;

  const updateLoginUI = () => {
    const btnSubmit = document.getElementById('btn-login-submit');
    const userInput = document.getElementById('login-registration');
    const userLabel = document.getElementById('label-user');
    
    if (currentMode === 'admin') {
      loginToggle.classList.add('admin');
      toggleLabelAdmin.classList.add('active');
      toggleLabelAcademic.classList.remove('active');
      userLabel.textContent = 'Login Administrativo';
      userInput.placeholder = 'Ex: secretaria_01';
      btnSubmit.textContent = 'Acessar Secretaria';
    } else {
      loginToggle.classList.remove('admin');
      toggleLabelAdmin.classList.remove('active');
      toggleLabelAcademic.classList.add('active');
      userLabel.textContent = 'Matrícula / Usuário';
      userInput.placeholder = 'p1 (Prof), 2024-0042 (Aluno)';
      btnSubmit.textContent = 'Acessar Portal Acadêmico';
    }
  };

  if (loginToggle) {
    loginToggle.onclick = () => {
      currentMode = currentMode === 'academic' ? 'admin' : 'academic';
      updateLoginUI();
    };
  }

  // Also allow clicking the labels
  if (toggleLabelAcademic) {
    toggleLabelAcademic.onclick = () => {
      if (currentMode !== 'academic') {
        currentMode = 'academic';
        updateLoginUI();
      }
    };
  }
  if (toggleLabelAdmin) {
    toggleLabelAdmin.onclick = () => {
      if (currentMode !== 'admin') {
        currentMode = 'admin';
        updateLoginUI();
      }
    };
  }

  // Atualiza a logo se houver uma customizada no State
  const loginLogo = document.querySelector('.logo-img-large');
  if (loginLogo) loginLogo.src = State.getLogo();

  // "Escuta" o submit (apertar botão ou pressionar 'enter')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const reg = document.getElementById('login-registration').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const errorMsg = document.getElementById('login-error');
    
    errorMsg.classList.add('hidden');
    
    // Tentativa de login dependente do modo
    let loginSuccess = false;
    
    if (currentMode === 'admin') {
      // Validação específica para Admin
      loginSuccess = State.login(reg, pass) && State.user.isAdmin;
      if (!loginSuccess && State.user) {
        // Se logou mas não é admin, desloga e avisa
        State.logout();
        loginSuccess = false;
      }
    } else {
      // Validação acadêmica (Aluno/Professor)
      loginSuccess = State.login(reg, pass) && !State.user.isAdmin;
      if (!loginSuccess && State.user && State.user.isAdmin) {
         // Se é admin tentando entrar no portal acadêmico, barramos para forçar o fluxo correto
         State.logout();
         loginSuccess = false;
      }
    }

    if (loginSuccess) {
      document.getElementById('login-screen').style.opacity = '0';
      
      setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        
        renderAppStructure();
        navigateTo('dashboard');
        triggerInitialNotifications();
      }, 400); 
    } else {
      errorMsg.classList.remove('hidden');
    }
  });
}

/**
 * MONTADOR E ESTRUTURADOR DA TELA PRINCIPAL DO APLICATIVO
 * Procura por 3 "buracos" no HTML (<div id="*-root">)
 * e injeta dinamicamente todo o código visual (Header, Footer, Navbar).
 */
function renderAppStructure() {
  const navbarRoot = document.getElementById('navbar-root');
  const mainRoot = document.getElementById('main-root');
  const footerRoot = document.getElementById('footer-root');

  navbarRoot.innerHTML = getNavbarHTML(State.user);
  mainRoot.innerHTML = getMainHTML();
  footerRoot.innerHTML = getFooterHTML();

  // Aplica a Logo Customizada em todos os lugares
  const currentLogo = State.getLogo();
  document.querySelectorAll('.logo-img, .logo-img-large, .nav-logo img').forEach(img => {
     img.src = currentLogo;
  });

  setupNavbarInteractions(
    navigateTo,
    performLogout,
    showNotificationHistory
  );
}

/**
 * DESLOGANDO: Destrui tudo visível voltando a tela estaca zero 
 */
function performLogout() {
  // Encerra sessão do store local
  State.logout();
  
  // Esconde o APP
  document.getElementById('app-screen').classList.add('hidden');
  
  // Esconde botões flutuantes caso existam
  const fab = document.getElementById('fab-container');
  if (fab) fab.style.display = 'none';
  
  // Re-mostra o Login
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-screen').style.opacity = '1';
  document.getElementById('login-password').value = '';

  // Limpa o HTML da Navbar, App e Footer para proteger as infos e poupar memória Web
  document.getElementById('navbar-root').innerHTML = '';
  document.getElementById('main-root').innerHTML = '';
  document.getElementById('footer-root').innerHTML = '';
}

/**
 * MARCAÇÕES E NOTIFICAÇÕES
 */
function updateNotificationBadge() {
  if (!State.user) return;
  const unreads = State.getUnreadNotifications(State.user.id);
  const hasUnreads = unreads.length > 0;
  
  // Atualiza usando a função do nosso Componente Navbar
  updateNavbarBadge(hasUnreads);
}

function showNotificationHistory() {
  if (!State.user) return;
  const allNotifs = State.getAllUserNotifications(State.user.id);
  
  let html = `<div class="notification-list">`;
  
  if (allNotifs.length === 0) {
    html += `<p class="notification-empty">Nenhuma notificação no histórico.</p>`;
  } else {
    allNotifs.forEach(n => {
      const typeColor = n.type === 'success' ? 'var(--success-color)' :
                        n.type === 'danger' ? 'var(--danger-color)' :
                        n.type === 'warning' ? 'var(--warning-color)' : 'var(--accent-color)';
                       
      html += `
        <div class="notification-item ${n.read ? 'read' : 'unread'}" style="border-left-color: ${typeColor};">
          <div class="notification-item-header">
            <span class="notification-item-title">
              ${!n.read ? `<span class="notification-dot"></span>` : ''}
              ${n.title}
            </span>
            <span class="notification-item-time">${new Date(n.date).toLocaleString('pt-BR')}</span>
          </div>
          <p class="notification-item-message">${n.message}</p>
        </div>
      `;
    });
  }
  
  html += `</div>`;
  Modal.open('Histórico de Notificações', html);
  
  State.markNotificationsAsRead(State.user.id);
  updateNotificationBadge();
}

/**
 * SISTEMA DE ROTEAMENTO INTERNO (SPA)
 * Com suporte a Skeleton Loading e Transições de mola.
 */
function navigateTo(page) {
  // Proteção de Rota: Apenas administradores acessam Documentação e Admin
  if ((page === 'presentation' || page === 'admin') && !State.user.isAdmin) {
    page = 'dashboard';
  }

  // Com o HTML modular, se a div não existe ainda (ex: antes de renderAppStructure), não execute.
  if(!document.getElementById(`page-${page}`)) return;

  if (State.currentPage === page && document.getElementById(`page-${page}`).innerHTML.trim() !== '') return;
  State.currentPage = page;

  // Atualiza componentes visuais (Navbar, Header Central)
  let subtitle = '';
  if (State.user.isAdmin) {
    subtitle = 'Portal Administrativo • Gestão de Sistemas';
  } else if (page === 'presentation') {
    subtitle = 'Guia do Desenvolvedor • Arquitetura e Código';
  } else {
    subtitle = State.userType === 'student' ? `Matrícula: ${State.user.registration} • ${State.user.courseName || 'Geral'}` : `Professor(a) - ${State.user.subject}`;
  }
  
  setGreeting(State.user.name, subtitle);
  updateNotificationBadge();
  renderActionButtons();

  // Troca a View Exibida (nosso component "Main") com animação de Bezier mola
  switchView(page);

  const container = document.getElementById(`page-${page}`);
  
  // 1. Mostrar o Skeleton primeiro para um feel dinâmico e agradável
  const isTeacher = State.userType === 'teacher';
  if (page === 'dashboard') {
    container.innerHTML = Skeleton.getDashboard(isTeacher);
  } else if (page === 'courses' || page === 'grades') {
    container.innerHTML = isTeacher ? Skeleton.getTableRows(6) : Skeleton.getGridCards(3);
  } else {
    container.innerHTML = `<div class="skeleton-base" style="height: 400px; width: 100%;"></div>`;
  }

  // 2. Pequeno delay "fake" para carregar os dados reais com suavidade
  // Isso garante que o usuário perceba a transição e a organização do layout
  setTimeout(() => {
    // Se o usuário mudou de página durante o delay, pare o processamento
    if (State.currentPage !== page) return;

    // Renderizar Conteúdo Específico Real
    if (page === 'dashboard') {
      renderDashboard(container, State);
      if (isTeacher) setupDashboardInteractions(State, navigateTo);
    }
    else if (page === 'courses') {
      renderCourses(container, State);
      if (isTeacher) setupCourseInteractions(State, navigateTo);
    }
    else if (page === 'grades') {
      renderGrades(container, State);
      if (isTeacher) setupTeacherInteractions(State, navigateTo);
      else setupStudentInteractions(State, navigateTo);
    }
    else if (page === 'profile') {
      renderProfile(container, State);
      setupProfileInteractions(State, navigateTo);
    }
    else if (page === 'student-details') {
      renderStudentDetails(container, State);
      setupStudentDetailsInteractions(State, navigateTo);
    }
    else if (page === 'admin') {
      renderAdmin(container, State);
      setupAdminInteractions(State, navigateTo);
    }
    else if (page === 'presentation') {
      renderPresentation(container);
    }

    // Bind Global para botões de visualizar estudantes (reutilizado em vários locais)
    document.querySelectorAll('.btn-view-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
         const sid = e.currentTarget.dataset.sid;
         window.currentViewStudentId = sid;
         navigateTo('student-details');
      });
    });
  }, 450); // 450ms é o tempo ideal para casar com a animação de entrada com Bezier
}

function triggerInitialNotifications() {
  if (State.userType === 'teacher') {
    const p = State.user;
    const allStudents = State.db.students;
    const lowAttStudents = [];
    
    allStudents.forEach(s => {
      const sub = s.subjects.find(s_sub => s_sub.name === p.subject);
      if (sub && sub.attendance < 75) {
        lowAttStudents.push(s.name);
      }
    });

    if (lowAttStudents.length > 0) {
      lowAttStudents.slice(0, 3).forEach(name => {
        Notifications.show('Alerta de Frequência', `O aluno(a) ${name.split(' ')[0]} está com a frequência abaixo de 75%.`, 'warning');
      });
      if (lowAttStudents.length > 3) {
        Notifications.show('Múltiplos Alertas', `Mais ${lowAttStudents.length - 3} aluno(s) estão com baixa frequência.`, 'warning');
      }
    } else {
      Notifications.show('Tudo Certo', 'Nenhum aluno com frequência crítica no momento.', 'success');
    }
  } else if (State.userType === 'student') {
    Notifications.show('Boletim Atualizado', 'Bem vindo. Lembre-se de checar seu boletim', 'info');
  }
}

export { navigateTo };
