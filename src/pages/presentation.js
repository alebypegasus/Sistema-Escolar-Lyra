/**
 * ========================================================
 * PRESENTATION PAGE - JAVASCRIPT
 * Página dedicada para desenvolvedores entenderem o sistema.
 * ========================================================
 */

export function renderPresentation(container) {
  container.innerHTML = `
    <div class="flex-col gap-32">
      <!-- Hero Section -->
      <div class="card p-40 text-center" style="background: linear-gradient(135deg, var(--accent-color), #0f172a); color: white; border: none;">
        <h1 class="font-display fw-bold mb-16" style="font-size: 42px;">Engine & Branding Architecture</h1>
        <p style="font-size: 18px; opacity: 0.9; max-width: 700px; margin: 0 auto;">
          Explorando as entranhas do Sistema Lyra: Do gerenciamento de estados no LocalStorage à Identidade Visual dinâmica.
        </p>
      </div>

      <!-- Grid de Pilares Técnicos -->
      <div class="grid-2-cols gap-24">
        <div class="card">
          <div class="text-accent mb-16">
             <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10l9 6"></path><circle cx="12" cy="12" r="10"></circle></svg>
          </div>
          <h3 class="fw-bold mb-8">Persistence Layer</h3>
          <p class="text-secondary text-sm mb-16">Utilizamos o <code>localStorage</code> como nosso banco de dados persistente. Toda mudança no <code>MockDB</code> dispara um evento de gravação.</p>
          <div class="bg-panel p-12 border-radius-8 border text-xs">
            lyra_professors, lyra_custom_logo, lyra_notifications
          </div>
        </div>
        
        <div class="card">
          <div class="text-accent mb-16">
             <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <h3 class="fw-bold mb-8">Dynamic Branding</h3>
          <p class="text-secondary text-sm">O sistema de logo permite que a Secretaria altere a imagem do sistema via URL ou Upload (FileReader), persistindo no State global.</p>
        </div>
      </div>

      <!-- Explicação de Lógica com Códigos -->
      <div class="grid-2-cols gap-24">
        <div class="card">
          <h4 class="fw-bold mb-16">Lógica de Cadastro (Admin)</h4>
          <p class="text-sm text-secondary mb-16">O portal da Secretaria valida e injeta novos objetos no array de professores de forma atômica.</p>
          <pre class="bg-panel p-16 border-radius-8 text-xs overflow-x" style="color: var(--text-primary);">
registerProfessor(profData) {
  const profs = this.db.professors;
  profs.push({ ...profData, id: 'p' + (profs.length + 1) });
  this.db.saveProfessors(profs); // Sincroniza com LS
}
          </pre>
        </div>

        <div class="card">
          <h4 class="fw-bold mb-16">Liquid Glass Rendering</h4>
          <p class="text-sm text-secondary mb-16">O CSS utiliza variáveis pré-processadas no <code>theme.css</code> para garantir camadas de profundidade.</p>
          <pre class="bg-panel p-16 border-radius-8 text-xs overflow-x" style="color: var(--text-primary);">
.glass-panel {
  background: var(--bg-surface);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
}
          </pre>
        </div>
      </div>

      <!-- Funções Críticas -->
      <div class="card">
        <h4 class="fw-bold mb-24">Developer Entry Points</h4>
        <div class="flex-col gap-12">
          <div class="bg-panel p-12 border-radius-8 border">
            <span class="text-accent fw-bold">FileReader API</span>: Usada para converter arquivos locais em Base64 persistentes para a Logo.
          </div>
          <div class="bg-panel p-12 border-radius-8 border">
            <span class="text-accent fw-bold">Skeleton Logic</span>: Injeta placeholders <code>.skeleton-base</code> com animação shimmer antes da montagem do DOM real.
          </div>
          <div class="bg-panel p-12 border-radius-8 border">
            <span class="text-accent fw-bold">Custom Bezier</span>: <code>0.68, -0.55, 0.265, 1.55</code> - A curva por trás da "elasticidade" do Lyra.
          </div>
        </div>
      </div>

      <div class="text-center p-24 text-secondary">
        <p>Acesse o arquivo <code>DOCUMENTATION.md</code> na raiz para o guia completo de arquitetura.</p>
      </div>
    </div>
  `;
}
