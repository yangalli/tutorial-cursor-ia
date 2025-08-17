# 📝 Todo App - Gerenciador de Tarefas Moderno

Um aplicativo completo de gerenciamento de tarefas construído com **Next.js**, **React**, **TypeScript** e **Tailwind CSS**.

## ✨ Funcionalidades

### 🏠 Dashboard Inteligente
- **Estatísticas em tempo real**: Total, pendentes, concluídas e em atraso
- **Todos prioritários**: Destaque para tarefas de alta prioridade
- **Todos recentes**: Visualização das tarefas mais recentes
- **Alertas de atraso**: Identificação visual de tarefas vencidas

### 📋 Gerenciamento Completo de Tarefas
- **Criar todos**: Formulário completo com título, descrição, prioridade e data de vencimento
- **Marcar como concluído**: Sistema de checkbox para completar tarefas
- **Deletar todos**: Remoção rápida de tarefas desnecessárias
- **Sistema de prioridades**: Alta, média e baixa com codificação por cores

### 🔍 Busca e Filtros Avançados
- **Busca por texto**: Pesquisar por título ou descrição
- **Filtros por status**: Todos, pendentes ou concluídos
- **Ordenação flexível**: Por data (mais novo/antigo), prioridade ou data de vencimento
- **Contadores dinâmicos**: Exibição em tempo real das quantidades

### 🎨 Design e UX
- **Design responsivo**: Funciona perfeitamente em desktop e mobile
- **Dark mode**: Suporte nativo ao modo escuro
- **Animações suaves**: Transições e feedback visual
- **Estados vazios**: Orientações claras quando não há dados
- **Acessibilidade**: Suporte a teclado e screen readers

### 💾 Persistência de Dados
- **LocalStorage**: Dados salvos automaticamente no navegador
- **Sincronização automática**: Estado sempre atualizado
- **Recuperação de dados**: Carregamento automático na inicialização

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd tutorial-cursor-ia

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── create/            # Página de criação de todos
│   ├── todos/             # Página de listagem de todos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard (página inicial)
├── components/            # Componentes reutilizáveis
│   ├── Navigation.tsx     # Barra de navegação
│   ├── TodoCard.tsx       # Card de todo individual
│   └── TodoForm.tsx       # Formulário de criação
├── contexts/              # Context API para estado global
│   └── TodoContext.tsx    # Estado e operações dos todos
├── types/                 # Definições TypeScript
│   └── todo.ts           # Interfaces e tipos
└── services/             # Serviços (futuras integrações)
```

### Tecnologias Utilizadas

- **Next.js 15**: Framework React com App Router
- **React 18**: Biblioteca para interfaces de usuário
- **TypeScript**: Tipagem estática para JavaScript
- **Tailwind CSS**: Framework de CSS utility-first
- **Context API**: Gerenciamento de estado global

## 📱 Páginas e Funcionalidades

### 🏠 Home (`/`)
Dashboard principal com:
- Estatísticas rápidas (total, pendentes, concluídas, em atraso)
- Seção de todos de alta prioridade
- Todos recentes criados
- Alertas para todos em atraso
- Botões de ação rápida

### ➕ Criar Todo (`/create`)
Formulário completo para criação com:
- Campo obrigatório de título
- Descrição opcional
- Seleção de prioridade (alta, média, baixa)
- Data de vencimento opcional
- Validação em tempo real
- Dicas de boas práticas

### 📋 Todos (`/todos`)
Listagem completa com:
- Grid responsivo de cards
- Busca por texto em tempo real
- Filtros por status (todos, pendentes, concluídos)
- Ordenação por data, prioridade ou vencimento
- Estatísticas resumidas
- Estados vazios informativos

## 🎯 Componentes Principais

### `TodoCard`
- Exibição visual rica de cada todo
- Cores baseadas na prioridade
- Indicadores de vencimento
- Ações de toggle e deletar
- Suporte a dark mode

### `TodoForm`
- Validação completa do formulário
- Feedback de erros em tempo real
- Reset automático após envio
- Campos opcionais e obrigatórios

### `Navigation`
- Navegação responsiva
- Badges com contadores
- Indicador de página ativa
- Menu mobile

## 🔧 Funcionalidades Técnicas

### Context API
O `TodoContext` gerencia todo o estado da aplicação:
- Lista de todos
- Operações CRUD (Create, Read, Update, Delete)
- Persistência automática em localStorage
- Hooks customizados para acesso aos dados

### TypeScript
Tipagem completa para:
- Interfaces de Todo
- Props de componentes
- Estados e contextos
- Eventos e formulários

### Responsividade
- Design mobile-first
- Breakpoints personalizados
- Grid adaptável
- Menu mobile funcional

## 🎨 Design System

### Cores e Prioridades
- **Alta prioridade**: Vermelho (bg-red-50, border-red-500)
- **Média prioridade**: Amarelo (bg-yellow-50, border-yellow-500)
- **Baixa prioridade**: Verde (bg-green-50, border-green-500)

### Estados Visuais
- **Concluído**: Opacidade reduzida, texto riscado
- **Em atraso**: Anel vermelho, texto destacado
- **Hover**: Sombra elevada, transições suaves

## 🚀 Melhorias Futuras

- [ ] Backend com API REST
- [ ] Autenticação de usuários
- [ ] Colaboração em tempo real
- [ ] Notificações push
- [ ] Categorias personalizadas
- [ ] Subtarefas
- [ ] Exportação de dados
- [ ] Temas personalizáveis

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ usando as melhores práticas de React e Next.js
