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
        <h1 class="font-display fw-bold mb-16" style="font-size: 48px; letter-spacing: -1px;">Lyra Architecture Specification</h1>
        <p style="font-size: 18px; opacity: 0.9; max-width: 800px; margin: 0 auto; line-height: 1.6;">
          Um mergulho técnico no ecossistema Lyra: do gerenciamento de estado imutável à renderização baseada em física de Bezier.
        </p>
      </div>

      <!-- Componentes Estruturais -->
      <div class="card">
        <h2 class="fw-bold mb-8 text-xl">Arquitetura de Front-End Modular</h2>
        <p class="text-secondary text-sm mb-24">Como construímos um sistema complexo sem frameworks modernos.</p>
        <div class="grid-2-cols gap-16 flex-wrap" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
          <div class="bg-panel border border-radius-8 p-20 flex-col gap-12 hover-lift transition-all">
             <div class="fw-bold flex-align-center gap-8">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
               View Engine (Template Strings)
             </div>
             <p class="text-xs text-secondary" style="line-height: 1.6;">
               Cada página em <code>src/pages/*.js</code> exporta uma função de renderização que retorna HTML puro. Isso evita o overhead de compilação JSX enquanto mantém a legibilidade e permite injeção direta de dados do <code>State</code>.
             </p>
          </div>
          
          <div class="bg-panel border border-radius-8 p-20 flex-col gap-12 hover-lift transition-all">
             <div class="fw-bold flex-align-center gap-8 text-accent">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
               State Singleton & Persistence
             </div>
             <p class="text-xs text-secondary" style="line-height: 1.6;">
               O <code>store.js</code> implementa um Singleton que centraliza todas as operações de escrita e leitura. Ao centralizar, garantimos que uma atualização de nota em Grades reflita instantaneamente no Dashboard sem a necessidade de eventos complexos.
             </p>
          </div>
        </div>
      </div>

      <!-- Detalhamento de Funcionalidades -->
      <div class="card p-32">
        <h3 class="fw-bold mb-24 border-bottom pb-12">Detalhamento Técnico do Ecossistema</h3>
        
        <div class="flex-col gap-24">
           <div>
              <h4 class="fw-bold text-sm uppercase text-accent mb-8">1. Sistema de Autenticação Centralizado</h4>
              <p class="text-sm text-secondary">Utilizamos um arquivo <code>db_admins.json</code> na raiz do banco de dados simulado para validar gestores. O sistema de login diferencia dinamicamente entre <strong>Alunos</strong> (via RA), <strong>Professores</strong> (via IDs de Docência) e <strong>Administradores</strong> (via logins da secretaria), direcionando cada um para interfaces específicas.</p>
           </div>

           <div>
              <h4 class="fw-bold text-sm uppercase text-accent mb-8">2. Validações e Integridade de Dados</h4>
              <p class="text-sm text-secondary">Todas as entradas de dados sensíveis na secretaria (CPF, RG, Matrícula) passam por sanitização em tempo real. Utilizamos expressões regulares (Regex) para garantir que apenas números limpos sejam persistidos, evitando erros em fórmulas de planilhas durante exportações massivas.</p>
           </div>

           <div>
              <h4 class="fw-bold text-sm uppercase text-accent mb-8">3. Física de Animação (Bezier)</h4>
              <p class="text-sm text-secondary">Para garantir um "flow" agradável, as transições entre a visão de Aluno e Professor usam curvas de mola <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code>. Essa curva provê um leve "overshoot", simulando um objeto físico que se encaixa na tela, eliminando a sensação de interface estática.</p>
           </div>

           <div>
              <h4 class="fw-bold text-sm uppercase text-accent mb-8">4. Infraestrutura de Exportação Nativa</h4>
              <p class="text-sm text-secondary">A exportação para CSV e PDF é processada 100% no lado do cliente. O CSV é gerado montando uma string longa que é convertida em um <code>Blob</code> e disparada como download via ObjectURL. O PDF utiliza a API de <code>window.print()</code> com injeção de estilos condicionais para isolar tabelas e remover elementos de navegação.</p>
           </div>
        </div>
      </div>

      <!-- Entendendo a Camada do Administrador -->
      <div class="card p-32" style="background: var(--bg-surface);">
        <h4 class="fw-bold mb-16">Metodologia de Atualização Bulk</h4>
        <p class="text-sm text-secondary mb-24" style="line-height: 1.6;">A gestão de exclusão em lote (Bulk Delete) na Secretaria utiliza seletores de estado DOM. Quando múltiplos itens são marcados, um coletor de IDs é disparado para o <code>State.deleteEntity</code>, que limpa o array do localStorage e dispara um Cascade Refresh, re-renderizando a aba ativa mantendo a paridade de dados.</p>
        
        <div class="flex-col gap-12 text-sm">
           <div class="flex-align-center gap-12 bg-panel p-12 border-radius-4 border"><span class="pill bg-surface border">LocalStorage Sync</span> Garante que mesmo com F5, a composição da escola se mantenha.</div>
           <div class="flex-align-center gap-12 bg-panel p-12 border-radius-4 border"><span class="pill outline-danger border">Admin Master Access</span> O ID <code>admin</code> é a chave mestre do sistema para recuperação.</div>
           <div class="flex-align-center gap-12 bg-panel p-12 border-radius-4 border"><span class="pill outline-accent border">Branding Architecture</span> Configurações de logo e cores via Root Property Injection.</div>
        </div>
      </div>

      <div class="text-center p-32 text-secondary bg-panel border-radius-12 border">
        <h4 class="fw-bold mb-8 text-primary">Siga na Profundidade</h4>
        <p class="text-sm">Leia o arquivo <code>DOCUMENTATION.md</code> para especificações de API e Modelos de Dados.</p>
      </div>
      
      <style>
         .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); border-color: var(--accent-light); }
      </style>
    </div>
  `;
}
