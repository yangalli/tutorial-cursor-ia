-- Script de criação do banco de dados para o Sistema de Patrimônio - Nova Acrópole
-- Execute este script no seu banco PostgreSQL

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Escolas
CREATE TABLE escolas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    sigla_mercurio VARCHAR(100) UNIQUE NOT NULL,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    diretor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cod_mercurio VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'usuario' CHECK (role IN ('admin', 'secretario', 'chefe_de_filial', 'usuario')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento Escola-Usuário
CREATE TABLE escola_usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nivel_acesso VARCHAR(50) DEFAULT 'usuario' CHECK (nivel_acesso IN ('admin', 'secretario', 'chefe_de_filial', 'usuario')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(escola_id, usuario_id)
);

-- Tabela de Categorias de Patrimônio
CREATE TABLE categorias_patrimonio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    tempo_depreciacao INTEGER NOT NULL COMMENT 'Tempo de depreciação em meses',
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias de Inventário
CREATE TABLE categorias_inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Patrimônio
CREATE TABLE patrimonio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,
    categoria_patrimonio_id UUID NOT NULL REFERENCES categorias_patrimonio(id) ON DELETE RESTRICT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_aquisicao DATE NOT NULL,
    valor_aquisicao_reais DECIMAL(15,2) NOT NULL,
    valor_aquisicao_dolares DECIMAL(15,2),
    valor_aquisicao_euros DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'manutencao', 'depreciado', 'vendido')),
    caracteristicas JSONB,
    historico JSONB DEFAULT '[]',
    valor_atual DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Documentos de Patrimônio
CREATE TABLE documentos_patrimonio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patrimonio_id UUID NOT NULL REFERENCES patrimonio(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo VARCHAR(255),
    tipo_arquivo VARCHAR(100),
    tamanho_arquivo INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Inventário
CREATE TABLE inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,
    categoria_inventario_id UUID NOT NULL REFERENCES categorias_inventario(id) ON DELETE RESTRICT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_aquisicao DATE NOT NULL,
    valor_aquisicao_reais DECIMAL(15,2) NOT NULL,
    valor_aquisicao_dolares DECIMAL(15,2),
    valor_aquisicao_euros DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'manutencao', 'depreciado', 'vendido')),
    caracteristicas JSONB,
    historico JSONB DEFAULT '[]',
    valor_atual DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Documentos de Inventário
CREATE TABLE documentos_inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventario_id UUID NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo VARCHAR(255),
    tipo_arquivo VARCHAR(100),
    tamanho_arquivo INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_escolas_sigla_mercurio ON escolas(sigla_mercurio);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cod_mercurio ON usuarios(cod_mercurio);
CREATE INDEX idx_patrimonio_escola_id ON patrimonio(escola_id);
CREATE INDEX idx_patrimonio_categoria_id ON patrimonio(categoria_patrimonio_id);
CREATE INDEX idx_inventario_escola_id ON inventario(escola_id);
CREATE INDEX idx_inventario_categoria_id ON inventario(categoria_inventario_id);
CREATE INDEX idx_documentos_patrimonio_id ON documentos_patrimonio(patrimonio_id);
CREATE INDEX idx_documentos_inventario_id ON documentos_inventario(inventario_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas que têm updated_at
CREATE TRIGGER update_escolas_updated_at BEFORE UPDATE ON escolas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_patrimonio_updated_at BEFORE UPDATE ON categorias_patrimonio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_inventario_updated_at BEFORE UPDATE ON categorias_inventario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patrimonio_updated_at BEFORE UPDATE ON patrimonio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_patrimonio_updated_at BEFORE UPDATE ON documentos_patrimonio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_inventario_updated_at BEFORE UPDATE ON documentos_inventario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dados iniciais para categorias
INSERT INTO categorias_patrimonio (nome, tempo_depreciacao, descricao) VALUES
('Equipamentos de Informática', 60, 'Computadores, notebooks, impressoras, etc.'),
('Móveis e Utensílios', 120, 'Mesas, cadeiras, armários, etc.'),
('Equipamentos Audiovisuais', 84, 'Projetores, TVs, sistemas de som, etc.'),
('Veículos', 120, 'Carros, motos, etc.'),
('Imóveis', 360, 'Prédios, terrenos, etc.');

INSERT INTO categorias_inventario (nome, descricao) VALUES
('Material de Escritório', 'Papel, canetas, grampeadores, etc.'),
('Material de Limpeza', 'Produtos de limpeza, vassouras, etc.'),
('Material Didático', 'Livros, apostilas, etc.'),
('Consumíveis', 'Toner, papel, etc.'),
('Outros', 'Itens diversos');

-- Comentários nas tabelas
COMMENT ON TABLE escolas IS 'Tabela de escolas da Nova Acrópole';
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON TABLE escola_usuarios IS 'Relacionamento entre escolas e usuários com níveis de acesso';
COMMENT ON TABLE categorias_patrimonio IS 'Categorias para classificação do patrimônio';
COMMENT ON TABLE categorias_inventario IS 'Categorias para classificação do inventário';
COMMENT ON TABLE patrimonio IS 'Tabela principal de patrimônio';
COMMENT ON TABLE inventario IS 'Tabela principal de inventário';
COMMENT ON TABLE documentos_patrimonio IS 'Documentos relacionados ao patrimônio';
COMMENT ON TABLE documentos_inventario IS 'Documentos relacionados ao inventário';
