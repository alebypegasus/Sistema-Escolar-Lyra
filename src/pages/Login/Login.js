import { State } from '../../store.js';
import { renderAppStructure, navigateTo, triggerInitialNotifications } from '../../script.js';

/**
 * ========================================================
 * LÓGICA DE LOGIN & AUTENTICAÇÃO (Client-Side)
 * ========================================================
 * Verifica os campos inseridos (Usuário e Senha), e se tudo OK:
 * 1. Esconde a div do formulário (Login Screen)
 * 2. Mostra a div principal do App (App Screen)
 * 3. Faz Injeção da UI e Navega para o Dashboard.
 * 
 * * A segurança real exige backend com Hash/Salting (BCrypt)
 * e tokens JWT, mas para este mock, simulamos localmente.
 * ========================================================
 */
export function setupLogin() {
  const loginForm = document.getElementById('login-form');
  const loginToggle = document.getElementById('login-toggle');
  const toggleLabelAcademic = document.getElementById('toggle-label-academic');
  const toggleLabelAdmin = document.getElementById('toggle-label-admin');
  let currentMode = 'academic';

  if (!loginForm) return; // Fail safe

  /**
   * Atualiza a Interface do Usuário (UI) baseada no modo selecionado.
   * Alternativa entre modo "Acadêmico" (Alunos/Professores) e "Admin" (Secretaria)
   */
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

  // Evento CTI: Trocar de ABA no Formulário
  if (loginToggle) {
    loginToggle.onclick = () => {
      // Toggle string state logic (Ternario)
      currentMode = currentMode === 'academic' ? 'admin' : 'academic';
      updateLoginUI();
    };
  }

  // Also allow clicking the labels (UX Aprimorada p Dedo Gordo no Celular)
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

  // Atualiza dinamicante a logo grandona puxando lá da "Store"
  const loginLogo = document.querySelector('.logo-img-large');
  if (loginLogo) loginLogo.src = State.getLogo();

  // "Escuta" o submit FORM (apertar botão ou pressionar 'enter' do teclado)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // NUNCA DEIXE FORM RECARREGAR UMA SPA!!!! NUNCA!!!!!
    const reg = document.getElementById('login-registration').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const errorMsg = document.getElementById('login-error');

    errorMsg.classList.add('hidden'); // Reseta a msg de erro

    // Flag State p validação
    let loginSuccess = false;

    // Tentativa de login baseada no modo escolhido do Switch da CTI: 
    if (currentMode === 'admin') {
      // Validação específica para Admin (Força State.user.isAdmin === True)
      loginSuccess = State.login(reg, pass) && State.user.isAdmin;
      if (!loginSuccess && State.user) {
        // Se logou com sucesso MAS não é admin... (ex: logou um aluno na aba admin sem querer) ... desloga e recusa
        State.logout();
        loginSuccess = false;
      }
    } else {
      // Validação Acadêmica (Aluno ou Professor normal)
      loginSuccess = State.login(reg, pass) && !State.user.isAdmin;
      if (!loginSuccess && State.user && State.user.isAdmin) {
        // Se é admin com a porra toda de moral, mas tá tentando entrar no portal acadêmico, barramos para forçar o fluxo correto
        State.logout();
        loginSuccess = false;
      }
    }

    if (loginSuccess) {
      // Login Bem Sucedido -> Trasição CSS de Tela fluída (Esmaece e Some)
      document.getElementById('login-screen').style.opacity = '0';

      // Aguarda Fadeout do Esmaecer Terminar em 400ms pra remover a DIV do flow HTML (hidden) e injetar CSS do APP.
      setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');

        // MÁGICA SPA -> Monta o Chassi da Tela (Navbar + Footer) e Depois Engata Rota do MIOLO
        renderAppStructure();
        navigateTo('dashboard');
        triggerInitialNotifications(); // Checa recados pendentes etc 
      }, 400); 
    } else {
      // Falhou!! -> Chama a classe CSS de SHAKE Error e tira Hidden do Alerta Html (Bandeira Vermelha UI)
      errorMsg.classList.remove('hidden');
      const inputs = loginForm.querySelectorAll('input');
      inputs.forEach(input => {
        input.classList.add('login-error-shake'); // CSS keyframes agita as caixas
        // Após 400ms, limpa keyframe pra poder vibrar novamente caso eleerre dnv.
        setTimeout(() => input.classList.remove('login-error-shake'), 400);
      });
    }
  });
}
