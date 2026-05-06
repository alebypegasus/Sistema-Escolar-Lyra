import './ToggleSwitch.css';

/**
 * ========================================================
 * COMPONENTE TOGGLE SWITCH (Interruptor Interativo)
 * ========================================================
 * Uma Função/Componente estilizador que retorna a estrutura HTML
 * de um botão tipo "Interruptor" (ex: Usado para Modo Escuro/Claro).
 * 
 * @param {Object} props Destructuring dos argumentos
 * @param {string} props.id O ID único que o controle HTML <input> receberá
 * @param {string} props.onIcon String HTML (geralmente SVG) mostrada quando ligado/dark
 * @param {string} props.offIcon String HTML mostrada quando desligado/light
 * @returns {string} String HTML literal p/ injeção no DOM.
 */
export function ToggleSwitch({ id = 'theme-toggle', onIcon = '', offIcon = '' }) {
  return `
    <div class="theme-switch-wrapper">
      <!-- Tag Label engloba tudo, fazendo clicar em qualquer parte aqui marcar o "Checkbox" -->
      <label class="theme-switch" for="${id}">
        <!-- Checkbox Escondido. Sua única função é gerenciar Status Check via CSS PseudoClasses -->
        <input type="checkbox" id="${id}" />
        <!-- O Visual da "Bolinha Branca" que mexe e Icones dentro.. -->
        <div class="slider round">
          ${onIcon}
          ${offIcon}
        </div>
      </label>
    </div>
  `;
}
