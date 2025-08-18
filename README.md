# 🏛️ Backend - Sistema de Patrimônio Nova Acrópole

Backend em NestJS para o sistema de gestão de patrimônio e inventário da Nova Acrópole.

## 🚀 Tecnologias

- **Framework**: NestJS 10.x
- **Banco de Dados**: PostgreSQL 14+
- **ORM**: TypeORM
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI
- **Autenticação**: JWT (preparado para implementação)
- **CORS**: Configurado para frontend Next.js

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e navegue para o backend:**
```bash
cd backend-patrimonio
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados:**
```bash
# Execute o script SQL para criar as tabelas
psql -U seu_usuario -d seu_banco -f database/schema.sql
```

5. **Execute a aplicação:**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=patrimonio

# Aplicação
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Segurança
JWT_SECRET=sua_chave_jwt_secreta
JWT_EXPIRES_IN=24h
```

### Banco de Dados

O sistema utiliza PostgreSQL com as seguintes características:

- **UUIDs** para todas as chaves primárias
- **JSONB** para campos flexíveis (características, histórico)
- **Triggers** para atualização automática de timestamps
- **Índices** para otimização de consultas
- **Constraints** para integridade referencial

## 🏗️ Estrutura do Projeto

```
src/
├── entities/           # Entidades TypeORM
│   ├── escola.entity.ts
│   ├── usuario.entity.ts
│   ├── escola-usuario.entity.ts
│   ├── categoria-patrimonio.entity.ts
│   ├── categoria-inventario.entity.ts
│   ├── patrimonio.entity.ts
│   ├── documento-patrimonio.entity.ts
│   ├── inventario.entity.ts
│   └── documento-inventario.entity.ts
├── dto/               # Data Transfer Objects
│   ├── create-escola.dto.ts
│   ├── update-escola.dto.ts
│   ├── create-usuario.dto.ts
│   └── create-patrimonio.dto.ts
├── services/          # Lógica de negócio
│   └── escola.service.ts
├── controllers/       # Controladores REST
│   └── escola.controller.ts
├── app.module.ts      # Módulo principal
└── main.ts           # Configuração da aplicação
```

## 📊 Entidades do Sistema

### 🏫 Escola
- **id**: UUID único
- **nome**: Nome da escola
- **siglaMercurio**: Sigla no sistema externo (único)
- **endereco**: Endereço completo
- **telefone**: Telefone de contato
- **email**: Email institucional
- **diretor**: Nome do diretor

### 👤 Usuário
- **id**: UUID único
- **codMercurio**: Código no sistema externo (único)
- **nome**: Nome completo
- **email**: Email (único)
- **password**: Senha criptografada
- **role**: Nível de acesso (admin, secretario, chefe_de_filial, usuario)
- **ativo**: Status ativo/inativo

### 🔗 Escola-Usuário
- **escolaId**: Referência à escola
- **usuarioId**: Referência ao usuário
- **nivelAcesso**: Nível específico na escola
- **createdAt**: Data de criação do vínculo

### 📦 Categorias
- **Patrimônio**: Com tempo de depreciação
- **Inventário**: Para itens de consumo

### 🏷️ Patrimônio/Inventário
- **escolaId**: Escola proprietária
- **categoriaId**: Categoria do item
- **nome**: Nome do item
- **descricao**: Descrição detalhada
- **dataAquisicao**: Data de aquisição
- **valores**: Em reais, dólares e euros
- **status**: ativo, inativo, manutencao, depreciado, vendido
- **caracteristicas**: JSONB para dados flexíveis
- **historico**: JSONB para histórico de alterações
- **valorAtual**: Valor atual do item

### 📄 Documentos
- **patrimonioId/inventarioId**: Referência ao item
- **descricao**: Descrição do documento
- **nomeArquivo**: Nome original do arquivo
- **urlArquivo**: URL para acesso
- **tipoArquivo**: Tipo MIME
- **tamanhoArquivo**: Tamanho em bytes

## 🚀 Endpoints Disponíveis

### Escolas (`/api/v1/escolas`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/` | Criar nova escola |
| `GET` | `/` | Listar todas as escolas |
| `GET` | `/:id` | Buscar escola por ID |
| `GET` | `/sigla/:siglaMercurio` | Buscar por sigla Mercurio |
| `GET` | `/:id/estatisticas` | Estatísticas da escola |
| `PATCH` | `/:id` | Atualizar escola |
| `DELETE` | `/:id` | Excluir escola |

### Exemplos de Uso

#### Criar Escola
```bash
curl -X POST http://localhost:3001/api/v1/escolas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Nova Acrópole - São Paulo",
    "siglaMercurio": "NA-SP",
    "endereco": "Rua Exemplo, 123",
    "telefone": "(11) 1234-5678",
    "email": "sp@novaacropole.com",
    "diretor": "João Silva"
  }'
```

#### Listar Escolas
```bash
curl http://localhost:3001/api/v1/escolas
```

#### Estatísticas da Escola
```bash
curl http://localhost:3001/api/v1/escolas/{id}/estatisticas
```

## 📚 Documentação da API

A documentação Swagger está disponível em:
```
http://localhost:3001/api
```

## 🔒 Segurança

### Autenticação (Preparado para implementação)
- JWT para autenticação
- Roles baseados em usuário
- Middleware de autorização

### Validação
- Validação automática de DTOs
- Sanitização de dados
- Tratamento de erros padronizado

### CORS
- Configurado para frontend Next.js
- Credenciais habilitadas
- Origem configurável

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Docker (Preparado para implementação)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 📈 Próximos Passos

### Implementações Imediatas
1. **Autenticação JWT**
   - Login/logout
   - Middleware de autorização
   - Refresh tokens

2. **Serviços Completos**
   - Usuário service
   - Patrimônio service
   - Inventário service
   - Categorias service

3. **Controllers Completos**
   - Todos os endpoints CRUD
   - Filtros e paginação
   - Relatórios

### Implementações Futuras
1. **Upload de Arquivos**
   - Integração com Supabase Storage
   - Validação de tipos
   - Compressão automática

2. **Relatórios Avançados**
   - Exportação PDF/Excel
   - Gráficos e dashboards
   - Agendamento de relatórios

3. **Notificações**
   - Sistema de alertas
   - Emails automáticos
   - Webhooks

4. **Integração Externa**
   - Sincronização com sistema Mercurio
   - APIs de terceiros
   - Webhooks de entrada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado para uso da Nova Acrópole.

## 🆘 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para a Nova Acrópole**
