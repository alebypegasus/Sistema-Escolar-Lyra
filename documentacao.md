# Sistema Escolar Lyra - Documentação Completa e Guia do Desenvolvedor

Esta documentação foi elaborada para fornecer uma visão exaustiva e humana de como o Sistema Lyra funciona "por debaixo do capô". Se você é um desenvolvedor que está assumindo o projeto, este é o seu mapa do tesouro.

## 1. Visão Geral e Filosofia
O **Sistema Escolar Lyra** é uma plataforma de gestão escolar e acadêmica de alta performance. Diferente de aplicações modernas que utilizam frameworks pesados (como React, Angular ou Vue), o Lyra foi construído com foco puramente no **Vanilla JS (JavaScript Puro)**, aliado a HTML5 e CSS3 de última geração. 

A ideia é mostrar que é possível ter uma **Single Page Application (SPA)** extremamente performante, com roteamento em tempo real (sem recarregar a página), gerenciamento de estado e componentes reativos sem baixar nenhum pacote NPM pesado.

O foco da interface é o **SaaS UI Design avançado**, utilizando conceitos de "Glassmorphism" sutil (Liquid Glass), transições fluídas a 60 frames por segundo, tipografia clara, sombras suaves, cores definidas via tokens no CSS e um respeito profundo pela hierarquia visual e experiência do usuário (UX).

## 2. Árvore de Diretórios e Componentes (Arquitetura)

O ecossistema é modularizado da seguinte maneira:

- **`/index.html`**: O chassi. Só contém duas divs vazias (`#login-screen` e `#app-screen`), os links do CSS e o import do script principal. Não possui conteúdo bruto (hardcoded), tudo é injetado via JS.
- **`/src/script.js`**: O maestro (Entry point). Escuta quando o arquivo HTML carrega completamente e decide, baseado no `localStorage`, o que deve ser mostrado (Login ou o Sistema em si). Também gerencia os atalhos de teclado globais e orquestra a navegação.
- **`/src/store.js`**: O coração dos dados (State Manager/Banco de Dados Mock). Gerencia a Sessão do Usuário (Logado, Deslogado, Permissões) e simula as requisições para o banco através de abstrações do `localStorage`. Todo dado novo (matricular um aluno, criar uma nota) bate aqui antes.
- **`/src/modal.js`**: Controla os Popups centrais da aplicação e abriga as lógicas dos Botões Flutuantes de Ação (FAB).
- **`/src/notifications.js`**: Responsável pelo motor que faz as notificações aparecerem na tela, tanto as efêmeras ("Toast") quanto o dropdown superior na Navbar.
- **`/src/components/`**: Peças de montar (Lego) em formato de função JavaScript que retornam Strings HTML (`Template Literals`).
  - `Main/Main.js` e `Main.css`: O esqueleto do corpo (barra lateral de saudação, a view para injetar as páginas, etc).
  - `Navbar/Navbar.js` e `Navbar.css`: A barra superior, controle de avatar e contadores de notificações vermelhos.
- **`/src/pages/`**: O "Músculo" do negócio. Cada arquivo aqui tem uma função que retorna String HTML e, em seguida, uma função auxiliar que *"ouve"* toda essa String, adicionando eventos de clique (`addEventListener`).
  - `admin.js`: Área da Secretaria, restrita a gestores. Mostra e insere recursos (Alunos, Professores, Logotipos).
  - `grades.js`: Matriz de Notas onde os professores definem avaliações.
  - `profile.js`: Menu focado nas preferências do usuário em si.
  - `studentDetails.js`: Boletim completo de um aluno que pode ser aberto tanto por ele quanto pelo seu professor.
  - `presentation.js`: Splash Screen / Tela Vazia para preencher o vazio natural de um novo login.
- **`/src/styles/`**: As folhas de estilo da beleza.
  - `reset.css`: Padroniza o visual removendo margens padrão do Chrome/Safari.
  - `theme.css`: O DNA da interface. Variáveis globais (Design Tokens) que definem qual o azul exato, qual a sombra exata e afins.
  - `components.css`: Estilos genéricos para botões, inputs, animações keyframe (`.animate-fade-in`) e skeleton loaders (aquelas barrinhas de carregamento que piscam).
  - `pages.css`: Coisas que só poluem o visual de uma página específica.

---

## 3. Explicação Profunda do CSS e Layouts (A Interface)

A interface se baseia em **Utility Classes Customizadas** e **CSS Custom Properties (Variáveis Variantes)**. Se você for alterar a cor primária global da marca pelo código: vá para o `theme.css`.

- **Cadeia de Cores**: 
  Nós abusamos de hierarquias de cor como: `--bg-body` (mais escuro), `--bg-surface` (meio claro) e `--bg-panel` (bem claro). Isso cria profundidade tridimensional em painéis planos e é muito amigável com a visão (Dark Mode).
- **A Cor da Identidade (--accent)**: 
  A variável `--accent` atua como o principal motor colorido. Na tela de administração, existe um color-picker que sobrescreve temporariamente/permanentemente essa variável em JavaScript. Todos os botões primários `btn-primary`, contornos intensos de seleção ou *Pills* (Tags visuais) absorvem essa propriedade. 
- **Modais e Tabelas (UX)**:
  Nossos popups (modais) foram refeitos para habitarem no root do `body` na função de administração, corrigindo z-index bugs e falhas de formatação quando contidos dentro de áreas transformadas (`transform`). 
- **Transições Suaves**:
  Qualquer mudança de página passa por um `.animate-fade-in` de 400ms ou `pageEnter` (usando bezier curves), simulando a leveza do ecossistema macOS.

---

## 4. Roteamento Simulado (Router Cycle)

Ao contrário uma aplicação PHP tradicional, quando o usuário clica em "Alunos", a página não atualiza (recarrega). Acontece a seguinte orquestração no código:
1. Em `script.js`, a função mestre `navigateTo(paginaNome)` é chamada.
2. A tela anterior recebe um leve _Fade Out_ (desaparece) usando classes de esqueleto de carregamento (Skeletons).
3. Após 450ms, a aplicação limpa um `container.innerHTML` vazio e chama as funções apropriadas baseada na rota (Ex: se for 'admin', ele chama `renderAdmin(container)`).
4. Essa função engole dados dinâmicos do Banco Mockado (Store) usando `.map()` do JS ES6 e cospe uma string gigante formatadinha em HTML para o usuário.
5. Logo em seguida, ela invocar os "Binders" (Ex: `setupAdminInteractions()`) que vão colar um `addEventListener` em cada botão de lixeira (apagar) ou botão de edição (caneta) acabado de ser criado dinamicamente, os tornando vivos!

---

## 5. Gerenciamento de Dados e Mockando o Backend

A magia de funcionar localmente fica dentro do `store.js`.

### Objeto \`db\`
O objeto `db` atua como uma **DAO (Data Access Object)** ou banco de dados noSQL (tipo Firebase ou Mongo) em pequena escala usando `localStorage`. Quando a aplicação boota pela primeira vez, ela verifica se é a "Versão 14" e despeja os mocks hardcoded nos JSONs para o localStorage do cliente. A partir disso, alterações (salvar alunos) afetam o `localStorage` com `JSON.stringify()`.

### Objeto \`State\`
Ele gerencia a "vibe" do usuário num dado frame. Se está logado, quem é ele (`State.user.name...`), o tipo de papel e permissões (`State.userType = 'teacher' | 'student'`).
As funções de autenticação operam de forma cega com arrays simples `.find()`, testam matrícula / senha e cospem sucesso para o `script.js` trocar as credenciais.

---

## 6. Painel de Administração - Modernização

A página `admin.js` é um ótimo refúgio para entender nosso código:
- Ela possui uma `<aside>` estática lateral com menu (Professores, Alunos, etc).
- Para manter performance, alterar abas no admin **não faz o roteamento completo da página**. Ele só roda as modificações na `main#admin-active-content`, sobrescrevendo o DOM e em seguida refazendo os laços de Listeners.
- **Formulários de Modais**: Ao clicar em "+ Novo Professor", nós injetamos um form num modal fixo. Seus envios chamam as funções nativas de estado como `State.registerProfessor()` e re-desenham a tela perfeitamente!

Seja bem-vindo, mestre do código. O Lyra é leve, expansível e foi feito para evoluir sob seu comando. Modifique, brinque com o HTML Injection e explore um ambiente sem build steps!
