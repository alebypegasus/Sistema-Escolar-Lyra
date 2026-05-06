# Sistema Escolar Lyra - Documentação Técnica Detalhada

O Sistema Escolar Lyra é uma Single Page Application (SPA) ultra-leve e de alta performance, projetada para a gestão acadêmica moderna. Baseado na filosofia de design *"Liquid Glass"*, o sistema prioriza a transparência, profundidade visual e uma experiência de usuário fluida.

---

## 1. Arquitetura do Sistema (Engine & Core)

O Lyra opera como um motor de renderização dinâmica que utiliza **Vanilla JavaScript** e **Template Injection**, evitando a complexidade de Virtual DOMs pesados.

### 1.1. Fluxo de Inicialização (Bootstrap)
1. **Ponto de Entrada**: O `index.html` carrega `script.js` como um módulo ES6.
2. **Hidratação de Estado**: `store.js` gerencia a persistência via `localStorage`. Na primeira execução, os dados são extraídos de `/src/db/*.json`.
3. **Roteamento Interno**: O sistema utiliza um `switch` de rotas no `script.js` que gerencia o estado da visualização sem recarregar a página, mantendo a reatividade através de funções de renderização (`renderApp()`).

### 1.2. Padrões de Design: Liquid Glass
- **Transparência Adaptativa**: Uso intensivo de `backdrop-filter: blur(20px)` e cores com canal alfa (RGBA).
- **Hierarquia Visual**: Sombras suaves e bordas finas (1px) definem os limites dos componentes sem saturar a visão.
- **Micro-interações**: Transições baseadas em curvas de Bezier cúbicas (`cubic-bezier(0.34, 1.56, 0.64, 1)`) proporcionam um feedback tátil e orgânico.

---

## 2. Gestão de Estado (Store Context)

O `store.js` implementa o padrão **Centralized State Object**, atuando como a única fonte de verdade da aplicação.

### 2.1. Entidades Principais
- **Students (Alunos)**: Dados biográficos, matrículas (RA), histórico acadêmico por semestre, médias e registros de frequência.
- **Professors (Docentes)**: Especialidades vinculadas às disciplinas, horários e ID de registro.
- **Admins (Gestores)**: Usuários com flag `isAdmin: true` que desbloqueiam o portal de Secretaria.
- **Subjects (Disciplinas)**: Vinculam alunos a professores e armazenam notas e presenças.

### 2.2. Persistência e Integridade
O sistema utiliza um `DB_VERSION` para gerenciar migrações de esquema no `localStorage`. Sempre que uma mudança estrutural ocorre, o sistema detecta e re-sincroniza os dados, garantindo que o cache do navegador nunca corrompa a experiência.

---

## 3. Segurança e Validações

Camadas de integridade protegem os dados sensíveis:
- **Regex Guarding**: CPF e RG são sanitizados e validados por comprimento e formato antes da persistência.
- **Route Guards**: Verificações de permissão (`isAdmin`) impedem que alunos ou professores acessem rotas administrativas via manipulação de URL/Estado.
- **Password Obfuscation**: Embora armazenadas localmente para fins de demonstração, as senhas são tratadas de forma isolada nos formulários e limpadas do estado volátil após o login.

---

## 4. Detalhamento de Funcionalidades

### 4.1. Secretaria (Admin Dashboard)
- **Matrículas Bulk**: Ferramentas de exclusão em massa e exportação para CSV/PDF.
- **Filtros Avançados**: Busca em tempo real por Nome/RA e filtro por Turno (Manhã, Tarde, Noite).
- **Branding Engine**: Permite trocar a logomarca de toda a instituição (URL externa ou upload base64) e informações de rodapé instantaneamente.

### 4.2. Perfil do Aluno (Expandable History)
- **Academic Detail**: Botão "Ver Detalhes" que aciona um Accordion reativo para mostrar o histórico semestral completo.
- **Indicadores de Performance**: Uso de cores semânticas (Verde/Vermelho) para sinalizar rapidamente notas acima ou abaixo da média (7.0) e frequência (75%).

### 4.3. Sistema de Notificações
- Sistema desacoplado em `notifications.js` que permite disparar alertas globais de sucesso ou erro, integrados ao fluxo de salvamento do `State`.

---

## 5. Estrutura de Arquivos

```text
/src
  /components     # Componentes reutilizáveis (NavBar, Footer)
  /db             # Fontes de dados JSON iniciais
  /pages          # Motores de renderização de cada página
  script.js       # Orquestrador de rotas e eventos globais
  store.js        # Lógica de negócio e acesso ao Banco de Dados
  style.css       # Definições de variáveis de tema (Theming)
```

---

## 6. Como Estender o Sistema

Para adicionar uma nova página:
1. Crie o arquivo em `src/pages/nova-pagina.js`.
2. Exporte uma função `renderNovaPagina(container, State)`.
3. Adicione a rota no `script.js` dentro da função `renderAppStructure()`.
4. Vincule os eventos no `setupInteractions()` correspondente.
