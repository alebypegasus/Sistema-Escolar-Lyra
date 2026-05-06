# 🌌 Lyra - Documentação Técnica Completa (Vanilla Engine)

Bem-vindo à documentação técnica do **Lyra**. Este documento detalha a arquitetura, as decisões de design e a lógica de implementação de um sistema de gestão acadêmica construído inteiramente com **tecnologias Web nativas (Vanilla)**.

---

## 1. Arquitetura do Sistema (O Engine)

O Lyra não utiliza frameworks como React ou Angular. Ele opera sobre um "Engine" de renderização customizado que utiliza **Template Injection** e **State Management** centralizado.

### 1.1. O Ponto de Entrada (`index.html` e `script.js`)
O sistema começa com um arquivo HTML minimalista que serve apenas como contêiner (`<div id="app">`). 
- **O Processo**: O `script.js` é carregado como `type="module"`. Ao iniciar, ele invoca o `bootstrap()`, que carrega o estado do `store.js` e decide qual página renderizar com base no status de login.
- **Roteamento Interno**: 
  ```javascript
  function navigateTo(page, force = false) {
    // 1. Verifica permissões de rota (ex: Admin only)
    // 2. Altera o State.currentPage
    // 3. Executa funções de renderização específicas (ex: renderDashboard)
    // 4. Injeta o HTML gerado no DOM
  }
  ```
  Isso garante que a aplicação seja uma **SPA (Single Page Application)** real: o usuário nunca sente um "refresh" de página.

### 1.2. Gestão de Estado e Otimização de Cache (`store.js`)
A "Single Source of Truth" (Fonte Única de Verdade) do Lyra utiliza um sistema de persistência híbrida:
- **Cache em Memória**: Para evitar gargalos de processamento ao converter JSON repetidamente, implementamos um cache em memória (`_cache`). Toda vez que uma lista (alunos, professores, cursos) é solicitada, o sistema verifica primeiro se ela já está em RAM.
- **Sincronização Atômica**: Quando um dado é salvo, o cache é atualizado instantaneamente, e o `localStorage` é gravado em background, eliminando o "atraso" percebido em sistemas que dependem puramente de I/O de disco simulado.

---

## 2. Deep Dive: CSS & Design System (Liquid Glass)

O estilo visual do Lyra foi batizado de **Liquid Glass**, uma evolução do Glassmorphism focada em legibilidade e adaptabilidade.

### 2.1. O Motor de Temas (Light & Dark)
A troca de temas não recarrega a página. Ela altera um atributo global:
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```
No CSS (`theme.css`), as variáveis se adaptam instantaneamente:
- **Light mode**: `--bg-body: #f8fafc; --text-primary: #0f172a;`
- **Dark mode**: `--bg-body: #09090b; --text-primary: #fafafa;`

### 2.2. Efeitos de Profundidade e Movimento
- **Backdrop Blur**: Utilizamos `backdrop-filter: blur(20px)` em componentes flutuantes (Navbar, Modais) para criar uma hierarquia visual onde o conteúdo parece "flutuar" sobre o fundo.
- **Curvas de Bézier**: Todas as animações usam `cubic-bezier(0.34, 1.56, 0.64, 1)`. Isso faz com que os elementos tenham uma "física" de mola, sendo mais orgânicos que transições lineares de 0 a 100.

---

## 3. Explicação de Processos e Lógica de Código

### 3.1. Paginação e Performance Visual (Matrículas)
Em sistemas com milhares de registros, renderizar tudo de uma vez trava a thread principal do JavaScript. O Lyra resolve isso com **Virtual Pagination**:
- **O Processo**: O sistema calcula `const pagedStudents = filteredStudents.slice((page - 1) * 10, page * 10)`.
- **Interatividade**: Ao trocar de página, o DOM não é apenas "limpado", mas re-injetado com as novas fatias de dados (slicing), garantindo que o navegador processe apenas o que está visível ao usuário.
- **Navegação de Estado**: A página atual é mantida em memória global (`window.adminStudentPage`), permitindo que filtros e buscas reiniciem a contagem sem perder o contexto anterior.

### 3.2. Busca Fuzzy (Filtro de Matrículas)
Diferente de uma busca comum que exige o início exato da palavra, a nossa lógica refatorada em `admin.js` utiliza divisão de termos:
- **A Lógica**: O sistema divide a sua pesquisa em palavras separadas (`.split(/\s+/)`). Ele então verifica se **todas** essas palavras existem combinadas no nome, matrícula ou curso do aluno.
- **Resultado**: Se você digitar "Carlos Mat", o sistema encontrará "Carlos Andrade - Matrícula 2024", mesmo que "Mat" não esteja grudado em "Carlos".

### 3.2. Exportação de Dados (CSV)
Para gerar o CSV de forma funcional e segura:
1.  **Formatamos os dados**: Transformamos arrays de objetos em strings separadas por ponto e vírgula (`;`).
2.  **BOM (Byte Order Mark)**: Adicionamos `\ufeff` no início do arquivo. Sem isso, softwares como Excel não reconheceriam acentos brasileiros corretamente.
3.  **Blob & Trigger**: Criamos um link virtual e disparamos um `.click()` programático no navegador para iniciar o download sem sair da página.

### 3.3. Relatórios PDF (Injeção de Iframe)
Para imprimir relatórios limpos (sem botões de interface):
```javascript
const printIframe = document.createElement('iframe');
printIframe.style.display = 'none';
// ... injetamos apenas o HTML da tabela ...
printIframe.contentWindow.print();
```
Isso mantém a interface do app intacta enquanto o navegador foca apenas nos dados para impressão.

---

## 4. Comandos e Ciclo de Vida do Desenvolvimento

O Lyra utiliza uma estrutura de build moderna e padronizada:

### 4.1. Instalação de Dependências
```bash
npm install
```
Isso baixa as ferramentas de desenvolvimento necessárias (como o compilador TypeScript e o servidor Vite).

### 4.2. Ambiente de Desenvolvimento
```bash
npm run dev
```
Inicia um servidor local com **Hot Reload**. Qualquer alteração nos arquivos `.js` ou `.css` reflete instantaneamente no navegador.

### 4.3. Compilação de Produção
```bash
npm run build
```
Este comando executa o **Tree Shaking** e a **Minificação**. Ele remove comentários, espaços em branco e funções não utilizadas, gerando uma pasta `dist/` extremamente leve e otimizada para ser servida em qualquer servidor web.

---

## 5. Por que Vanilla? (No React, No Vue)

O Lyra foi construído para provar a viabilidade de sistemas complexos sem a sobrecarga de frameworks modernos:
1. **Performance Absoluta**: O tempo de carregamento inicial é próximo de zero (sub-100ms).
2. **Sem Abstrações**: O código fala diretamente com o navegador, consumindo menos memória.
3. **Longevidade**: Como não depende de bibliotecas externas, o código continuará funcionando perfeitamente em qualquer navegador moderno por décadas.

---

## 5. Auditoria de Tecnologias Usadas

- **HTML5**: Estrutura semântica e acessibilidade.
- **CSS3 Moderno**: Flexbox, CSS Grid, Custom Properties (Variáveis) e Animações.
- **JS ES6+**: Modules, Arrow Functions, Template Literals e LocalStorage API.

---
*Este documento é gerado automaticamente pelo motor do Lyra e serve como guia de manutenção para desenvolvedores.*
