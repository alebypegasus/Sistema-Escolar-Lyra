export const Notifications = {
  queue: [],
  isShowing: false,

  show(title, message, type = 'info') {
    this.queue.push({ title, message, type });
    this.processQueue();
  },

  processQueue() {
    if (this.isShowing || this.queue.length === 0) return;
    this.isShowing = true;
    
    const notif = this.queue.shift();
    this.render(notif);
  },

  render(notif) {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container);
    }
    
    const el = document.createElement('div');
    el.className = `notification-toast notif-${notif.type}`;
    el.innerHTML = `
      <div class="notif-content">
        <div class="notif-title">${notif.title}</div>
        <div class="notif-msg">${notif.message}</div>
      </div>
    `;

    container.appendChild(el);
    
    // Trigger layout
    void el.offsetWidth;

    // Animate in
    el.classList.add('show');

    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => {
        el.remove();
        this.isShowing = false;
        this.processQueue();
      }, 600); // Wait for CSS transition (0.6s)
    }, 4000); // Display time
  }
};
