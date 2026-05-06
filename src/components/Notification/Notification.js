/**
 * ========================================================
 * NOTIFICATION MANAGER (Gerenciador de Toasts/Notificações Flutuantes)
 * ========================================================
 * Lida com o aparecimento de balõezinhos e recados temporários na tela.
 * Este Sistema é "Auto Contido", ou seja, pode ser importado via
 * import { Notifications } e não depende de HTML externo.
 */
export const Notifications = {
  // Id do "Guarda-Chuva/Saco" principal de notificações
  containerId: 'notification-container',
  
  /**
   * INICIALIZADOR MÁGICO (Cria o Container Zumbi caso ninguem tenha as feito no DOMHTML)
   */
  init() {
    // Se no Index.html raiz NÃO TEM o saco de notificações... Nó faz agora!
    if (!document.getElementById(this.containerId)) {
      const div = document.createElement('div');
      div.id = this.containerId;
      document.body.appendChild(div);
      // CSS do Notification.css tratará essa root div ficando Fixed no Canto Top Right ou Bottom Right
    }
  },

  /**
   * Função Pública Padrão (Factory) p/ Lançar um Balão
   * @param {string} title Título Forte.
   * @param {string} message Mensagem descritiva leve.
   * @param {string} type Tipo visual CSS: 'success' | 'danger' | 'warning' | 'info'
   */
  show(title, message, type = 'info') {
    this.init(); // Garante q a sacola-mãe exita no HTML sempre q alguem chamar
    const container = document.getElementById(this.containerId);
    if (!container) return; // FailSafe caso falhe criaçao
    
    // Switch Visual Condicional pros Types
    let color = 'var(--text-primary)';
    if(type === 'success') color = 'var(--success-color)';
    if(type === 'danger') color = 'var(--danger-color)';
    if(type === 'warning') color = 'var(--warning-color)';
    if(type === 'info') color = 'var(--accent-color)';

    // Elemento HTML cru do Toast Individual
    const toast = document.createElement('div');
    toast.className = 'notification-toast'; // Regras visuais principais vindo css externo
    toast.style.borderLeft = `4px solid ${color}`; // Detalhe Pintura custom de state 
    
    // Injeção de Template String de Forma Literal
    toast.innerHTML = `
      <div class="flex-between-center">
         <div class="notif-title" style="color: ${color}">${title}</div>
         <!-- onClick via RAW Html -> Aciona subida de escopo PAI -> PAi -> .remove() nativo do nó XML -->
         <button class="btn-icon" style="background: none; border: none; cursor: pointer; color: var(--text-secondary);" onclick="this.parentElement.parentElement.remove()">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
      </div>
      <div class="notif-msg mt-4">${message}</div>
    `;
    
    // Anexa/Dropa dentro do Saco Pai
    container.appendChild(toast);
    
    // Trigger animation via Api De GPU Nativa (Faz transição fluida p/ aparecer devagar via CSS Transisions)
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto-Destruição/Auto-remove no Lixo da Memória apOs 5s p/ Limpar Tela
    setTimeout(() => {
      toast.classList.remove('show'); // Tira a classe (o que causa Re-Anime Inverso p/ FadeOut)
      setTimeout(() => toast.remove(), 600); // Aguarda ms CSS Acabar e DELETA do DOM pra não travar RAM (Memory Leak Prevention)
    }, 5000);
  }
};
