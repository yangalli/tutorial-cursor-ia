# Configuração do Supabase

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Exemplo de formato:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Como obter as credenciais:

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto
4. Vá para Settings > API
5. Copie a URL do projeto e a anon key

## Estrutura do Banco de Dados

O sistema espera as seguintes tabelas no Supabase:

### escolas
- id (uuid, primary key)
- nome (text)
- endereco (text)
- telefone (text)
- email (text)
- diretor (text)
- created_at (timestamp)
- updated_at (timestamp)

### usuarios
- id (uuid, primary key)
- nome (text)
- email (text)
- role (text)
- escola_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

### patrimonio
- id (uuid, primary key)
- escola_id (uuid, foreign key)
- categoria_patrimonio_id (uuid, foreign key)
- nome (text)
- descricao (text)
- data_aquisicao (date)
- valor_aquisicao_reais (numeric)
- valor_aquisicao_dolares (numeric)
- valor_aquisicao_euros (numeric)
- status (text)
- caracteristicas (jsonb)
- historico (jsonb)
- valor_atual (numeric)
- created_at (timestamp)
- updated_at (timestamp)

### inventario
- id (uuid, primary key)
- escola_id (uuid, foreign key)
- categoria_inventario_id (uuid, foreign key)
- nome (text)
- descricao (text)
- data_aquisicao (date)
- valor_aquisicao_reais (numeric)
- valor_aquisicao_dolares (numeric)
- valor_aquisicao_euros (numeric)
- status (text)
- caracteristicas (jsonb)
- historico (jsonb)
- valor_atual (numeric)
- created_at (timestamp)
- updated_at (timestamp)

## Políticas de Segurança (RLS)

Configure as políticas de segurança para controlar o acesso aos dados:

```sql
-- Exemplo de política para patrimônio
CREATE POLICY "Usuários podem ver patrimônio da sua escola" ON patrimonio
FOR SELECT USING (escola_id IN (
  SELECT escola_id FROM usuarios WHERE id = auth.uid()
));

-- Exemplo de política para inventário
CREATE POLICY "Usuários podem ver inventário da sua escola" ON inventario
FOR SELECT USING (escola_id IN (
  SELECT escola_id FROM usuarios WHERE id = auth.uid()
));
```
