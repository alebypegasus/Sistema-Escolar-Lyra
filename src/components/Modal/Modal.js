import { State } from '../../store.js';

/**
 * ========================================================
 * MODAL MANAGER (Gerenciador de Janelas Modais Flutuantes)
 * ========================================================
 * Objeto JS puro responsável por controlar a janela modal genérica (overlay HTML)
 * criada de forma global no index.html.
 */
export const Modal = {
  /**
   * Abre a Modal passando um Título Customizado e um Miolo em HTML puro.
   */
  open(title, contentHTML) {
    // Puxamos a DIV escurona do fundo que cobre a tela toda
    const overlay = document.getElementById('global-modal');
    // E puxamos a DIV do meio o quadradinho branco fofinho!
    const content = document.getElementById('global-modal-content');
    
    if(!overlay || !content) return; // Se não tiver quebrado
    
    // Injetamos a Receita (CSS HTML inline) na Janelinha de Foco
    content.innerHTML = `
      <div class="modal-header">
        <h2 id="modal-title" style="margin: 0; font-size: 18px; font-weight: 700;">${title}</h2>
        <!-- O Xizinho Sombrio de Fechar (Lucide SVG) -->
        <button class="modal-close close-modal" style="background: none; border: none; cursor: pointer; color: var(--text-secondary);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <!-- O Miolo da Modal q passamos de argumento em qualquer tela q chama a Open()!! -->
      <div class="modal-body p-24">
        ${contentHTML}
      </div>
    `;
    
    // Puxamos o botal de close (X) pra add escutador nele q roda o Modal.close() local!
    content.querySelector('.close-modal').addEventListener('click', () => {
      this.close();
    });
    
    // Finalmente, tira classe 'hidden' da overlay. A opacity do CSS lida c/ desmaio animado
    overlay.classList.remove('hidden');
  },
  
  /**
   * Fecha a Modal via injeção CSS
   */
  close() {
    const overlay = document.getElementById('global-modal');
    if(overlay) {
      overlay.classList.add('hidden'); // Taca Hidden Denovo = Fica Cego kkk
    }
  }
};

/**
 * RENDER FLOATING ACTION BUTTONS (FABs)
 * Sabe aquele botão flutuante redondo de Celular no canto Inferior Direito (+) q salva vida?
 * É ele q renderizamos baseado em Regras de Negócio e Rotas!
 */
export function renderActionButtons() {
    const body = document.body;
    let fab = document.getElementById('fab-container');
    
    // Se a Div do FAB não existir no sistema HTML, nó cria por cima!
    if(fab) {
        fab.style.display = 'block';
        fab.innerHTML = ''; // Limpa pra remontar dps
    } else {
        fab = document.createElement('div');
        fab.id = 'fab-container';
        // O Estilo dele é inline pra fixar pesado na Right/Bottom
        fab.style.position = 'fixed';
        fab.style.bottom = '24px';
        fab.style.right = '24px';
        fab.style.zIndex = '900'; // Prioritário no Flow CSS 3D
        fab.style.display = 'flex';
        fab.style.flexDirection = 'column';
        fab.style.gap = '12px';
        body.appendChild(fab);
    }
    
    // Configura botões dinamicamente de acordo com tela (Router Virtual da SPA) E o TIPO User State
    // Um aluno não vê (+), só prof!
    if (State.userType === 'teacher' && State.currentPage === 'grades') {
         fab.innerHTML = `
           <button class="btn-primary flex-center shadow-lg" style="width: 56px; height: 56px; border-radius: 28px; background: var(--accent-color); color: white; border: none; cursor: pointer;">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
           </button>
         `;
         // Funcionalidade do Click (Opcional) pode ser botada aqui!
    } else {
        fab.style.display = 'none'; // Some dele pra outro tipo / pagina..
    }
}
