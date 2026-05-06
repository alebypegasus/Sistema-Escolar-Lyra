export const Notifications = {
  containerId: 'notification-container',
  
  init() {
    if (!document.getElementById(this.containerId)) {
      const div = document.createElement('div');
      div.id = this.containerId;
      document.body.appendChild(div);
    }
  },

  show(title, message, type = 'info') {
    this.init();
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    let color = 'var(--text-primary)';
    if(type === 'success') color = 'var(--success-color)';
    if(type === 'danger') color = 'var(--danger-color)';
    if(type === 'warning') color = 'var(--warning-color)';
    if(type === 'info') color = 'var(--accent-color)';

    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.style.borderLeft = `4px solid ${color}`;
    
    toast.innerHTML = `
      <div class="flex-between-center">
         <div class="notif-title" style="color: ${color}">${title}</div>
         <button class="btn-icon" style="background: none; border: none; cursor: pointer; color: var(--text-secondary);" onclick="this.parentElement.parentElement.remove()">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
      </div>
      <div class="notif-msg mt-4">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto-remove after 5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 600);
    }, 5000);
  }
};
