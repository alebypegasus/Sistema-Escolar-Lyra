/**
 * ========================================================
 * MAIN - JAVASCRIPT
 * Define o layout central "Meio" e manipula a mudança
 * da identificação do usuário e view. (Aonde as páginas entram).
 * ========================================================
 */

// Importamos nosso CSS que gerencia os fadeIns e posições da tela central
import './Main.css';

/**
 * Retorna o HTML base do "Centro" do nosso App.
 * Dentro da "main-view-container", criamos várias telas (divs) que começam
 * vazias e "invisíveis" (Exceto a dashboard).
 * Quando clicamos na Navbar, a função switchView torna uma delas "active" (Visível).
 */
export function getMainHTML() {
  return `
    <main class="main-wrapper">
      <!-- Cabeçalho Principal (Oi, Ciclano) -->
      <div class="main-greeting">
        <h1 id="user-greeting-txt">Olá, visitante</h1>
        <p id="user-subtitle-txt">Carregando dados...</p>
      </div>

      <!-- É aqui dentro que as páginas vão habitar -->
      <div class="main-view-container" id="main-view-surface">
        <div id="page-dashboard" class="page-view active"></div>
        <div id="page-courses" class="page-view"></div>
        <div id="page-grades" class="page-view"></div>
        <div id="page-admin" class="page-view"></div>
        <div id="page-presentation" class="page-view"></div>
        <div id="page-profile" class="page-view"></div>
        <div id="page-student-details" class="page-view"></div>
      </div>
    </main>
  `;
}

/**
 * Atualiza os textos da saudação superior com base no usuário (Puxado do banco simulado).
 * @param {string} name O Nome do Aluno/Professor.
 * @param {string} subtitle Um sub-texto (Ex: Matrícula ou Matéria ministrada).
 */
export function setGreeting(name, subtitle) {
  // Pega os elementos alvo
  const tName = document.getElementById('user-greeting-txt');
  const tSub = document.getElementById('user-subtitle-txt');
  
  // Modifica os textos via DOM
  if (tName) tName.textContent = `Olá, ${name}! 👋`;
  if (tSub) tSub.textContent = subtitle;
}

/**
 * Lida com o chaveamento das páginas no "Center"
 * @param {string} pageId O ID do target (ex: dashboard, courses, grades, profile)
 */
export function switchView(pageId) {
  // 1. Pega a view atual ativa
  const currentActive = document.querySelector('.page-view.active');
  const target = document.getElementById(`page-${pageId}`);
  
  if (currentActive === target) return;

  // 2. Se houver algo ativo, ativa animação de saída
  if (currentActive) {
    currentActive.classList.add('exiting');
    currentActive.classList.remove('active');
    
    // Pequeno tempo para a animação de saída (casando com o CSS)
    setTimeout(() => {
      currentActive.classList.remove('exiting');
    }, 500);
  }

  // 3. Mostra a nova (E faz rodar a animação fadeIn do CSS)
  if (target) {
    target.classList.add('active');
  }
}

