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
      <div class="card p-40 text-center" style="background: linear-gradient(135deg, var(--accent-color), #0f172a); color: white; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <h1 class="font-display fw-bold mb-16" style="font-size: 48px; letter-spacing: -1px;">Lyra Architecture Overview</h1>
        <p style="font-size: 18px; opacity: 0.9; max-width: 800px; margin: 0 auto; line-height: 1.6;">
          Descubra o motor de um sistema escolar moderno. O Lyra dispensa bibliotecas complexas, baseando-se em Vanilla JS reativo, Glassmorfismo adaptativo e injeção assíncrona de componentes na árvore do DOM.
        </p>
      </div>

      <!-- Componentes Estruturais -->
      <div class="card">
        <h2 class="fw-bold mb-8 text-xl">Arquitetura de Front-End e Modulares</h2>
        <p class="text-secondary text-sm mb-24">Componentização sem Web Components ou Frameworks.</p>
        <div class="grid-2-cols gap-16">
          <div class="bg-panel border border-radius-8 p-20 flex-col gap-12 hover-lift transition-all">
             <div class="fw-bold flex-align-center gap-8">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
               index.html (Contêiner Pai)
             </div>
             <p class="text-xs text-secondary">
               Hospeda de forma invisível as div's (roots): <code>#navbar-root</code>, <code>#main-root</code>, e <code>#footer-root</code>.
               O index também sustenta a <code>login-screen</code> atuando como ponte primária entre o visitante anônimo e o DOM autenticado.
             </p>
          </div>
          
          <div class="bg-panel border border-radius-8 p-20 flex-col gap-12 hover-lift transition-all">
             <div class="fw-bold flex-align-center gap-8 text-accent">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
               Store.js (Single Source of Truth)
             </div>
             <p class="text-xs text-secondary">
               Substitui o Redux/ContextAPI. Trabalha parseando um mock de JSONs puros importados e serializa as atualizações diretamente num <code>State</code> Proxy imutável que retroalimenta o localStorage no background.
             </p>
          </div>
        </div>
      </div>

      <!-- Grid de Pilares Técnicos Avançados -->
      <div class="grid-2-cols gap-24">
        <div class="card">
          <div class="text-accent mb-16">
             <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          </div>
          <h3 class="fw-bold mb-8">Virtual Routing</h3>
          <p class="text-secondary text-sm mb-16">
             O sistema navega em velocidade luz mascarando componentes HTML através da função <code>navigateTo()</code>. Ela ativa Skeletong Loading para criar engajamento, apaga o conteúdo de views antigas para poupar memória RAM do cliente, e injeta as regras da nova view com delay intencional (simulando requisições REST).
          </p>
          <div class="bg-panel p-12 border-radius-8 border text-xs font-mono">
            if(path === 'grades') renderGrades(container); setupStudentInteractions();
          </div>
        </div>
        
        <div class="card">
          <div class="text-accent mb-16">
             <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <h3 class="fw-bold mb-8">Data-to-Interface Pipeline</h3>
          <p class="text-secondary text-sm">
            Eventos assíncronos no modal são convertidos em arrays e filtrados por IDs institucionais.
            Por exemplo: Exportações para CSV de "Notas e Presenças" mapeiam um objeto do Storage, processam suas strings e geram Blob/ObjectURL do lado do cliente permitindo o download em XLS/CSV de forma nativa e sem necessidade de backends PHP/Nodejs.
          </p>
        </div>
      </div>

      <!-- Explicação de Lógica com Códigos -->
      <div class="grid-2-cols gap-24">
        <div class="card">
          <h4 class="fw-bold mb-16">Lógica de Cadastro Dinâmico</h4>
          <p class="text-sm text-secondary mb-16">Injeção segura e imutável de novas entidades no LocalStorage, reconstruindo referências JSON.</p>
          <pre class="bg-panel p-16 border-radius-8 text-xs overflow-x" style="color: var(--text-primary); border: 1px solid var(--border-color);">
registerStudent(data) {
  const list = this.db.students;
  const newStudent = { 
    ...data, 
    id: \`s\${list.length + 1}\`,
    registration: \`\${new Date().getFullYear()}-\${list.length.toString().padStart(4, '0')}\` 
  };
  list.push(newStudent);
  this.db.saveStudents(list); // Fire and Forget Storage Update
}</pre>
        </div>

        <div class="card">
          <h4 class="fw-bold mb-16">CSS Liquid Glass Physics</h4>
          <p class="text-sm text-secondary mb-16">Ao invés de dependências como Tailwind, nossas utilidades manipulam alpha channels ativamente e processamentos de blurs.</p>
          <pre class="bg-panel p-16 border-radius-8 text-xs overflow-x" style="color: var(--text-primary); border: 1px solid var(--border-color);">
.glass-surface {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}</pre>
        </div>
      </div>

      <!-- Entendendo a Camada do Administrador -->
      <div class="card p-32" style="background: var(--bg-surface);">
        <h4 class="fw-bold mb-16">Camada de Administração & Segurança de Formulários</h4>
        <p class="text-sm text-secondary mb-24 line-height-16">O painel do gestor (Secretaria) embutido no sistema trabalha com seleções massivas em lote (bulk delete) e escutas de eventos anexadas programaticamente durante a construção dos templates. Como as abas dependem de injeção de template string, associar callbacks nativamente em elementos recém forjados deve seguir sempre a ordem cíclica de 1) Atualização do Virtual DOM, 2) Event Listeners Setup, e 3) Refresh Cascade de re-renderização.</p>
        
        <div class="flex-col gap-12 text-sm">
           <div class="flex-align-center gap-12 bg-panel p-12 border-radius-4 border"><span class="pill bg-surface border">CPF & RG Checks</span> Validações string-base puras com regex impedindo submissões polídas que quebrariam as planilhas XLS.</div>
           <div class="flex-align-center gap-12 bg-panel p-12 border-radius-4 border"><span class="pill outline-danger border">Bulk Deletes</span> Destruição em lote dispara confirmações baseadas em Modais customizados da nossa fábrica genérica.</div>
           <div class="flex-align-center gap-12 bg-panel p-12 border-radius-4 border"><span class="pill outline-accent border">Blob Generation</span> Os exports (PDF e CSV) forjam estruturas HTML que são traduzidas por DataURIs ou via Print Inject.</div>
        </div>
      </div>

      <div class="text-center p-32 text-secondary bg-panel border-radius-12 border">
        <h4 class="fw-bold mb-8 text-primary">Siga na Profundidade</h4>
        <p class="text-sm">Abra a raiz de nosso projeto e leia intensamente o arquivo <code>DOCUMENTATION.md</code> contruído especialmente para guiar desenvolvedores e analistas pelo emaranhado do ecossistema e seu ciclo de vida.</p>
      </div>
      
      <style>
         .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); border-color: var(--accent-light); }
         .line-height-16 { line-height: 1.6; }
      </style>
    </div>
  `;
}
