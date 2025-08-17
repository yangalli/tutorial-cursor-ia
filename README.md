# 🏛️ Sistema de Patrimônio

Sistema completo de gestão de patrimônio e inventário desenvolvido com Next.js, React, Tailwind CSS e shadcn/ui.

## ✨ Funcionalidades

- **Autenticação**: Sistema de login com diferentes níveis de usuário
- **Gestão de Patrimônio**: Cadastro, edição e controle de bens patrimoniais
- **Gestão de Inventário**: Controle de itens de consumo e materiais
- **Categorização**: Sistema flexível de categorias para patrimônio e inventário
- **Relatórios**: Geração de relatórios mensais e estatísticas
- **Integração**: Preparado para integração com sistemas externos
- **Responsivo**: Interface adaptável para desktop e mobile

## 🚀 Tecnologias

- **Frontend**: Next.js 15 + React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: PostgreSQL + Prisma ORM
- **Cloud**: Supabase (banco de dados e autenticação)
- **TypeScript**: Tipagem estática completa

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL (local ou Supabase)
- Conta no Supabase (recomendado)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd tutorial-cursor-ia
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/patrimonio_db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Configure o banco de dados**
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma migrate dev

# (Opcional) Popule com dados de teste
npx prisma db seed
```

5. **Execute o projeto**
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 🗄️ Estrutura do Banco de Dados

### Entidades Principais

- **Escola**: Instituições educacionais
- **Usuario**: Usuários do sistema com diferentes níveis de acesso
- **Patrimonio**: Bens patrimoniais com depreciação
- **Inventario**: Itens de consumo e materiais
- **CategoriaPatrimonio**: Categorias para patrimônio com tempo de depreciação
- **CategoriaInventario**: Categorias para inventário
- **DocumentoPatrimonio/Inventario**: Documentos associados aos itens

### Relacionamentos

- Usuários podem pertencer a múltiplas escolas
- Cada item (patrimônio/inventário) pertence a uma escola
- Itens são categorizados por tipo
- Documentos são vinculados aos itens

## 👥 Tipos de Usuário

- **admin**: Acesso total ao sistema
- **secretario**: Gestão de patrimônio e relatórios
- **chefe_de_filial**: Gestão da escola específica
- **usuario**: Visualização e operações básicas

## 📱 Interface

### Dashboard
- Visão geral com estatísticas
- Atividades recentes
- Ações rápidas
- Resumo por escola

### Categorias
- Gestão de categorias de patrimônio e inventário
- Tempo de depreciação para patrimônio
- Interface com abas organizadas

### Navegação
- Sidebar responsiva
- Menu mobile otimizado
- Breadcrumbs e navegação intuitiva

## 🔧 Desenvolvimento

### Estrutura de Pastas
```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   ├── (dashboard)/       # Rotas do dashboard
│   └── layout.tsx         # Layout principal
├── components/             # Componentes React
│   └── ui/                # Componentes shadcn/ui
├── lib/                    # Utilitários e configurações
├── types/                  # Definições TypeScript
└── hooks/                  # Hooks customizados
```

### Componentes UI
- **Button**: Botões com variantes e tamanhos
- **Card**: Cards para exibição de conteúdo
- **Dialog**: Modais e diálogos
- **Input**: Campos de entrada
- **Select**: Seletores dropdown
- **Tabs**: Abas organizacionais
- **Toast**: Notificações do sistema

### Estilização
- **Tailwind CSS v4**: Utility-first CSS
- **Design System**: Variáveis CSS consistentes
- **Responsivo**: Mobile-first approach
- **Tema**: Suporte a modo claro/escuro

## 📊 Funcionalidades Futuras

- [ ] CRUD completo de Patrimônio
- [ ] CRUD completo de Inventário
- [ ] Sistema de upload de documentos
- [ ] Relatórios avançados
- [ ] Integração com sistema externo
- [ ] Dashboard analítico
- [ ] Notificações em tempo real
- [ ] API REST completa

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Outras Plataformas
- Netlify
- Railway
- Heroku
- AWS/GCP

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ usando Next.js, React e Tailwind CSS**
