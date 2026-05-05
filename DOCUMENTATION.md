# Documentação Técnica - Sistema Lyra (Secretaria Digital)

Este documento descreve a arquitetura técnica, as decisões de design e as funcionalidades do Sistema Lyra, focado na gestão acadêmica e administrativa.

## 1. Arquitetura do Sistema
O sistema foi construído utilizando **Vanilla JavaScript (SPA)** com manipulação direta do DOM, garantindo alta performance e leveza.

- **Frontend**: Vite + Tailwind CSS (com tema customizado Liquid Glass).
- **Gerenciamento de Estado**: Localizado em `src/store.js`, utiliza um padrão de **Single Source of Truth** persistido no `localStorage`.
- **Navegação**: Sistema de rotas baseado em IDs de view (`#main-view-surface`).

## 2. Motor de Dados (State Engine)
O arquivo `src/store.js` atua como o cérebro da aplicação:
- **db**: Um objeto que encapsula o acesso ao armazenamento local.
- **State**: Um singleton que gerencia login, mutações e eventos globais.
- **Principais Métodos**:
    - `login(reg, pass)`: Autentica usuários (Estudantes, Professores e Admins).
    - `registerEntity/updateProfessor`: Persistem novos dados com validação de ID único.
    - `deleteEntity(id, type)`: Remove registros de forma atômica.

## 3. Portal da Secretaria (Admin)
O portal administrativo (`src/pages/admin.js`) é a área mais robusta do sistema, permitindo:
- **Gestão Docente**: Cadastro e Edição de professores interligados à base de cursos.
- **Gestão de Cursos**: Criação e remoção de módulos escolares.
- **Segurança Admin**: Criação de novos usuários com privilégios de secretaria.
- **Identidade Visual**: Alteração global da logomarca institucional via URL ou Upload Local.

## 4. Identidade Institucional (Tema Liquid Glass)
Definido em `src/index.css`, o tema utiliza:
- **Glassmorphism**: Desfoque de fundo e bordas translúcidas para uma interface moderna.
- **Animações**: `fade-in` e `slide-up` para transições suaves entre abas e modais.
- **Tipografia**: Uso da fonte *Outfit* para títulos e *Inter* para leitura técnica.

## 5. Segurança de Dados
- **Imutabilidade**: Alunos e Professores não podem alterar seus dados base (Nome, RG, CPF, Matrícula).
- **Hierarquia**: Apenas membros da Secretaria (Admins) possuem acesso às funções de escrita em perfis e configurações globais.
- **Backup Local**: Os dados permanecem salvos no navegador do administrador, mesmo após o fechamento da aba.

---
*Equipe de Desenvolvimento Lyra • 2024*
