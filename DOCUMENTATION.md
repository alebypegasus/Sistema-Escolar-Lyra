# Sistema Escolar Lyra - Documentação de Arquitetura

O Sistema Escolar Lyra é uma Single Page Application (SPA) baseada puramente em tecnologias Web Vanilla (HTML5, CSS3, e JavaScript ES6+). Seu design foi idealizado sob a filosofia *"Liquid Glass"*, priorizando transparências dinâmicas, responsividade fluida e interatividade profunda sem a necessidade de frameworks pesados (como React ou Angular).

---

## 1. Visão Geral da Arquitetura

O Lyra utiliza o padrão Model-View-Controller (MVC) simulado localmente.
- **Model**: Gerenciado pelo arquivo `src/store.js`. Representa o banco de dados e os métodos de interação com os dados persistentes no cache do navegador (`localStorage`).
- **View**: A UI é renderizada e manipulada através de templates de strings no Vanilla JS. Temos um arquivo responsável pela Navbar (`Navbar.js`), Footer (`Footer.js`) e corpo principal. O esqueleto carrega `src/components/Skeleton/Skeleton.js` como Loading Placeholder.
- **Controller**: O fluxo, injeção, rotas e transição visual (fade in/out com mola) são coordenados pelo núcleo em `src/script.js`.

### Ponto de Entrada
- `index.html`: Hospeda as roots (`#login-screen` e `#app-screen`). O JavaScript assume a tela após o botão login via DOMContentLoaded.
- `src/script.js`: Injeta e governa Views (`pages/*.js`) baseado no roteamento.

---

## 2. Padrões de Design e Identidade (Liquid Glass)

Nós implementamos layouts flutuantes através da manipulação do Z-Index e painéis com Back-drop Blur, usando Custom Properties puras.
- **Variáveis de CSS Globais** em `style.css` permitem temas customizáveis.
- **Glassmorfismo:** Elementos como o container administrativo e de relatórios têm propriedades que imitam o comportamento do vidro (translúcidos sobre fundos limpos).
- **Feedback Haptic Simulado:** Os botões (`btn-primary`, `btn-outline`) escalam para `0.98` ao serem pressionados.
- Tipografia baseada exclusivamente na família **Inter**, focada na facilidade de leitura e dados tabulares limpos nas grades.

---

## 3. Gestão de Estado & Persistência

Utilizamos o padrão **Store (Singleton)** exportado pelo `store.js`. Este módulo absorve um "Mock de Banco de Dados" inicial formatado em JSON na primeira visita, e após isso persiste as mudanças pelo `localStorage`.
- Quando um novo aluno é criado no Portal da Secretaria (`admin.js`), o código faz push no array correspondente, invocando `State.db.saveStudents(data)`. E todos os eventos subsequentes pegam automaticamente esse dado fresquinho.
- Dados guardados incluem *Corpo Docente, Matrículas, Notificações, Configurações de Branding e Dados Institucionais*.

---

## 4. O Flow do Roteamento (Router)

Quando uma navegação acontece via `navigateTo('dashboard')` em `script.js`:
1. Uma verificação de integridade valida as permissões. (Ex: Aluno não acessa admin).
2. Títulos auxiliares e Navbar badges são atualizados.
3. Elementos do corpo ativam `opacity: 0` junto a animações de `bezier`.
4. Os marcadores `#page-dashboard` injetam o Skeleton correspondente (card placeholder).
5. Ocorre um timer simulando carregamento (Para UX feedback) e funções `renderDashboard(container)` finalmente disparam.

---

## 5. Portal Acadêmico vs Secretaria (Acessos)

Estipula dois fluxogramas de operação baseados na FLAG de login:
- **Alunos e Professores**: Possibilitam gerenciar notas, justificar frequência em tempo real (modal dinâmico) e ver Dashboard escolar.
- **Administrativo / Secretaria**: Traz relatórios tabulares complexos, adição de grades através de modais interativos, edição bulk (em lotes) e alteração direta das configurações da marca da intituição, permitindo exportações em PDF e CSV de dados gerenciais.

---

## 6. Lógica Dinâmica de Cores e Temas

O sistema suporta injeções visuais interativas pela área de "Configurações" da Administração.
- Utilizando FileReader (Base64), armazenamos cópias da logo carregada em LS e populamos as flags `--theme-*` via injeção CSS do JS para alterar globalmente o site, mantendo o DOM reactivo.
 
> *Nota: Você pode zerar o estado rodando o comando* `localStorage.clear()` *no terminal Web e apertando F5.*

---

## Extensibilidade & Contribuições 🚀

Para adicionar novas abas no modo Administador:
- Modifique a UI de tabulação em `src/pages/admin.js`.
- Crie o método de salvamento em `src/store.js`.
- Ancore os manipuladores base em `setupAdminInteractions`.
