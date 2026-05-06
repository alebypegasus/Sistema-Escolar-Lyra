/**
 * ========================================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT (script.js)
 * Coração da nossa aplicação (Single Page Application - SPA).
 * O objetivo de um SPA é nunca recarregar a página do navegador.
 * Toda vez que o usuário navega, nós apenas apagamos o HTML
 * de uma "div" e injetamos o HTML da próxima tela usando Javascript.
 * ========================================================
 */

// Importa o Estado Global, que funciona como o cérebro que guarda
// quem está logado, as funções do banco de dados (Store) etc.
import { State } from './store.js';

// Importando as diferentes telas (páginas) que compõem o nosso App.
// Cada página exporta: 
// 1. `renderPagina`: Função que gera o HTML da página e joga na tela.
// 2. `setupInteractions`: Função que "acorda" a tela, colocando ações (clicks) nos botões.
import { renderDashboard, setupDashboardInteractions } from './pages/Dashboard/Dashboard.js';
import { renderCourses, setupCourseInteractions } from './pages/Courses/Courses.js';
import { renderGrades, setupTeacherInteractions, setupStudentInteractions } from './pages/Grades/Grades.js';
import { renderProfile, setupProfileInteractions } from './pages/Profile/Profile.js';
import { renderStudentDetails, setupStudentDetailsInteractions } from './pages/StudentDetails/StudentDetails.js';
import { renderAdmin, setupAdminInteractions } from './pages/Admin/Admin.js';
import { renderPresentation } from './pages/Presentation/Presentation.js';

// Importa os Componentes Globais. Coisas que aparecem em quase todas as telas
import { Notifications } from './components/Notification/Notification.js';
import { Modal, renderActionButtons } from './components/Modal/Modal.js';
import { getNavbarHTML, setupNavbarInteractions, updateNotificationBadge as updateNavbarBadge } from './components/Navbar/Navbar.js';
import { getMainHTML, setGreeting, switchView } from './components/Main/Main.js';
import { getFooterHTML } from './components/Footer/Footer.js';
import { Skeleton } from './components/Skeleton/Skeleton.js'; // Skeleton = loading state que imita a tela

// Importa o CSS principal
import './style.css'; 

/**
 * Evento Mestre: `DOMContentLoaded`
 * Isso é disparado pelo navegador assim que ele termina de ler todo o nosso index.html base.
 * É aqui que damos "arranque" ao motor do App.
 */
document.addEventListener('DOMContentLoaded', () => {
  applyBrandColor(); // Injeta a cor da escola nas variáveis CSS (--accent-color)
  setupLogin(); // Ativa os botões form da tela inicial
  setupGlobalShortcuts(); // Ativa truques de teclado (Atalhos)
});

/**
 * Cores da Escola customizáveis.
 * Em um SaaS, precisamos trocar facilmente de cor dependendo de qual escola
 * está acessando. Fazemos isso alterando Variáveis CSS (que estão no index.css)
 * direto usando o Javascript.
 */
export function applyBrandColor() {
  const color = State.getCustomColor(); // Puxa do DB
  
  if (color && color !== '#3b82f6') { // Se houver cor e não for padrão (azul)
    // Document.documentElement = <HTML>
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-light', `${color}25`); // Translucido
    document.documentElement.style.setProperty('--accent-hover', `${color}dd`); 
  } else {
    // Se for o azul padrão, reseta (remover a property faz o CSS voltar pro :root original)
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-color');
    document.documentElement.style.removeProperty('--accent-light');
    document.documentElement.style.removeProperty('--accent-hover');
  }

  // Se houver config de dark/light vinda do admin...
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
 * Função responsável por criar Atahos Inteligentes pelo teclado (Acessibilidade + Produtividade)
 */
function setupGlobalShortcuts() {
  // 'keydown' detecta sempre que uma tecla "bater no fundo", melhor que keypress ou keyup pra isso.
  document.addEventListener('keydown', (e) => {
    
    // ---- Tela de Login ----
    const loginScreen = document.getElementById('login-screen');
    // Se a tela de login não tem a classe 'hidden', ela está sendo exibida.
    if (!loginScreen.classList.contains('hidden')) {
      if (e.key === 'Enter') { // Pressionou ENTER?
        e.preventDefault(); // Evita reload ou quebra de fluxo (pra não enviar GET pro html)
        const btn = document.querySelector('#login-form button[type="submit"]'); 
        if (btn) btn.click(); // Imita um click físico do rato para invocar o setupLogin()
      }
      return; // "Para" o código aqui (ninguém além da tela de login nos importa se ela tá visível)
    }

    // ---- Produtividade de Professores ----
    // Permite lançar nota na input com "Enter" e já "tirar o foco" (gravar a nota).
    if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('grade-input')) {
      e.preventDefault();
      document.activeElement.blur(); // focus = clicar dentro // blur = clicar fora
      return;
    }

    // ---- Controles de Modais Universais ----
    const globalModal = document.getElementById('global-modal');
    if (globalModal && !globalModal.classList.contains('hidden')) {
      // "Esc" para fechar a janelinha modal rapidamente
      if (e.key === 'Escape') {
        Modal.close();
      } 
      // "Enter" p/ submeter forms dentro do modal.
      else if (e.key === 'Enter') {
        // ...Mas não queremos fechar o modal se o usuário estiver digitando um textão multilinhas no textarea!
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
      if (e.key === '1') { e.preventDefault(); navigateTo('dashboard'); }
      if (e.key === '2') { e.preventDefault(); navigateTo('courses'); }
      if (e.key === '3') { e.preventDefault(); navigateTo('grades'); }
      if (e.key === '4') { e.preventDefault(); navigateTo('profile'); }
    }
  });
}

// O setupLogin isolado virou um module lá no /pages/Login
import { setupLogin } from './pages/Login/Login.js';

/**
 * ESTRUTURADOR DA TELA PRINCIPAL (APP SHELL)
 * Chamada DEPOIS que o usuário faz Login e a senha bate (loginSuccess == true).
 * Monta o Header, Nav, Main e Footer nos "Buracos" existentes lá no index.html.
 */
function renderAppStructure() {
  const navbarRoot = document.getElementById('navbar-root'); // Barra Sup/Lateral
  const mainRoot = document.getElementById('main-root'); // O "meião"
  const footerRoot = document.getElementById('footer-root'); // O rodapé

  // Pede os componentes que montem suas strings HTML
  navbarRoot.innerHTML = getNavbarHTML(State.user);
  mainRoot.innerHTML = getMainHTML();
  footerRoot.innerHTML = getFooterHTML();

  // Garante que todo lugar que deveria ter a logo, pega a logo certa do Banco.
  const currentLogo = State.getLogo();
  document.querySelectorAll('.logo-img, .logo-img-large, .nav-logo img').forEach(img => {
     img.src = currentLogo;
  });

  // Dá "vida" a Navbar (Clicks para abrir menu celular, Logout, etc)
  setupNavbarInteractions(
    navigateTo,          // Passamos o navigateTo para a Navbar conseguir mudar de tela
    performLogout,       // Passamos o performLogout pro menu do usuário
    showNotificationHistory // Função do sininho
  );
}

/**
 * DESLOGANDO
 * Faz a ação contrária. Limpa state, amassa as telas, e reacende a Input de Login.
 */
function performLogout() {
  State.logout(); // State joga o "user: null"
  
  // O app-screen esconde tudo que envolve o "logado".
  document.getElementById('app-screen').classList.add('hidden');
  
  // Esconde Floating Action Buttons "Mais (+)"
  const fab = document.getElementById('fab-container');
  if (fab) fab.style.display = 'none';
  
  // Traz a tela preta de volta com opacidade e limpa o campo de senha.
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-screen').style.opacity = '1';
  document.getElementById('login-password').value = '';

  // Limpa o App Shell da memória para ninguém xeretar o HTML depois do logoff.
  document.getElementById('navbar-root').innerHTML = '';
  document.getElementById('main-root').innerHTML = '';
  document.getElementById('footer-root').innerHTML = '';
}

/**
 * Pinta de vermelho a "bolinha" no sininho lá no canto superior direito
 * caso haja notificações não lidas!
 */
function updateNotificationBadge() {
  if (!State.user) return; // Tem que tá logado
  
  // Pegamos a Array com isRead == false do usuário
  const unreads = State.getUnreadNotifications(State.user.id);
  const hasUnreads = unreads.length > 0;
  
  // Dispara pro componente visual processar a bolinha vermelha.
  updateNavbarBadge(hasUnreads);
}

/**
 * Mostra uma Modal com a lista inteira de Avisos/Alertas daquele aluno/adm
 */
function showNotificationHistory() {
  if (!State.user) return;
  const allNotifs = State.getAllUserNotifications(State.user.id);
  
  // Concatenador de String HTML
  let html = `<div class="notification-list">`;
  
  if (allNotifs.length === 0) {
    html += `<p class="notification-empty">Nenhuma notificação no histórico.</p>`;
  } else {
    // Para cada Notificação(n) monta o bloco..
    allNotifs.forEach(n => {
      const typeColor = n.type === 'success' ? 'var(--success-color)' :
                        n.type === 'danger' ? 'var(--danger-color)' :
                        n.type === 'warning' ? 'var(--warning-color)' : 'var(--accent-color)';
                       
      html += `
        <div class="notification-item ${n.read ? 'read' : 'unread'}" style="border-left-color: ${typeColor};">
          <div class="notification-item-header">
            <span class="notification-item-title">
               <!-- Dot = Bolinha vermelha pra avisar que é Não Lida -->
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
  Modal.open('Histórico de Notificações', html); // Taca na cara.
  
  // Como ele abriu, eu chamo a função que tira a marcação "Nao Lida" de todas e recarrego a badgetzinha.
  State.markNotificationsAsRead(State.user.id);
  updateNotificationBadge();
}

/**
 * SISTEMA DE ROTEAMENTO (MUDAR DE TELAS)
 * Toda vez que você navega pra algum lugar, essa função de SPA dita as regras.
 * Ele mata o recheio do "Main" e coloca outro sem o browser dar *reload*.
 */
function navigateTo(page, force = false) {
  // Proteção de Rota (Guard): Impede estudantes xeretas de digitar javascript pra forçar rota.
  if ((page === 'presentation' || page === 'admin') && !State.user.isAdmin) {
    page = 'dashboard';
  }

  // Verifica se o container Main ainda existe
  if(!document.getElementById(`page-${page}`)) return;

  // Se já estou nela, ignoro... a não ser que eu te obrigue com "force = true". 
  if (State.currentPage === page && document.getElementById(`page-${page}`).innerHTML.trim() !== '' && !force) return;
  State.currentPage = page;

  // Atualiza o subtítulo no topo
  let subtitle = '';
  if (State.user.isAdmin) {
    subtitle = 'Portal Administrativo • Gestão de Sistemas';
  } else if (page === 'presentation') {
    subtitle = 'Guia do Desenvolvedor • Arquitetura e Código';
  } else {
    // Aluno mostra Nome do curso, Professor mostra Matéria
    subtitle = State.userType === 'student' ? `Matrícula: ${State.user.registration} • ${State.user.courseName || 'Geral'}` : `Professor(a) - ${State.user.subject}`;
  }
  
  setGreeting(State.user.name, subtitle);
  updateNotificationBadge();
  renderActionButtons(); // FAB Actions floating button config

  // Switchview (No Main.js) lida com fazer a Animação bonitinha das telas entrarem e sairem
  switchView(page);

  const container = document.getElementById(`page-${page}`);
  
  // 1. Mostrar SKELETON! O que é skeleton?
  // O app é local então ele instantaneamente carregaria a array de objetos JSON...
  // Mas vamos simular que estamos puxando isso de um banco LENTO da nuvem.
  const isTeacher = State.userType === 'teacher';
  if (page === 'dashboard') {
    container.innerHTML = Skeleton.getDashboard(isTeacher);
  } else if (page === 'courses' || page === 'grades') {
    container.innerHTML = isTeacher ? Skeleton.getTableRows(6) : Skeleton.getGridCards(3);
  } else {
    container.innerHTML = `<div class="skeleton-base" style="height: 400px; width: 100%;"></div>`;
  }

  // 2. SetTimeout de 450 milesegundos depois....
  // A animação de molinha acabou e vamos tacar o conteúdo VERDADEIRO na tela com os Dados!
  setTimeout(() => {
    // Prevenção se o maluco apertar em 3 páginas no mesmo tempo, o timeout só vai agir na última 
    if (State.currentPage !== page) return;

    // Chama o Renderer correspondente com a Tela.
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
      // Aqui os alunos interagem de forma diferente de um teacher na mesma view, por isso dividimos!
      if (isTeacher) setupTeacherInteractions(State, navigateTo);
      else setupStudentInteractions(State, navigateTo);
    }
    else if (page === 'profile') {
      renderProfile(container, State);
      setupProfileInteractions(State, navigateTo);
    }
    else if (page === 'student-details') {
      // Página do boletim invisível no menu
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

    // Regra Global Especial:
    // Diversas telas vão gerar "Aquele botão que dá pra abrir o portfólio de um Estudante por cima".
    // Quando qualquer tela cospe um ".btn-view-student", isso aqui binda o clique a todos eles de forma central.
    document.querySelectorAll('.btn-view-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
         // Nós salvamos no dataset do DOM o UID dele ex: "dataset.sid" ou `data-sid="X"`
         const sid = e.currentTarget.dataset.sid; 
         window.currentViewStudentId = sid; // Salva para o componente filho resgatar quando mountar!
         navigateTo('student-details'); // Muda SPA router
      });
    });
  }, 450);
}

/**
 * Ao logar atirar Toast (Pop-ups curtos com bordazinha colorida na Direita) 
 * caso tenhamos alunos fudidos ou nota baixa
 */
function triggerInitialNotifications() {
  if (State.userType === 'teacher') {
    const p = State.user;
    const allStudents = State.db.students;
    const lowAttStudents = [];
    
    // Varre minha DB Mock interira
    allStudents.forEach(s => {
      // Procurando na mochila deles se tem minha aula e se é a minha materia
      const sub = s.subjects.find(s_sub => s_sub.name === p.subject);
      // Abaixo de 75% reprova!
      if (sub && sub.attendance < 75) {
        lowAttStudents.push(s.name);
      }
    });

    if (lowAttStudents.length > 0) {
      // Se tiver mais que três fudeu muito vou truncar com slice
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

// O que vaza desse arquivo pros outros é essa destruturação
export { navigateTo, renderAppStructure, triggerInitialNotifications };

