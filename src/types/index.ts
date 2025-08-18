// Tipos de usuário
export type UserRole = 'admin' | 'secretario' | 'chefe_de_filial' | 'usuario';

// Interface base para usuário
export interface User {
  id: string;
  codMercurio: string;
  nome: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para escola
export interface Escola {
  id: string;
  nome: string;
  siglaMercurio: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para relacionamento usuário-escola
export interface EscolaUsuario {
  escolaId: string;
  usuarioId: string;
  nivelAcesso: UserRole;
  createdAt: Date;
}

// Interface para categoria de patrimônio
export interface CategoriaPatrimonio {
  id: string;
  nome: string;
  tempoDepreciacao: number; // em meses
  createdAt: Date;
  updatedAt: Date;
}

// Interface para categoria de inventário
export interface CategoriaInventario {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

// Status dos itens
export type ItemStatus = 'ativo' | 'inativo' | 'manutencao' | 'depreciado' | 'vendido';

// Interface base para itens (patrimônio e inventário)
export interface BaseItem {
  id: string;
  escolaId: string;
  nome: string;
  descricao: string;
  dataAquisicao: Date;
  valorAquisicaoReais: number;
  valorAquisicaoDolares: number;
  valorAquisicaoEuros: number;
  status: ItemStatus;
  caracteristicas: Record<string, any>;
  historico: Array<{
    data: Date;
    descricao: string;
    valor?: number;
    tipo: 'manutencao' | 'depreciacao' | 'avaliacao' | 'outro';
  }>;
  valorAtual: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para patrimônio
export interface Patrimonio extends BaseItem {
  categoriaPatrimonioId: string;
  categoriaPatrimonio?: CategoriaPatrimonio;
}

// Interface para inventário
export interface Inventario extends BaseItem {
  categoriaInventarioId: string;
  categoriaInventario?: CategoriaInventario;
}

// Interface para documentos
export interface Documento {
  id: string;
  descricao: string;
  nomeArquivo: string;
  url: string;
  tamanho: number;
  tipo: string;
  createdAt: Date;
}

// Interface para documentos de patrimônio
export interface DocumentoPatrimonio extends Documento {
  patrimonioId: string;
}

// Interface para documentos de inventário
export interface DocumentoInventario extends Documento {
  inventarioId: string;
}

// Interface para autenticação
export interface AuthState {
  user: User | null;
  escola: Escola | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Interface para relatórios
export interface RelatorioMensal {
  id: string;
  escolaId: string;
  mes: number;
  ano: number;
  totalPatrimonio: number;
  totalInventario: number;
  valorTotalDepreciado: number;
  itensNovos: number;
  itensVendidos: number;
  createdAt: Date;
}

// Interface para filtros de busca
export interface FiltrosBusca {
  escolaId?: string;
  categoriaId?: string;
  status?: ItemStatus;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
  termo?: string;
}
