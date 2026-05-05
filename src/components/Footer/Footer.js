/**
 * ========================================================
 * FOOTER - JAVASCRIPT
 * Controla e renderiza o Rodapé da aplicação.
 * ========================================================
 */

// Importa o arquivo de estilo do rodapé para injetar na página
import './Footer.css';

/**
 * Função responsável por retornar o HTML estático do rodapé.
 * Calcula o ano atual automaticamente.
 * @returns {string} Código HTML do rodapé do site.
 */
export function getFooterHTML() {
  // Pega o ano atual baseando-se no relógio do sistema do usuário
  const currentYear = new Date().getFullYear();
  
  return `
    <footer class="footer-wrapper">
      <div class="footer-content">
        <div class="footer-brand">
          Firjan SENAI &copy; ${currentYear}
        </div>
        <ul class="footer-links">
          <li><a href="#">Termos de Uso</a></li>
          <li><a href="#">Privacidade</a></li>
          <li><a href="#">Suporte ao Aluno</a></li>
        </ul>
        <p>Sistema Escolar Lyra v2.0 - Desenvolvido para gerir seu futuro com estilo e fluidez.</p>
      </div>
    </footer>
  `;
}
