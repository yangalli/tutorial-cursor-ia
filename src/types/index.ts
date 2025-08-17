// Tipos baseados no schema do Prisma

export type TipoUsuario = 'admin' | 'secretario' | 'chefe_de_filial' | 'usuario'

export type StatusItem = 'ativo' | 'inativo' | 'manutencao' | 'obsoleto' | 'vendido'

// Interfaces para as entidades principais
export interface Escola {
  id: number
  nome: string
  siglaMercurio: string
  createdAt: Date
  updatedAt: Date
}

export interface Usuario {
  id: number
  codMercurio: number
  nome: string
  email: string
  senha: string
  tipoUsuario: TipoUsuario
  createdAt: Date
  updatedAt: Date
}

export interface EscolaUsuario {
  id: number
  escolaId: number
  usuarioId: number
  nivelAcesso: number
  createdAt: Date
  updatedAt: Date
  escola?: Escola
  usuario?: Usuario
}

export interface CategoriaPatrimonio {
  id: number
  nome: string
  tempoDepreciacao: number
  requisitos?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface CategoriaInventario {
  id: number
  nome: string
  requisitos?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Patrimonio {
  id: number
  escolaId: number
  categoriaPatrimonioId: number
  nome: string
  descricao?: string
  dataAquisicao: Date
  valorAquisicaoReais: number
  valorAquisicaoDolares?: number
  valorAquisicaoEuros?: number
  status: StatusItem
  caracteristicas?: Record<string, any>
  historico?: Record<string, any>
  valorAtual?: number
  createdAt: Date
  updatedAt: Date

  // Relacionamentos
  escola?: Escola
  categoriaPatrimonio?: CategoriaPatrimonio
  documentos?: DocumentoPatrimonio[]
}

export interface Inventario {
  id: number
  escolaId: number
  categoriaInventarioId: number
  nome: string
  descricao?: string
  dataAquisicao: Date
  valorAquisicaoReais: number
  valorAquisicaoDolares?: number
  valorAquisicaoEuros?: number
  status: StatusItem
  caracteristicas?: Record<string, any>
  historico?: Record<string, any>
  valorAtual?: number
  createdAt: Date
  updatedAt: Date

  // Relacionamentos
  escola?: Escola
  categoriaInventario?: CategoriaInventario
  documentos?: DocumentoInventario[]
}

export interface DocumentoPatrimonio {
  id: string
  patrimonioId: number
  nomeArquivo: string
  descricao?: string
  urlArquivo: string
  tipoArquivo?: string
  tamanho?: number
  createdAt: Date
  updatedAt: Date

  // Relacionamentos
  patrimonio?: Patrimonio
}

export interface DocumentoInventario {
  id: string
  inventarioId: number
  nomeArquivo: string
  descricao?: string
  urlArquivo: string
  tipoArquivo?: string
  tamanho?: number
  createdAt: Date
  updatedAt: Date

  // Relacionamentos
  inventario?: Inventario
}

// Tipos para formulários
export interface CreateCategoriaPatrimonioData {
  nome: string
  tempoDepreciacao: number
  requisitos?: Record<string, any>
}

export interface CreateCategoriaInventarioData {
  nome: string
  requisitos?: Record<string, any>
}

export interface CreatePatrimonioData {
  escolaId: number
  categoriaPatrimonioId: number
  nome: string
  descricao?: string
  dataAquisicao: Date
  valorAquisicaoReais: number
  valorAquisicaoDolares?: number
  valorAquisicaoEuros?: number
  status?: StatusItem
  caracteristicas?: Record<string, any>
}

export interface CreateInventarioData {
  escolaId: number
  categoriaInventarioId: number
  nome: string
  descricao?: string
  dataAquisicao: Date
  valorAquisicaoReais: number
  valorAquisicaoDolares?: number
  valorAquisicaoEuros?: number
  status?: StatusItem
  caracteristicas?: Record<string, any>
}

// Tipos para autenticação
export interface LoginData {
  email: string
  senha: string
}

export interface RegisterData {
  codMercurio: number
  nome: string
  email: string
  senha: string
  tipoUsuario: TipoUsuario
}

// Tipos para relatórios
export interface RelatorioMensal {
  mes: number
  ano: number
  escolaId: number
  totalPatrimonio: number
  totalInventario: number
  valorTotalPatrimonio: number
  valorTotalInventario: number
  itensNovos: number
  itensVendidos: number
  itensEmManutencao: number
}
