export function AdminModal() {
  return `
    <div id="modal-container" class="modal-overlay hidden">
      <div class="modal-content animate-slide-up">
        <div class="modal-header">
          <h2 id="modal-title">Editar Item</h2>
          <button class="modal-close close-modal" id="admin-modal-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div id="modal-body" class="modal-body"></div>
      </div>
    </div>
  `;
}
