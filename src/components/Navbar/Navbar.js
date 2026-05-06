/**
 * ========================================================
 * NAVBAR - JAVASCRIPT
 * Controla os eventos da barra de navegação (topo) e da 
 * barra de navegação inferior (mobile).
 * Esta barra usa o conceito de "Liquid Glass" com propriedades
 * CSS backdrop-filter no Navbar.css.
 * ========================================================
 */

// Importa o CSS associado automaticamente (Vite lida com isso)
// Isso injeta o estilo Navbar.css no HTML da página.
import './Navbar.css';
import { State } from '../../store.js';

import { ToggleSwitch } from '../ToggleSwitch/ToggleSwitch.js';

/**
 * Função que renderiza a Navbar no container especificado.
 * Retorna uma string HTML literal.
 * O HTML devolve duas partes: a Top-bar (para desktop e logo) e
 * a Bottom-bar (Apenas mostrada no celular, controlada por CSS).
 */
export function getNavbarHTML(user) {
  // Controle de Permissão (Role-Based Access Control). 
  // Somente a cordenação tem "isAdmin" cravado na base (Mock/Array Local).
  const isAdmin = user && user.isAdmin;
  
  // Ícones do modo Dark/Light via Componentização Externa (Lucide Icons).
  // Eles são passados para o Componente <ToggleSwitch /> 
  const sunIcon = `<svg id="theme-icon-sun" class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonIcon = `<svg id="theme-icon-moon" class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  return `
    <!-- Barra Superior (Top Navbar) -->
    <header class="navbar-wrapper">
      <div class="navbar-content">
        <!-- Logo Isolado: Puxa dinamicamente a Logo guardada no Store Global! -->
        <div class="navbar-brand flex-row flex-align-center gap-12">
          <img src="${State.getLogo()}" alt="Logo" style="max-height: 48px; width: auto; object-fit: contain; display: block;" />
        </div>

        <!-- Links Centro (Apenas Desktop - escondido no celular via CSS Media Query) -->
        <nav class="navbar-nav">
          <button class="nav-btn active" data-nav="dashboard">Visão Geral</button>
          <button class="nav-btn" data-nav="courses">Disciplinas</button>
          <button class="nav-btn" data-nav="grades">Desempenho</button>
          
          <!-- Condicional IF in-line usando Ternário javascript -->
          <!-- O administrador possui rotas especiais escondidas de pessoas mortais -->
          ${isAdmin ? `<button class="nav-btn" data-nav="presentation">Documentação</button>` : ''}
          ${isAdmin ? `<button class="nav-btn" data-nav="admin">Administração</button>` : ''}
          <button class="nav-btn" data-nav="profile">Minha Conta</button>
        </nav>

        <!-- Ações da Direita (Tema, Data/Hora, Sino de Notificações e Botão Sair) -->
        <div class="navbar-actions flex-align-center gap-16">
          
          <!-- Theme Toggle Switch (Chama Arquivo Separado e Injeta string no CSS local) -->
          ${ToggleSwitch({ id: 'checkbox', onIcon: sunIcon, offIcon: moonIcon })}

          <!-- Live Clock - Relógio ao vivo atualizado via Javascript Intervalo a cada 1 segundo -->
          <div id="system-live-clock" class="text-xs text-secondary font-mono bg-panel px-12 py-4 border-radius-pill hide-on-mobile border"></div>
          
          <!-- Sino de Alerta de Faltas/Recados -> data-nav faria router, mas vamos usar modal no btn-notifications -->
          <button id="btn-notifications" class="action-btn" title="Notificações">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <!-- Badge (Bolota Vermelha) para indicar nova notificação -->
            <span id="notif-badge-indicator" class="notif-badge" style="display:none;"></span>
          </button>
          
          <!-- Logout = Limpar LocalStorage e Jogar na Tela de Login p/ Longe -->
          <button id="btn-logout" class="logout-btn">Sair</button>
        </div>
      </div>
    </header>

    <!-- Barra Inferior (Bottom Navigation) - Oculta no Desktop, visível no Mobile -->
    <!-- Copia a Matriz de Botões la em cima de uma forma Otimizada pro Celular -->
    <div class="navbar-mobile-bottom">
      <button class="nav-btn-mobile active" data-nav="dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Início
      </button>
      <button class="nav-btn-mobile" data-nav="courses">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        Cursos
      </button>
      <button class="nav-btn-mobile" data-nav="grades">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        Notas
      </button>
      ${isAdmin ? `
        <button class="nav-btn-mobile" data-nav="admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Admin
        </button>
      ` : ''}
      ${isAdmin ? `
        <button class="nav-btn-mobile" data-nav="presentation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Docs
        </button>
      ` : ''}
      <button class="nav-btn-mobile" data-nav="profile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Conta
      </button>
    </div>
  `;
}

/**
 * Anexa eventos de clique aos botões de navegação, logout e notificações.
 * Função é invocada Imediatamente após carregar HTML na Tela (Pois javascript nao reconhece botes n-renderizados).
 * @param {Function} onNavigate Callback passado pelo script.js para mudar a rota.
 * @param {Function} onLogout Callback passado para executar o deslogue do utilizador.
 * @param {Function} onShowNotifications Callback que abre o modal de notificações.
 */
export function setupNavbarInteractions(onNavigate, onLogout, onShowNotifications) {
  // --- Theme Toggle Logic (Dia/Noite com LocalStorage) ---
  const themeSwitch = document.getElementById('checkbox');
  
  // Tenta ler caso o cara ja salvou memoria ("dark" ou "light"). 
  // Senão, lê as confgs do Navegador e MAC/Windows de Cadeira a fora (Prefers-color-scheme).
  const currentTheme = localStorage.getItem('lyra-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Função q Pinta tudo! (Injeta no elemento <html> (o node root do document) pra cascatear no CSS)
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeSwitch) themeSwitch.checked = true;
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeSwitch) themeSwitch.checked = false;
    }
    // Salva na Caixola!
    localStorage.setItem('lyra-theme', theme);
  };

  // Dá um "Força Aplicar" ao Carregar a App no Inicio.
  applyTheme(currentTheme);

  // Escuta por cliques no Switch pra ir mudando.
  if (themeSwitch) {
    themeSwitch.addEventListener('change', (e) => {
      applyTheme(e.target.checked ? 'dark' : 'light');
    });
  }

  // Lógica Monstrona da SINGLE PAGE APPLICAION:
  // "Pegue todos que servem de menu pra mudar de página (data-nav)"
  const navBtns = document.querySelectorAll('[data-nav]');
  
  // Para cada botão, adiciona um 'escutador' de clique
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Identifica o valor (ex: Atrbuto de HTMl Custom: data-nav="dashboard")
      const page = e.currentTarget.getAttribute('data-nav');
      
      // Remove a classe 'active' (que pinta o botão da cor primária) de todos
      navBtns.forEach(b => b.classList.remove('active'));
      
      // Encontra todos os botões (desktop e celular) da rota clicada AGORA, e pinta.
      document.querySelectorAll(`[data-nav="${page}"]`).forEach(b => b.classList.add('active'));

      // Chama a função onNavigate (Aquele router Central de Arquivos no script.js) q vai injetar a tela
      if (onNavigate) onNavigate(page);
    });
  });

  // Evento de Logout (Sair da Sub-App)
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (onLogout) onLogout(); // Executa o logout no script.js que limpa sessaão
    });
  }

  // Evento Notificações Modal (Mostra os alertas sobre o curso/notas num popup)
  const notifBtn = document.getElementById('btn-notifications');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      if (onShowNotifications) onShowNotifications(); // Mostra o modal (Avisa Root pra Chamar Componente Modal.js)
    });
  }

  // Setup Live System Clock (Painelzinho superior com horario)
  const clockEl = document.getElementById('system-live-clock');
  if (clockEl) {
    const updateTime = () => {
      const now = new Date();
      // Formata pra modelo Brasileiro de 2digitos (ex: 15:44)
      clockEl.textContent = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };
    updateTime(); // Puxa agora p nao esperar 1 seg
    // Usa setInterval na window (Loop Infinito) p atualizar o Text a cada 1 segundo. CUIDAR p n dar LoopLeak e limpar antes!
    if (window.liveClockInterval) clearInterval(window.liveClockInterval);
    window.liveClockInterval = setInterval(updateTime, 1000);
  }
}

/**
 * Atualiza o 'pontinho vermelho' (indicador de notificações não lidas) 
 * que aparece no ícone do sino na navbar.
 * @param {boolean} hasNew Variável boleana (verdadeiro/falso) que diz se precisa ou não renderizar a notif bolinha
 */
export function updateNotificationBadge(hasNew) {
  const badge = document.getElementById('notif-badge-indicator');
  if (badge) {
    badge.style.display = hasNew ? 'block' : 'none';
  }
}
