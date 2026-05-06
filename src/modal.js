import { State } from './store.js';

export const Modal = {
  open(title, contentHTML) {
    const overlay = document.getElementById('global-modal');
    const content = document.getElementById('global-modal-content');
    
    if(!overlay || !content) return;
    
    content.innerHTML = `
      <div class="modal-header">
        <h2 id="modal-title" style="margin: 0; font-size: 18px; font-weight: 700;">${title}</h2>
        <button class="modal-close close-modal" style="background: none; border: none; cursor: pointer; color: var(--text-secondary);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body p-24">
        ${contentHTML}
      </div>
    `;
    
    content.querySelector('.close-modal').addEventListener('click', () => {
      this.close();
    });
    
    overlay.classList.remove('hidden');
  },
  
  close() {
    const overlay = document.getElementById('global-modal');
    if(overlay) {
      overlay.classList.add('hidden');
    }
  }
};

export function renderActionButtons() {
    const body = document.body;
    let fab = document.getElementById('fab-container');
    
    if(fab) {
        fab.style.display = 'block';
        fab.innerHTML = '';
    } else {
        fab = document.createElement('div');
        fab.id = 'fab-container';
        fab.style.position = 'fixed';
        fab.style.bottom = '24px';
        fab.style.right = '24px';
        fab.style.zIndex = '900';
        fab.style.display = 'flex';
        fab.style.flexDirection = 'column';
        fab.style.gap = '12px';
        body.appendChild(fab);
    }
    
    // Configura botões de acordo com tela
    if (State.userType === 'teacher' && State.currentPage === 'grades') {
         fab.innerHTML = `
           <button class="btn-primary flex-center shadow-lg" style="width: 56px; height: 56px; border-radius: 28px; background: var(--accent-color); color: white; border: none; cursor: pointer;">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
           </button>
         `;
         // Opcional, adicionar ação ao FAB
    }
}
